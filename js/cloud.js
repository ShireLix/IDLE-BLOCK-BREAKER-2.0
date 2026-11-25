/**
 * CloudAuthManager - Valódi Bejelentkezés, Regisztráció és Felhőmentés (Firebase Auth + Firestore)
 * + Offline biztonsági mentési kód (Export / Import) tartalékként.
 */
class CloudAuthManager {
  constructor(game) {
    this.game = game;
    this.app = null;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.isReady = false;
    this.isConfigured = false;
    this.lastCloudSaveMs = 0;
    this.pendingCloudSave = false;
    this.cloudAutoSaveTimer = 0;
    this.activeTab = 'login'; // 'login' | 'register'
    this.suppressNextAuthLoad = false;
    this.leaderboardUnsub = null;
  }

  init() {
    this.bindModalEvents();
    this.isConfigured = this.checkConfigValid();

    const warnBanner = document.getElementById('auth-config-warning');
    if (warnBanner) {
      warnBanner.style.display = this.isConfigured ? 'none' : 'block';
    }

    if (!this.isConfigured) {
      this.updateAuthUI();
      return;
    }

    if (typeof firebase === 'undefined' || !firebase.initializeApp) {
      console.warn('Firebase SDK nem töltődött be (offline mód vagy blokkolt script).');
      this.showError('A Firebase felhőszolgáltatás jelenleg nem érhető el (ellenőrizd a netkapcsolatot).');
      this.updateAuthUI();
      return;
    }

    try {
      const cfg = window.IDLE_BREAKOUT_FIREBASE_CONFIG;
      this.app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.isReady = true;

      // Maradjon bejelentkezve az oldalon az újratöltések között is
      this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

      this.auth.onAuthStateChanged((user) => this.handleAuthStateChanged(user));

      // Globális Firestore ranglista figyelése (tartós mentés offline játékosokkal együtt)
      this.listenCloudLeaderboard();
    } catch (err) {
      console.error('Firebase init hiba:', err);
      this.showError('Firebase inicializálási hiba: ' + (err.message || err));
      this.updateAuthUI();
    }
  }

  checkConfigValid() {
    const cfg = window.IDLE_BREAKOUT_FIREBASE_CONFIG;
    if (!cfg || typeof cfg !== 'object') return false;
    if (!cfg.apiKey || cfg.apiKey.includes('IDE_IRD')) return false;
    if (!cfg.projectId || cfg.projectId.includes('IDE_IRD')) return false;
    if (!cfg.authDomain || cfg.authDomain.includes('IDE_IRD')) return false;
    return true;
  }

  bindModalEvents() {
    const modal = document.getElementById('auth-modal');
    const openBtn = document.getElementById('btn-open-auth');
    const lbPcTrigger = document.getElementById('lb-auth-status-pc');
    const lbMobTrigger = document.getElementById('lb-auth-status-mobile');
    const closeX = document.getElementById('btn-close-auth');
    const closeFooter = document.getElementById('btn-close-auth-footer');

    const openModal = () => {
      this.clearError();
      this.hideDeleteConfirm();
      this.updateAuthUI();
      if (modal) modal.classList.add('open');
      if (window.soundEngine) window.soundEngine.playClickHit();
    };

    const closeModal = () => {
      this.hideDeleteConfirm();
      if (modal) modal.classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClickHit();
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (lbPcTrigger) lbPcTrigger.addEventListener('click', openModal);
    if (lbMobTrigger) lbMobTrigger.addEventListener('click', openModal);
    if (closeX) closeX.addEventListener('click', closeModal);
    if (closeFooter) closeFooter.addEventListener('click', closeModal);

    // Tab váltás: Bejelentkezés / Regisztráció
    const tabLogin = document.getElementById('btn-auth-tab-login');
    const tabReg = document.getElementById('btn-auth-tab-register');
    if (tabLogin) tabLogin.addEventListener('click', () => this.switchAuthTab('login'));
    if (tabReg) tabReg.addEventListener('click', () => this.switchAuthTab('register'));

    // Űrlapok
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.loginWithEmail();
      });
    }

    const regForm = document.getElementById('auth-register-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.registerWithEmail();
      });
    }

    // Bejelentkezett állapot műveletek
    const saveNowBtn = document.getElementById('btn-cloud-save-now');
    const loadNowBtn = document.getElementById('btn-cloud-load-now');
    const logoutBtn = document.getElementById('btn-auth-logout');
    const deleteOpenBtn = document.getElementById('btn-auth-delete-open');
    const deleteConfirmBtn = document.getElementById('btn-auth-delete-confirm');
    const deleteCancelBtn = document.getElementById('btn-auth-delete-cancel');

    if (saveNowBtn) saveNowBtn.addEventListener('click', () => this.saveToCloud(true));
    if (loadNowBtn) loadNowBtn.addEventListener('click', () => this.manualPullFromCloud());
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    if (deleteOpenBtn) deleteOpenBtn.addEventListener('click', () => this.openDeleteConfirm());
    if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', () => this.hideDeleteConfirm());
    if (deleteConfirmBtn) deleteConfirmBtn.addEventListener('click', () => this.deleteAccount());

    // Offline Biztonsági Kód (Export / Import)
    const exportBtn = document.getElementById('btn-export-save-code');
    const importBtn = document.getElementById('btn-import-save-code');
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportSaveCode());
    if (importBtn) importBtn.addEventListener('click', () => this.importSaveCode());
  }

  switchAuthTab(tab) {
    this.activeTab = tab;
    this.clearError();
    const isLogin = (tab === 'login');

    const tabLogin = document.getElementById('btn-auth-tab-login');
    const tabReg = document.getElementById('btn-auth-tab-register');
    const loginForm = document.getElementById('auth-login-form');
    const regForm = document.getElementById('auth-register-form');

    if (tabLogin) tabLogin.classList.toggle('active', isLogin);
    if (tabReg) tabReg.classList.toggle('active', !isLogin);
    if (loginForm) loginForm.style.display = isLogin ? 'flex' : 'none';
    if (regForm) regForm.style.display = isLogin ? 'none' : 'flex';
  }

  showError(msg) {
    const box = document.getElementById('auth-error-box');
    if (box) {
      box.textContent = msg;
      box.style.display = 'block';
    }
  }

  clearError() {
    const box = document.getElementById('auth-error-box');
    if (box) {
      box.textContent = '';
      box.style.display = 'none';
    }
  }

  setBusy(busy) {
    for (const id of [
      'btn-auth-submit-login',
      'btn-auth-submit-register',
      'btn-cloud-save-now',
      'btn-cloud-load-now',
      'btn-auth-logout',
      'btn-auth-delete-open',
      'btn-auth-delete-confirm',
      'btn-auth-delete-cancel'
    ]) {
      const el = document.getElementById(id);
      if (el) el.disabled = busy;
    }
  }

  translateFirebaseError(err) {
    const code = (err && err.code) || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Érvénytelen e-mail cím formátum!';
      case 'auth/user-disabled':
        return 'Ez a fiók le van tiltva.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Hibás e-mail cím vagy jelszó!';
      case 'auth/email-already-in-use':
        return 'Ezzel az e-mail címmel már regisztráltak fiókot!';
      case 'auth/weak-password':
        return 'A jelszónak legalább 6 karakter hosszúnak kell lennie!';
      case 'auth/requires-recent-login':
        return 'Biztonsági okból add meg újra a jelszavad a fiók törléséhez!';
      case 'auth/too-many-requests':
        return 'Túl sok sikertelen próbálkozás. Kérlek várj egy kicsit!';
      case 'auth/network-request-failed':
        return 'Hálózati hiba! Ellenőrizd az internetkapcsolatot.';
      case 'permission-denied':
        return 'Adatbázis jogosultsági hiba (ellenőrizd a Firestore szabályokat)!';
      default:
        return (err && err.message) ? err.message : 'Ismeretlen hiba történt.';
    }
  }

  async registerWithEmail() {
    this.clearError();
    if (!this.isReady) {
      this.showError('Előbb állítsd be a Firebase projekt adatait a js/firebase-config.js fájlban!');
      return;
    }

    const nameEl = document.getElementById('auth-reg-name');
    const emailEl = document.getElementById('auth-reg-email');
    const passEl = document.getElementById('auth-reg-password');

    const rawName = (nameEl ? nameEl.value : '').trim();
    const email = (emailEl ? emailEl.value : '').trim();
    const password = passEl ? passEl.value : '';

    const playerName = (rawName || this.game.playerName || 'Játékos').slice(0, 14);
    if (!email || !email.includes('@')) {
      this.showError('Kérlek adj meg egy érvényes e-mail címet!');
      return;
    }
    if (password.length < 6) {
      this.showError('A jelszó legalább 6 karakter hosszú legyen!');
      return;
    }

    this.setBusy(true);
    this.suppressNextAuthLoad = true;
    try {
      const cred = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = cred.user;
      if (user) {
        try {
          await user.updateProfile({ displayName: playerName });
        } catch (e) {}

        // Ha egy korábban kijelentkezett MÁSIK fiók adata maradt helyben, tiszta lappal induljon az új fiók!
        const existingLocal = this.game.readRawLocalSave();
        if (existingLocal && existingLocal.saveOwnerUid && existingLocal.saveOwnerUid !== user.uid) {
          this.game.resetToFreshGuestState(false);
        }

        this.game.setPlayerNameDirect(playerName);
        this.currentUser = user;
        await this.saveToCloud(true);
        this.updateAuthUI();
        this.game.showToast(`🎉 <strong>Sikeres regisztráció!</strong> Üdvözlünk, ${playerName}! A haladásod mostantól a felhőbe mentődik.`, 4500);
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('open');
      }
    } catch (err) {
      this.suppressNextAuthLoad = false;
      this.showError(this.translateFirebaseError(err));
    } finally {
      this.setBusy(false);
    }
  }

  async loginWithEmail() {
    this.clearError();
    if (!this.isReady) {
      this.showError('Előbb állítsd be a Firebase projekt adatait a js/firebase-config.js fájlban!');
      return;
    }

    const emailEl = document.getElementById('auth-login-email');
    const passEl = document.getElementById('auth-login-password');
    const email = (emailEl ? emailEl.value : '').trim();
    const password = passEl ? passEl.value : '';

    if (!email || !password) {
      this.showError('Add meg az e-mail címed és a jelszavad!');
      return;
    }

    this.setBusy(true);
    try {
      const cred = await this.auth.signInWithEmailAndPassword(email, password);
      if (cred && cred.user) {
        this.currentUser = cred.user;
        await this.syncOnLogin(cred.user, true);
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('open');
      }
    } catch (err) {
      this.showError(this.translateFirebaseError(err));
    } finally {
      this.setBusy(false);
    }
  }

  async logout() {
    this.clearError();
    if (!this.isReady) return;
    this.setBusy(true);
    try {
      // Kijelentkezés előtt még utoljára felhőbe mentjük a haladást
      if (this.currentUser) {
        await this.saveToCloud(true);
      }
      await this.auth.signOut();
      this.currentUser = null;
      this.game.resetToFreshGuestState(true);
      this.updateAuthUI();
      this.game.showToast('🚪 Sikeres kijelentkezés. A felhőmentésed biztonságban megmaradt!', 4000);
    } catch (err) {
      this.showError(this.translateFirebaseError(err));
    } finally {
      this.setBusy(false);
    }
  }

  openDeleteConfirm() {
    this.clearError();
    const box = document.getElementById('auth-delete-confirm-box');
    const openBtn = document.getElementById('btn-auth-delete-open');
    const passWrap = document.getElementById('auth-delete-password-wrap');
    const passInput = document.getElementById('auth-delete-password');

    if (passInput) passInput.value = '';
    let needsRecentAuth = false;
    const lastSignIn = this.currentUser && this.currentUser.metadata ? this.currentUser.metadata.lastSignInTime : null;
    if (lastSignIn) {
      const ageMs = Date.now() - new Date(lastSignIn).getTime();
      if (ageMs > 4 * 60 * 1000) needsRecentAuth = true;
    }

    if (passWrap) passWrap.style.display = needsRecentAuth ? 'flex' : 'none';
    if (openBtn) openBtn.style.display = 'none';
    if (box) box.style.display = 'flex';
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  hideDeleteConfirm() {
    const box = document.getElementById('auth-delete-confirm-box');
    const openBtn = document.getElementById('btn-auth-delete-open');
    const passWrap = document.getElementById('auth-delete-password-wrap');
    const passInput = document.getElementById('auth-delete-password');

    if (box) box.style.display = 'none';
    if (passWrap) passWrap.style.display = 'none';
    if (passInput) passInput.value = '';
    if (openBtn) openBtn.style.display = '';
  }

  async deleteAccount() {
    this.clearError();
    if (!this.isReady || !this.currentUser) return;

    const user = this.currentUser;
    const uid = user.uid;
    const passWrap = document.getElementById('auth-delete-password-wrap');
    const passInput = document.getElementById('auth-delete-password');
    const passVisible = passWrap && passWrap.style.display !== 'none';
    const password = passInput ? passInput.value : '';

    if (passVisible && !password) {
      this.showError('Add meg a jelszavad a fiók végleges törléséhez!');
      return;
    }

    this.setBusy(true);
    let userBackup = null;
    let lbBackup = null;
    let deletedFromFirestore = false;

    try {
      if (password && user.email && typeof firebase !== 'undefined' && firebase.auth && firebase.auth.EmailAuthProvider) {
        const cred = firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(cred);
      }

      if (this.db) {
        const userRef = this.db.collection('users').doc(uid);
        const lbRef = this.db.collection('leaderboard').doc(uid);
        try {
          const [uSnap, lSnap] = await Promise.all([userRef.get(), lbRef.get()]);
          if (uSnap.exists) userBackup = uSnap.data();
          if (lSnap.exists) lbBackup = lSnap.data();
          await Promise.all([userRef.delete(), lbRef.delete()]);
          deletedFromFirestore = true;
        } catch (fsErr) {
          console.warn('Firestore törlési figyelmeztetés:', fsErr);
        }
      }

      await user.delete();

      if (typeof this.game.clearRetainedMqttPlayer === 'function') {
        this.game.clearRetainedMqttPlayer(uid);
        this.game.clearRetainedMqttPlayer(this.game.myPlayerId);
      }

      this.currentUser = null;
      this.lastCloudSaveMs = 0;
      this.pendingCloudSave = false;

      if (this.game.remotePlayers) {
        for (const k of Object.keys(this.game.remotePlayers)) {
          const entry = this.game.remotePlayers[k];
          if (k === uid || k === this.game.myPlayerId || (entry && entry.uid === uid)) {
            delete this.game.remotePlayers[k];
          }
        }
        try {
          localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.game.remotePlayers));
        } catch (e) {}
      }

      this.hideDeleteConfirm();
      this.game.resetToFreshGuestState(true);
      this.updateAuthUI();

      const modal = document.getElementById('auth-modal');
      if (modal) modal.classList.remove('open');
      this.game.showToast('🗑️ Fiókod és az összes felhőmentésed véglegesen törölve lett.', 5000);
    } catch (err) {
      if (err && err.code === 'auth/requires-recent-login') {
        if (deletedFromFirestore && this.db) {
          try {
            const restores = [];
            if (userBackup) restores.push(this.db.collection('users').doc(uid).set(userBackup));
            if (lbBackup) restores.push(this.db.collection('leaderboard').doc(uid).set(lbBackup));
            if (restores.length > 0) await Promise.all(restores);
          } catch (restoreErr) {
            console.warn('Firestore visszaállítási hiba:', restoreErr);
          }
        }
        if (passWrap) passWrap.style.display = 'flex';
        if (passInput) {
          passInput.value = '';
          passInput.focus();
        }
      }
      this.showError(this.translateFirebaseError(err));
    } finally {
      this.setBusy(false);
    }
  }

  async handleAuthStateChanged(user) {
    this.currentUser = user || null;
    this.updateAuthUI();

    if (user) {
      if (typeof this.game.cleanupDuplicateMqttForUid === 'function') {
        this.game.cleanupDuplicateMqttForUid(user.uid);
      }
      if (this.suppressNextAuthLoad) {
        this.suppressNextAuthLoad = false;
        this.game.broadcastMyStatus();
        return;
      }
      await this.syncOnLogin(user, false);
      this.game.broadcastMyStatus();
    } else {
      this.game.renderLeaderboard();
    }
  }

  async syncOnLogin(user, fromExplicitLogin) {
    if (!this.db || !user) return;
    try {
      const docRef = this.db.collection('users').doc(user.uid);
      const snap = await docRef.get();

      if (snap.exists) {
        const cloudDoc = snap.data();
        const cloudSave = cloudDoc && cloudDoc.saveData ? cloudDoc.saveData : null;
        if (cloudSave) {
          const localRaw = this.game.readRawLocalSave();
          const sameOwner = localRaw && localRaw.saveOwnerUid === user.uid;
          const localIsNewer = sameOwner && ((localRaw.lastSavedAt || 0) > (cloudSave.lastSavedAt || 0));

          if (localIsNewer && !fromExplicitLogin) {
            // Ugyanazon a gépen ugyanazzal a fiókkal offline tovább játszott -> töltsük fel a frissebbet
            await this.saveToCloud(true);
          } else {
            // Ha másik gépen lépett be, vagy a felhő frissebb:
            const isGuestProgress = !fromExplicitLogin ? false : (!sameOwner && (this.game.level > 1 || this.game.getTotalBalls() > 0 || this.game.rebirthCount > 0));
            let shouldLoadCloud = true;
            if (isGuestProgress && !localRaw?.saveOwnerUid) {
              shouldLoadCloud = confirm(
                `A fiókodhoz már tartozik felhőmentés (Rebirth: ${cloudSave.rebirthCount || 0}, Level: ${cloudSave.level || 1}).\n\n` +
                `Betöltsük a felhőmentést? (A jelenlegi helyi vendég haladás felülírásra kerül.)`
              );
            }

            if (shouldLoadCloud) {
              this.game.applySaveData(cloudSave, { isLiveReload: true, ownerUid: user.uid });
              this.lastCloudSaveMs = cloudSave.lastSavedAt || Date.now();
              this.updateAuthUI();
              this.game.showToast(`☁️ <strong>Felhőmentés betöltve!</strong> Folytatás: Rebirth ${this.game.rebirthCount} | Szint ${this.game.level}`, 4500);
            } else {
              await this.saveToCloud(true);
            }
          }
        }
      } else if (fromExplicitLogin) {
        // Még nincs felhő dokumentum ehhez a fiókhoz -> hozzuk létre a jelenlegiből!
        await this.saveToCloud(true);
      }
    } catch (err) {
      console.error('Felhő betöltési hiba:', err);
      this.showError(this.translateFirebaseError(err));
    }
  }

  async manualPullFromCloud() {
    if (!this.currentUser || !this.db) return;
    this.clearError();
    this.setBusy(true);
    try {
      const snap = await this.db.collection('users').doc(this.currentUser.uid).get();
      if (!snap.exists || !snap.data().saveData) {
        this.showError('Még nincs mentett adat a felhőben ehhez a fiókhoz.');
        return;
      }
      const cloudSave = snap.data().saveData;
      this.game.applySaveData(cloudSave, { isLiveReload: true, ownerUid: this.currentUser.uid });
      this.lastCloudSaveMs = cloudSave.lastSavedAt || Date.now();
      this.updateAuthUI();
      this.game.showToast(`🔄 <strong>Frissítve a felhőből!</strong> (Rebirth ${this.game.rebirthCount} | Szint ${this.game.level})`, 3500);
    } catch (err) {
      this.showError(this.translateFirebaseError(err));
    } finally {
      this.setBusy(false);
    }
  }

  async saveToCloud(force = false) {
    if (!this.isReady || !this.db || !this.currentUser) return;
    const now = Date.now();
    if (!force && now - this.lastCloudSaveMs < 10000) {
      this.pendingCloudSave = true;
      return;
    }

    this.pendingCloudSave = false;
    try {
      const saveData = this.game.buildSaveData(this.currentUser.uid);
      const uid = this.currentUser.uid;
      const pName = (this.game.playerName || this.currentUser.displayName || 'Játékos').slice(0, 14);

      await this.db.collection('users').doc(uid).set({
        playerName: pName,
        email: this.currentUser.email || '',
        rebirths: this.game.rebirthCount || 0,
        level: this.game.level || 1,
        bricks: this.game.totalBricksDestroyed || 0,
        updatedAt: now,
        saveData
      }, { merge: true });

      // Ranglista rekord tartós szinkronizálása Firestore-ba is
      await this.db.collection('leaderboard').doc(uid).set({
        id: this.game.myPlayerId,
        uid,
        name: pName,
        rebirths: this.game.rebirthCount || 0,
        level: this.game.level || 1,
        bricks: this.game.totalBricksDestroyed || 0,
        ts: now
      }, { merge: true });

      this.lastCloudSaveMs = now;
      this.updateAuthUI();
      if (force) {
        this.game.showToast('☁️ Haladás elmentve a felhőbe!', 2500);
      }
    } catch (err) {
      console.warn('Felhőmentés hiba:', err);
      if (force) this.showError(this.translateFirebaseError(err));
    }
  }

  tick(dt) {
    if (!this.isReady || !this.currentUser) return;
    this.cloudAutoSaveTimer += dt;
    if (this.cloudAutoSaveTimer >= 15.0 || (this.pendingCloudSave && this.cloudAutoSaveTimer >= 10.0)) {
      this.cloudAutoSaveTimer = 0;
      this.saveToCloud(false);
    }
  }

  listenCloudLeaderboard() {
    if (!this.db) return;
    try {
      this.leaderboardUnsub = this.db.collection('leaderboard')
        .limit(60)
        .onSnapshot((snapshot) => {
          let removedAny = false;
          if (typeof snapshot.docChanges === 'function') {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'removed') {
                const d = change.doc.data() || {};
                const remUid = d.uid || change.doc.id;
                const remCid = d.id || null;
                if (this.game.remotePlayers) {
                  for (const k of Object.keys(this.game.remotePlayers)) {
                    const rp = this.game.remotePlayers[k];
                    if (k === remUid || k === remCid || (rp && rp.uid === remUid)) {
                      delete this.game.remotePlayers[k];
                      removedAny = true;
                    }
                  }
                }
              }
            });
          }

          snapshot.forEach((doc) => {
            const d = doc.data();
            if (!d) return;
            const docUid = d.uid || doc.id;
            if ((this.currentUser && docUid === this.currentUser.uid) || d.id === this.game.myPlayerId) return;
            const key = docUid;
            const existing = this.game.remotePlayers[key];
            if (!existing || (d.ts || 0) >= (existing.ts || 0)) {
              this.game.remotePlayers[key] = {
                id: key,
                uid: docUid,
                clientId: d.id || null,
                name: (d.name || 'Játékos').slice(0, 14),
                rebirths: Number(d.rebirths) || 0,
                level: Number(d.level) || 1,
                bricks: Number(d.bricks) || 0,
                ts: Number(d.ts) || 0
              };
            }
            // Ha már szerepelt külön kliens-ID alatt ugyanaz az UID, takarítsuk le:
            if (d.id && d.id !== key && this.game.remotePlayers[d.id]) {
              delete this.game.remotePlayers[d.id];
            }
          });

          if (removedAny) {
            try {
              localStorage.setItem('idle_breakout_remote_players', JSON.stringify(this.game.remotePlayers));
            } catch (e) {}
          }
          this.game.renderLeaderboard();
        }, (err) => {
          console.warn('Firestore ranglista figyelési hiba:', err);
        });
    } catch (e) {}
  }

  updateAuthUI() {
    const loggedIn = !!this.currentUser;
    const displayName = loggedIn
      ? (this.game.playerName || this.currentUser.displayName || 'Fiók').slice(0, 10)
      : '';

    // Top bar gomb
    const openBtn = document.getElementById('btn-open-auth');
    if (openBtn) {
      openBtn.classList.toggle('logged-in', loggedIn);
      if (loggedIn) {
        openBtn.textContent = `☁️ ${displayName}`;
        openBtn.title = `Bejelentkezve: ${this.currentUser.email || displayName} (Kattints a fiókhoz)`;
      } else {
        openBtn.textContent = '👤 BELÉPÉS';
        openBtn.title = 'Bejelentkezés és Felhőmentés másik gépre';
      }
    }

    // Ranglista oldalsáv / modal kis státusz sáv
    for (const id of ['lb-auth-status-pc', 'lb-auth-status-mobile']) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('logged-in', loggedIn);
        el.innerHTML = loggedIn
          ? `☁️ <strong>${displayName}</strong> (Felhő OK)`
          : `👤 Vendég mód ➔ <u>Belépés / Mentés</u>`;
      }
    }

    // Auth Modal belső panelek
    const guestPanel = document.getElementById('auth-guest-view');
    const userPanel = document.getElementById('auth-logged-in-view');
    if (guestPanel) guestPanel.style.display = loggedIn ? 'none' : 'flex';
    if (userPanel) userPanel.style.display = loggedIn ? 'flex' : 'none';

    if (loggedIn) {
      const nameEl = document.getElementById('auth-user-name');
      const emailEl = document.getElementById('auth-user-email');
      const statsEl = document.getElementById('auth-user-stats');
      const syncEl = document.getElementById('auth-cloud-sync-time');

      if (nameEl) nameEl.textContent = this.game.playerName || this.currentUser.displayName || 'Játékos';
      if (emailEl) emailEl.textContent = this.currentUser.email || '-';
      if (statsEl) statsEl.textContent = `Rebirth: ${this.game.rebirthCount} | Level: ${this.game.level} | Törött blokk: ${this.game.formatNumber(this.game.totalBricksDestroyed)}`;
      if (syncEl) {
        if (this.lastCloudSaveMs > 0) {
          const d = new Date(this.lastCloudSaveMs);
          syncEl.textContent = d.toLocaleTimeString('hu-HU');
        } else {
          syncEl.textContent = 'Készen áll';
        }
      }
    }
  }

  // --- Offline Tartalék: Mentési Kód Export / Import ---
  exportSaveCode() {
    try {
      const data = this.game.buildSaveData(this.currentUser ? this.currentUser.uid : null);
      const json = JSON.stringify(data);
      const bytes = new TextEncoder().encode(json);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const code = 'IB4:' + btoa(bin);

      const input = document.getElementById('auth-backup-code-input');
      if (input) {
        input.value = code;
        input.select();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      this.game.showToast('📋 Mentési kód legenerálva és vágólapra másolva!', 3500);
    } catch (e) {
      this.showError('Hiba a mentési kód készítésekor.');
    }
  }

  importSaveCode() {
    this.clearError();
    const input = document.getElementById('auth-backup-code-input');
    const raw = (input ? input.value : '').trim();
    if (!raw || !raw.startsWith('IB4:')) {
      this.showError('Érvénytelen mentési kód! ("IB4:..." formátum szükséges)');
      return;
    }
    try {
      const b64 = raw.slice(4);
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const json = new TextDecoder().decode(bytes);
      const data = JSON.parse(json);
      if (!data || typeof data !== 'object' || data.level == null) {
        throw new Error('Hibás adat');
      }
      this.game.applySaveData(data, { isLiveReload: true, ownerUid: this.currentUser ? this.currentUser.uid : null });
      if (this.currentUser) this.saveToCloud(true);
      this.updateAuthUI();
      this.game.showToast(`✅ <strong>Mentés betöltve kódból!</strong> (Rebirth ${this.game.rebirthCount} | Szint ${this.game.level})`, 4000);
    } catch (e) {
      this.showError('Hibás vagy sérült mentési kód!');
    }
  }
}
