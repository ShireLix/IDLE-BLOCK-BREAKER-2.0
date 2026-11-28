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
    this.lastLbSyncMs = 0;
    this.lbSyncTimer = 0;
    this.lastLbSyncSig = '';
    this.lastSyncedBb = null;
    this.lastSyncedBt = null;
    this.activeTab = 'login'; // 'login' | 'register'
    this.suppressNextAuthLoad = false;
    this.initialCloudSyncDone = false;
    this.leaderboardUnsub = null;
    this.ownSaveUnsub = null;
    this._liveCloudSyncTimer = null;
    this._lastRemoteSyncToastAt = 0;
    this._authOpInFlight = false;
    this._busyStartedAt = 0;
    this.deviceSessionId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  }

  init() {
    this.bindModalEvents();
    this.isConfigured = this.checkConfigValid();

    const warnBanner = document.getElementById('auth-config-warning');
    if (warnBanner) {
      warnBanner.style.display = this.isConfigured ? 'none' : 'block';
    }

    if (!this.isConfigured) {
      for (const btnId of ['btn-auth-submit-login', 'btn-auth-submit-register']) {
        const b = document.getElementById(btnId);
        if (b) { b.disabled = true; b.title = 'Előbb állítsd be a js/firebase-config.js fájlt!'; }
      }
      this.updateAuthUI();
      if (this.game && typeof this.game.updateLeaderboardConnUI === 'function') {
        this.game.updateLeaderboardConnUI(this.game.mqttConnected);
      }
      return;
    }

    if (typeof firebase === 'undefined' || !firebase.initializeApp) {
      console.warn('Firebase SDK nem töltődött be (offline mód vagy blokkolt script).');
      this.showError('A Firebase felhőszolgáltatás jelenleg nem érhető el (helyi mentés + JSON/kód export aktív).');
      this.updateAuthUI();
      if (this.game && typeof this.game.updateLeaderboardConnUI === 'function') {
        this.game.updateLeaderboardConnUI(this.game.mqttConnected);
      }
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
      this.syncLeaderboardToCloud(true);
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

  openAuthModal(tab = 'login', prefillName = '') {
    const modal = document.getElementById('auth-modal');
    if (this.game && typeof this.game.closeAllModals === 'function') {
      this.game.closeAllModals('auth-modal');
    }
    this.clearError();
    this.hideDeleteConfirm();
    if (!this._authOpInFlight || (this._busyStartedAt && Date.now() - this._busyStartedAt > 8000)) {
      this.setBusy(false);
    }
    this.updateAuthUI();
    if (!this.currentUser) {
      this.switchAuthTab(tab === 'register' ? 'register' : 'login');
      if (tab === 'register' && prefillName) {
        const regNameEl = document.getElementById('auth-reg-name');
        if (regNameEl && !regNameEl.value.trim()) {
          regNameEl.value = String(prefillName).trim();
        }
      }
    }
    if (modal) modal.classList.add('open');
    if (window.soundEngine) window.soundEngine.playClickHit();
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    this.hideDeleteConfirm();
    if (modal) modal.classList.remove('open');
  }

  bindModalEvents() {
    const openBtn = document.getElementById('btn-open-auth');
    const lbPcTrigger = document.getElementById('lb-auth-status-pc');
    const lbMobTrigger = document.getElementById('lb-auth-status-mobile');
    const closeX = document.getElementById('btn-close-auth');
    const closeFooter = document.getElementById('btn-close-auth-footer');

    const openModal = () => this.openAuthModal('login');
    const closeModal = () => {
      this.closeAuthModal();
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
    this._authOpInFlight = !!busy;
    this._busyStartedAt = busy ? Date.now() : 0;
    for (const id of [
      'btn-auth-submit-login',
      'btn-auth-submit-register',
      'btn-cloud-save-now',
      'btn-cloud-load-now',
      'btn-auth-logout',
      'btn-auth-delete-open',
      'btn-auth-delete-confirm'
    ]) {
      const el = document.getElementById(id);
      if (el) el.disabled = !!busy;
    }
  }

  withTimeout(promise, ms = 8000, msg = 'A felhős kapcsolat túllépte az időkorlátot. Próbáld újra!') {
    let timer = null;
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const err = new Error(msg);
          err.code = 'timeout';
          reject(err);
        }, ms);
      })
    ]).finally(() => { if (timer) clearTimeout(timer); });
  }

  getResolvedAccountName(user = this.currentUser, extraCandidates = []) {
    const candidates = [
      this.game && this.game.playerName,
      ...(Array.isArray(extraCandidates) ? extraCandidates : []),
      user && user.displayName
    ];
    for (const c of candidates) {
      const clean = String(c || '').trim().slice(0, 12);
      if (clean && clean.toLowerCase() !== 'játékos') return clean;
    }
    return 'Játékos';
  }

  translateFirebaseError(err) {
    const code = (err && err.code) || '';
    switch (code) {
      case 'timeout':
        return (err && err.message) || 'A felhős kapcsolat túllépte az időkorlátot!';
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

    const regNameWarn = document.getElementById('auth-reg-name-warn');
    const regPassWarn = document.getElementById('auth-reg-pass-warn');
    if (regNameWarn) regNameWarn.style.display = rawName.length > 12 ? 'block' : 'none';
    if (regPassWarn) regPassWarn.style.display = password.length > 20 ? 'block' : 'none';

    if (!rawName || rawName.toLowerCase() === 'játékos') {
      this.showError('Kérlek adj meg egy egyedi játékosnevet (ne maradjon üres)!');
      return;
    }
    if (rawName.length > 12) {
      this.showError('A játékosnév legfeljebb 12 karakter lehet!');
      return;
    }
    const playerName = rawName.slice(0, 12);
    if (!email || !email.includes('@')) {
      this.showError('Kérlek adj meg egy érvényes e-mail címet!');
      return;
    }
    if (password.length > 20) {
      this.showError('A jelszó legfeljebb 20 karakter lehet!');
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
        this.game.saveOwnerUid = user.uid;
        this.initialCloudSyncDone = true;
        await this.saveToCloud(true, { allowBeforeInitialSync: true });
        this.listenOwnCloudSave(user.uid);
        this.game.broadcastMyStatus();
        this.syncLeaderboardToCloud(true);
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

    const loginPassWarn = document.getElementById('auth-login-pass-warn');
    if (loginPassWarn) loginPassWarn.style.display = password.length > 20 ? 'block' : 'none';

    if (!email || !password) {
      this.showError('Add meg az e-mail címed és a jelszavad!');
      return;
    }
    if (password.length > 20) {
      this.showError('A jelszó legfeljebb 20 karakter lehet!');
      return;
    }

    this.setBusy(true);
    this.suppressNextAuthLoad = true;
    try {
      const cred = await this.withTimeout(
        this.auth.signInWithEmailAndPassword(email, password),
        8000,
        'A bejelentkezés túllépte az időkorlátot. Próbáld újra!'
      );
      if (cred && cred.user) {
        this.currentUser = cred.user;
        this.initialCloudSyncDone = false;
        const resolved = this.getResolvedAccountName(cred.user);
        if (resolved !== 'Játékos' && (!this.game.playerName || this.game.playerName.trim().toLowerCase() === 'játékos')) {
          this.game.setPlayerNameDirect(resolved);
        }
        try {
          await this.syncOnLogin(cred.user, true);
        } finally {
          this.initialCloudSyncDone = true;
        }
        this.listenOwnCloudSave(cred.user.uid);
        this.game.broadcastMyStatus();
        this.syncLeaderboardToCloud(true);
        this.updateAuthUI();
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

  async logout() {
    this.clearError();
    if (!this.isReady) return;
    this.setBusy(true);
    try {
      // Kijelentkezés előtt csak akkor mentsünk, ha már sikeresen szinkronizáltunk belépéskor
      if (this.currentUser && this.initialCloudSyncDone) {
        await this.withTimeout(this.saveToCloud(true, { silent: true }), 2500).catch(() => {});
      }
      this.stopOwnCloudSaveListener();
      await this.withTimeout(this.auth.signOut(), 5000).catch(() => {});
      this.currentUser = null;
      this.initialCloudSyncDone = false;
      this.lastCloudSaveMs = 0;
      this.pendingCloudSave = false;
      this.hideDeleteConfirm();
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
          const [uSnap, lSnap] = await this.withTimeout(
            Promise.all([userRef.get(), lbRef.get()]),
            6000
          );
          if (uSnap.exists) userBackup = uSnap.data();
          if (lSnap.exists) lbBackup = lSnap.data();
          await this.withTimeout(Promise.all([userRef.delete(), lbRef.delete()]), 6000);
          deletedFromFirestore = true;
        } catch (fsErr) {
          console.warn('Firestore törlési figyelmeztetés:', fsErr);
        }
      }

      await user.delete();
      this.stopOwnCloudSaveListener();

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

  compareSaveProgress(a, b) {
    const rebA = Math.max(0, Number(a?.rebirthCount) || 0);
    const rebB = Math.max(0, Number(b?.rebirthCount) || 0);
    if (rebA !== rebB) return rebA - rebB;
    const lvlA = Math.max(1, Number(a?.level) || 1);
    const lvlB = Math.max(1, Number(b?.level) || 1);
    if (lvlA !== lvlB) return lvlA - lvlB;
    const brkA = Math.max(0, Number(a?.totalBricksDestroyed) || 0);
    const brkB = Math.max(0, Number(b?.totalBricksDestroyed) || 0);
    return brkA - brkB;
  }

  async handleAuthStateChanged(user) {
    this.currentUser = user || null;
    this.updateAuthUI();

    if (user) {
      const resolved = this.getResolvedAccountName(user);
      if (resolved !== 'Játékos' && (!this.game.playerName || this.game.playerName.trim().toLowerCase() === 'játékos')) {
        this.game.setPlayerNameDirect(resolved);
      }
      if (this.suppressNextAuthLoad) {
        this.suppressNextAuthLoad = false;
        this.updateAuthUI();
        return;
      }
      this.game.saveOwnerUid = user.uid;
      this.initialCloudSyncDone = false;
      if (typeof this.game.closeWelcomeMenu === 'function') {
        this.game.closeWelcomeMenu();
      }
      this.closeAuthModal();
      if (this.db && this.game.myPlayerId && this.game.myPlayerId !== user.uid) {
        this.db.collection('leaderboard').doc(this.game.myPlayerId).delete().catch(() => {});
      }
      if (typeof this.game.cleanupDuplicateMqttForUid === 'function') {
        this.game.cleanupDuplicateMqttForUid(user.uid);
      }
      try {
        await this.syncOnLogin(user, false);
      } finally {
        this.initialCloudSyncDone = true;
      }
      this.listenOwnCloudSave(user.uid);
      this.game.broadcastMyStatus();
      this.syncLeaderboardToCloud(true);
      this.updateAuthUI();
    } else {
      this.stopOwnCloudSaveListener();
      this.initialCloudSyncDone = false;
      this.game.renderLeaderboard();
    }
  }

  stopOwnCloudSaveListener() {
    if (this._liveCloudSyncTimer) {
      clearTimeout(this._liveCloudSyncTimer);
      this._liveCloudSyncTimer = null;
    }
    if (typeof this.ownSaveUnsub === 'function') {
      try { this.ownSaveUnsub(); } catch (e) {}
    }
    this.ownSaveUnsub = null;
  }

  listenOwnCloudSave(uid) {
    this.stopOwnCloudSaveListener();
    if (!this.db || !uid) return;
    try {
      this.ownSaveUnsub = this.db.collection('users').doc(uid).onSnapshot((snap) => {
        if (!this.initialCloudSyncDone || !this.currentUser || this.currentUser.uid !== uid) return;
        if (!snap.exists || (snap.metadata && snap.metadata.hasPendingWrites)) return;
        const cloudDoc = snap.data();
        const cloudSave = cloudDoc && cloudDoc.saveData ? cloudDoc.saveData : null;
        if (!cloudSave) return;
        if (cloudDoc.deviceSessionId && cloudDoc.deviceSessionId === this.deviceSessionId) return;

        const localLive = {
          rebirthCount: this.game.rebirthCount || 0,
          level: this.game.level || 1,
          totalBricksDestroyed: this.game.totalBricksDestroyed || 0,
          lastAdminEditAt: this.game.lastAdminEditAt || 0,
          appliedSeasonResetId: this.game.appliedSeasonResetId || null,
          appliedSeasonResetToken: this.game.appliedSeasonResetToken || null,
          lastSavedAt: Number(this.game.readRawLocalSave()?.lastSavedAt) || 0
        };
        const cloudIsPostReset = (typeof this.game.isSavePostSeasonReset === 'function')
          ? this.game.isSavePostSeasonReset(cloudSave)
          : (cloudSave.appliedSeasonResetId === 'fair_restart_s2_v9_4');
        const localIsPostReset = (typeof this.game.isSavePostSeasonReset === 'function')
          ? this.game.isSavePostSeasonReset(localLive)
          : (localLive.appliedSeasonResetId === 'fair_restart_s2_v9_4');
        if (!cloudIsPostReset && localIsPostReset) return;

        const progressCmp = this.compareSaveProgress(cloudSave, localLive);
        const cloudHasNewerAdmin = (Number(cloudSave.lastAdminEditAt) || 0) > (Number(this.game.lastAdminEditAt) || 0);
        const cloudIsNewerSeason = cloudIsPostReset && !localIsPostReset;
        if (progressCmp < 0 && !cloudHasNewerAdmin && !cloudIsNewerSeason) return;

        const incomingTs = Math.max(Number(cloudDoc.updatedAt) || 0, Number(cloudSave.lastSavedAt) || 0);
        if (progressCmp === 0 && !cloudHasNewerAdmin && !cloudIsNewerSeason && incomingTs <= (this.lastCloudSaveMs || 0) + 800) return;

        const effectiveCloudSave = { ...cloudSave };
        if ((!effectiveCloudSave.playerName || effectiveCloudSave.playerName === 'Játékos') && (cloudDoc.playerName || this.currentUser.displayName)) {
          effectiveCloudSave.playerName = cloudDoc.playerName || this.currentUser.displayName;
        }
        this.game.applySaveData(effectiveCloudSave, { isLiveReload: true, ownerUid: uid });
        this.lastCloudSaveMs = incomingTs;
        this.updateAuthUI();
        const now = Date.now();
        if (now - (this._lastRemoteSyncToastAt || 0) > 10000) {
          this._lastRemoteSyncToastAt = now;
          this.game.showToast('☁️ Haladás szinkronizálva a másik eszközödről!', 3200);
        }
      }, () => {});
    } catch (e) {}
  }

  scheduleLiveCloudSync(delayMs = 1200) {
    if (!this.isReady || !this.db || !this.currentUser || !this.initialCloudSyncDone) return;
    if (this._liveCloudSyncTimer) clearTimeout(this._liveCloudSyncTimer);
    this._liveCloudSyncTimer = setTimeout(() => {
      this._liveCloudSyncTimer = null;
      this.saveToCloud(true, { silent: true });
    }, delayMs);
  }

  async syncOnLogin(user, fromExplicitLogin) {
    if (!this.db || !user) return;
    try {
      const docRef = this.db.collection('users').doc(user.uid);
      const snap = await this.withTimeout(
        docRef.get(),
        8000,
        'A felhőmentés lekérése túllépte az időkorlátot.'
      );

      if (snap.exists) {
        const cloudDoc = snap.data();
        const cloudSave = cloudDoc && cloudDoc.saveData ? cloudDoc.saveData : null;
        const healedName = this.getResolvedAccountName(user, [cloudSave && cloudSave.playerName, cloudDoc && cloudDoc.playerName]);
        if (healedName !== 'Játékos' && (!this.game.playerName || this.game.playerName.trim().toLowerCase() === 'játékos')) {
          this.game.setPlayerNameDirect(healedName);
        }
        if (cloudSave) {
          const localRaw = this.game.readRawLocalSave();
          const hasForeignOwner = !!(localRaw && localRaw.saveOwnerUid && localRaw.saveOwnerUid !== user.uid);
          const sameOwner = !!(localRaw && localRaw.saveOwnerUid === user.uid);

          const liveSnap = {
            rebirthCount: this.game.rebirthCount || 0,
            level: this.game.level || 1,
            totalBricksDestroyed: this.game.totalBricksDestroyed || 0,
            lastSavedAt: this.game.offlineProgressAppliedAt || Number(localRaw?.lastSavedAt) || 0,
            lastAdminEditAt: this.game.lastAdminEditAt || Number(localRaw?.lastAdminEditAt) || 0,
            appliedSeasonResetId: this.game.appliedSeasonResetId || localRaw?.appliedSeasonResetId || null,
            appliedSeasonResetToken: this.game.appliedSeasonResetToken || localRaw?.appliedSeasonResetToken || null
          };
          const rawSnap = localRaw || { rebirthCount: 0, level: 1, totalBricksDestroyed: 0, lastSavedAt: 0, lastAdminEditAt: 0, appliedSeasonResetId: null, appliedSeasonResetToken: null };
          const bestLocal = (!hasForeignOwner && this.compareSaveProgress(liveSnap, rawSnap) >= 0) ? liveSnap : rawSnap;

          const checkPostReset = (s) => (typeof this.game.isSavePostSeasonReset === 'function')
            ? this.game.isSavePostSeasonReset(s)
            : (s && s.appliedSeasonResetId === 'fair_restart_s2_v9_4');
          const localHasSeason = !hasForeignOwner && (checkPostReset(bestLocal) || checkPostReset(liveSnap));
          const cloudHasSeason = checkPostReset(cloudSave);

          if (localHasSeason && !cloudHasSeason && sameOwner && !fromExplicitLogin) {
            if (typeof this.game.collectLegacyCosmeticsFromSave === 'function') {
              this.game.collectLegacyCosmeticsFromSave(cloudSave);
            }
            this.game.saveOwnerUid = user.uid;
            this.game.save();
            await this.saveToCloud(true, { silent: true, allowBeforeInitialSync: true });
            this.initialCloudSyncDone = true;
            this.updateAuthUI();
            return;
          }

          const progressCmp = hasForeignOwner ? -1 : this.compareSaveProgress(bestLocal, cloudSave);
          const cloudHasNewerAdmin = (Number(cloudSave.lastAdminEditAt) || 0) > (Number(bestLocal.lastAdminEditAt) || 0);
          const localOfflineDidAdvance = !hasForeignOwner && !fromExplicitLogin && ((this.game.offlineProgressAppliedAt || 0) > 0);
          const localIsStrictlyNewerSameOwner = sameOwner && ((Number(bestLocal.lastSavedAt) || 0) > (Number(cloudSave.lastSavedAt) || 0)) && progressCmp >= 0;

          const shouldKeepLocalAndUpload = cloudHasSeason && !fromExplicitLogin && !hasForeignOwner && !cloudHasNewerAdmin && (
            progressCmp > 0 ||
            (localOfflineDidAdvance && progressCmp >= 0) ||
            localIsStrictlyNewerSameOwner
          );

          if (shouldKeepLocalAndUpload) {
            // A helyi / offline haladás frissebb vagy előrébb tart -> NE írjuk felül a régi felhőmentéssel!
            this.game.saveOwnerUid = user.uid;
            this.game.save();
            await this.saveToCloud(true, { silent: true, allowBeforeInitialSync: true });
          } else {
            // Ha másik gépen előrébb járt, vagy még Szezon 1 felhőmentése van:
            const isGuestProgress = !fromExplicitLogin ? false : (!sameOwner && (this.game.level > 1 || this.game.getTotalBalls() > 0 || this.game.rebirthCount > 0));
            let shouldLoadCloud = true;
            if (isGuestProgress && !localRaw?.saveOwnerUid) {
              shouldLoadCloud = confirm(
                `A fiókodhoz már tartozik felhőmentés (Rebirth: ${cloudSave.rebirthCount || 0}, Level: ${cloudSave.level || 1}).\n\n` +
                `Betöltsük a felhőmentést? (A jelenlegi helyi vendég haladás felülírásra kerül.)`
              );
            }

            if (shouldLoadCloud) {
              const effectiveCloudSave = { ...cloudSave };
              if ((!effectiveCloudSave.playerName || effectiveCloudSave.playerName === 'Játékos') && (cloudDoc.playerName || user.displayName)) {
                effectiveCloudSave.playerName = cloudDoc.playerName || user.displayName;
              }
              this.game.applySaveData(effectiveCloudSave, { isLiveReload: true, ownerUid: user.uid });
              this.lastCloudSaveMs = cloudSave.lastSavedAt || Date.now();
              this.updateAuthUI();

              if (!cloudHasSeason) {
                await this.saveToCloud(true, { silent: true, allowBeforeInitialSync: true });
              } else {
                const cloudOfflineSec = cloudSave.lastSavedAt ? ((Date.now() - Number(cloudSave.lastSavedAt)) / 1000) : 0;
                if (cloudOfflineSec >= 5 && (this.game.getTotalBalls() > 0 || this.game.bbUpgrades.autoClicker >= 1)) {
                  this.game.applyOfflineProgress(cloudOfflineSec, true);
                  await this.saveToCloud(true, { silent: true, allowBeforeInitialSync: true });
                } else {
                  this.game.showToast(`☁️ <strong>Felhőmentés betöltve!</strong> Folytatás: Rebirth ${this.game.rebirthCount} | Szint ${this.game.level}`, 4500);
                }
              }
            } else {
              this.game.saveOwnerUid = user.uid;
              this.game.save();
              await this.saveToCloud(true, { allowBeforeInitialSync: true });
            }
          }
        }
      } else if (fromExplicitLogin) {
        const resolved = this.getResolvedAccountName(user);
        if (resolved !== 'Játékos' && (!this.game.playerName || this.game.playerName.trim().toLowerCase() === 'játékos')) {
          this.game.setPlayerNameDirect(resolved);
        }
        // Még nincs felhő dokumentum ehhez a fiókhoz -> hozzuk létre a jelenlegiből!
        await this.saveToCloud(true, { allowBeforeInitialSync: true });
      }
      this.initialCloudSyncDone = true;
      this.updateAuthUI();
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
      const snap = await this.withTimeout(
        this.db.collection('users').doc(this.currentUser.uid).get(),
        8000,
        'A felhőmentés letöltése túllépte az időkorlátot.'
      );
      if (!snap.exists || !snap.data().saveData) {
        this.showError('Még nincs mentett adat a felhőben ehhez a fiókhoz.');
        return;
      }
      const cloudDoc = snap.data();
      const cloudSave = { ...cloudDoc.saveData };
      const resolved = this.getResolvedAccountName(this.currentUser, [cloudSave.playerName, cloudDoc.playerName]);
      if (!cloudSave.playerName || cloudSave.playerName.trim().toLowerCase() === 'játékos') {
        cloudSave.playerName = resolved;
      }
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

  async syncLeaderboardToCloud(force = false) {
    if (!this.isReady || !this.db) return;
    const uid = this.currentUser ? this.currentUser.uid : null;
    const docId = uid || this.game.myPlayerId;
    if (!docId || docId === '__admin_rules__') return;

    const now = Date.now();
    const pName = this.currentUser
      ? this.getResolvedAccountName(this.currentUser)
      : (this.game.playerName || 'Játékos').slice(0, 12);
    const reb = Math.max(0, Number(this.game.rebirthCount) || 0);
    const lvl = Math.max(1, Number(this.game.level) || 1);
    const brk = Math.max(0, Number(this.game.totalBricksDestroyed) || 0);
    const mon = Math.floor(Math.max(0, Number(this.game.money) || 0));
    const bb = Math.max(0, Math.floor(Number(this.game.bb) || 0));
    const bt = Math.max(0, Math.floor(Number(this.game.bossTokens) || 0));
    const bpStage = (typeof this.game.getCurrentBattlePassStage === 'function') ? this.game.getCurrentBattlePassStage() : 1;
    const approxMoneySig = mon < 1000 ? Math.round(mon / 100) * 100 : Number(mon.toPrecision(2));
    const sig = `${pName}|${reb}|${lvl}|${brk}|${approxMoneySig}|${bb}|${bt}|${bpStage}|${uid || 'guest'}`;
    const bbBtChanged = (this.lastSyncedBb !== null && this.lastSyncedBb !== bb) || (this.lastSyncedBt !== null && this.lastSyncedBt !== bt);

    if (!force) {
      const minGap = bbBtChanged ? 1200 : 4000;
      if (now - this.lastLbSyncMs < minGap) return;
      if (!bbBtChanged && sig === this.lastLbSyncSig && now - this.lastLbSyncMs < 20000) return;
    }

    try {
      const lbPayload = {
        id: this.game.myPlayerId,
        uid: uid || null,
        isGuest: !uid,
        name: pName,
        rebirths: reb,
        level: lvl,
        bricks: brk,
        money: mon,
        bb,
        bt,
        bpStage,
        seasonResetToken: this.game.appliedSeasonResetToken || '',
        ts: now,
        serverUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      if ((this.game.lastAdminEditAt || 0) > 0) {
        lbPayload.adminUpdatedAt = this.game.lastAdminEditAt;
      }
      await this.db.collection('leaderboard').doc(docId).set(lbPayload, { merge: true });
      this.lastLbSyncMs = now;
      this.lastLbSyncSig = sig;
      this.lastSyncedBb = bb;
      this.lastSyncedBt = bt;
    } catch (err) {
      // Csendes hibatűrés (pl. ha Firestore szabály később tiltja a vendégírást)
    }
  }

  async saveToCloud(force = false, opts = {}) {
    if (!this.isReady || !this.db || !this.currentUser) return;
    if (!this.initialCloudSyncDone && !opts.allowBeforeInitialSync) return;
    const now = Date.now();
    if (!force && now - this.lastCloudSaveMs < 10000) {
      this.pendingCloudSave = true;
      return;
    }

    this.pendingCloudSave = false;
    try {
      const uid = this.currentUser.uid;
      const pName = this.getResolvedAccountName(this.currentUser);
      if (pName !== 'Játékos' && (!this.game.playerName || this.game.playerName.trim().toLowerCase() === 'játékos')) {
        this.game.setPlayerNameDirect(pName);
      }
      const saveData = this.game.buildSaveData(uid);

      await this.withTimeout(
        Promise.all([
          this.db.collection('users').doc(uid).set({
            playerName: pName,
            email: this.currentUser.email || '',
            rebirths: this.game.rebirthCount || 0,
            level: this.game.level || 1,
            bricks: this.game.totalBricksDestroyed || 0,
            updatedAt: now,
            deviceSessionId: this.deviceSessionId,
            saveData
          }, { merge: true }),
          this.syncLeaderboardToCloud(true)
        ]),
        8000,
        'A felhőbe mentés túllépte az időkorlátot.'
      );

      this.lastCloudSaveMs = now;
      this.updateAuthUI();
      if (force && !opts.silent) {
        this.game.showToast('☁️ Haladás elmentve a felhőbe!', 2500);
      }
    } catch (err) {
      console.warn('Felhőmentés hiba:', err);
      if (force) this.showError(this.translateFirebaseError(err));
    }
  }

  tick(dt) {
    if (!this.isReady || !this.db) return;

    this.lbSyncTimer += dt;
    if (this.lbSyncTimer >= 8.0) {
      this.lbSyncTimer = 0;
      this.syncLeaderboardToCloud(false);
    }

    if (!this.currentUser || !this.initialCloudSyncDone) return;
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
        .limit(500)
        .onSnapshot((snapshot) => {
          let removedAny = false;
          const modifiedDocIds = new Set();
          const liveDocIds = new Set();

          if (typeof snapshot.docChanges === 'function') {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'modified' && change.doc.id !== '__admin_rules__') {
                modifiedDocIds.add(change.doc.id);
              }
              if (change.type === 'removed') {
                if (change.doc.id === '__admin_rules__') return;
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

          let dirtyRemote = removedAny;
          const nowMs = Date.now();
          snapshot.forEach((doc) => {
            const d = doc.data();
            if (!d) return;
            if (doc.id === '__admin_rules__') {
              if (typeof this.game.applyIncomingAdminRules === 'function') {
                this.game.applyIncomingAdminRules(d, 'firestore');
              }
              return;
            }

            liveDocIds.add(doc.id);
            if (d.uid) liveDocIds.add(d.uid);

            const docUid = d.uid || doc.id;
            if ((this.currentUser && docUid === this.currentUser.uid) || doc.id === this.game.myPlayerId || d.id === this.game.myPlayerId) return;
            const key = docUid;
            const existing = this.game.remotePlayers[key];

            const serverMs = (d.serverUpdatedAt && typeof d.serverUpdatedAt.toMillis === 'function') ? d.serverUpdatedAt.toMillis() : 0;
            const rawTs = Math.max(serverMs, Number(d.ts) || 0);
            const safeTs = Math.min(nowMs, rawTs);
            const dReb = Math.max(0, Number(d.rebirths) || 0);
            const dLvl = Math.max(1, Number(d.level) || 1);
            const dBrk = Math.max(0, Number(d.bricks) || 0);
            const optNum = (v) => (v !== undefined && v !== null && !Number.isNaN(Number(v))) ? Math.max(0, Math.floor(Number(v))) : null;
            const dMoney = optNum(d.money) ?? (existing ? existing.money ?? null : null);
            const dBb = optNum(d.bb) ?? (existing ? existing.bb ?? null : null);
            const dBt = optNum(d.bt) ?? (existing ? existing.bt ?? null : null);
            const dBpStage = optNum(d.bpStage) ?? (existing ? existing.bpStage ?? null : null);
            const dAdminTs = Number(d.adminUpdatedAt) || 0;
            const exAdminTs = (existing && existing.adminUpdatedAt) || 0;
            const dSeasonToken = String(d.seasonResetToken || '').trim();
            const incomingPreReset = (typeof this.game.isPreSeasonResetRecord === 'function')
              ? this.game.isPreSeasonResetRecord({ ts: safeTs, adminUpdatedAt: dAdminTs, seasonResetToken: dSeasonToken })
              : false;
            const existingPreReset = (existing && typeof this.game.isPreSeasonResetRecord === 'function')
              ? this.game.isPreSeasonResetRecord(existing)
              : false;
            const isSeasonResetTransition = !incomingPreReset && existingPreReset;
            const stalePreResetBlocked = !!(existing && incomingPreReset && !existingPreReset);

            const isAdminOverride = isSeasonResetTransition || (dAdminTs > exAdminTs) || (dAdminTs > 0 && dAdminTs === exAdminTs && modifiedDocIds.has(doc.id));
            const existingHasNewerAdmin = exAdminTs > dAdminTs && !isSeasonResetTransition;
            const existingStrictlyHigher = !stalePreResetBlocked && !existingHasNewerAdmin && !!(existing && (
              (existing.rebirths || 0) > dReb ||
              ((existing.rebirths || 0) === dReb && (existing.level || 1) > dLvl)
            ));

            const isHigherProgress = existing
              ? (dReb > (existing.rebirths || 0) || (dReb === (existing.rebirths || 0) && dLvl >= (existing.level || 1)))
              : true;

            const walletChanged = existing
              ? (dBb !== existing.bb || dBt !== existing.bt || dMoney !== existing.money)
              : false;

            const shouldAccept = !stalePreResetBlocked && !existingHasNewerAdmin && (
              !existing ||
              isSeasonResetTransition ||
              modifiedDocIds.has(doc.id) ||
              !existing._liveMqttInSession ||
              isAdminOverride ||
              isHigherProgress ||
              walletChanged ||
              (safeTs >= (existing.ts || 0) - 5000)
            );

            if (shouldAccept) {
              const incomingName = (d.name || '').trim().slice(0, 12);
              const prevName = (existing && existing.name || '').trim().slice(0, 12);
              const resolvedName = (incomingName && incomingName !== 'Játékos')
                ? incomingName
                : ((prevName && prevName !== 'Játékos') ? prevName : (incomingName || prevName || 'Játékos'));

              const isLivePlayerUpdate = modifiedDocIds.has(doc.id) && !isAdminOverride;
              const prevLocalSeen = (existing && existing.lastSeenLocalMs) ? Number(existing.lastSeenLocalMs) : 0;
              const nextLocalSeen = isLivePlayerUpdate ? nowMs : prevLocalSeen;

              const keepExistingHigher = existingStrictlyHigher && !isAdminOverride;
              const finalReb = keepExistingHigher ? (existing.rebirths || 0) : dReb;
              const finalLvl = keepExistingHigher ? (existing.level || 1) : dLvl;
              const finalBrk = keepExistingHigher ? (existing.bricks || 0) : dBrk;
              const finalMoney = keepExistingHigher ? (existing.money ?? dMoney) : dMoney;
              const finalBb = keepExistingHigher ? (existing.bb ?? dBb) : dBb;
              const finalBt = keepExistingHigher ? (existing.bt ?? dBt) : dBt;
              const finalBpStage = keepExistingHigher ? (existing.bpStage ?? dBpStage) : dBpStage;

              this.game.remotePlayers[key] = {
                id: key,
                uid: d.uid || null,
                docId: doc.id,
                clientId: d.id || (existing && existing.clientId) || null,
                fromFirestore: true,
                _liveMqttInSession: false,
                keepInTop10: !!(existing && existing.keepInTop10),
                name: resolvedName,
                rebirths: finalReb,
                level: finalLvl,
                bricks: finalBrk,
                money: finalMoney,
                bb: finalBb,
                bt: finalBt,
                bpStage: finalBpStage,
                seasonResetToken: keepExistingHigher ? ((existing && existing.seasonResetToken) || dSeasonToken || null) : (dSeasonToken || null),
                ts: safeTs,
                lastSeenLocalMs: nextLocalSeen,
                adminUpdatedAt: Math.max(exAdminTs, dAdminTs)
              };
              dirtyRemote = true;
            }
            // Ha már szerepelt külön kliens-ID alatt ugyanaz az UID, takarítsuk le:
            if (d.id && d.id !== key && this.game.remotePlayers[d.id]) {
              delete this.game.remotePlayers[d.id];
              dirtyRemote = true;
            }
          });

          if (snapshot.size > 0 && !(snapshot.metadata && snapshot.metadata.fromCache) && this.game.remotePlayers) {
            for (const k of Object.keys(this.game.remotePlayers)) {
              const rp = this.game.remotePlayers[k];
              if (rp && rp.fromFirestore && !liveDocIds.has(k) && !liveDocIds.has(rp.docId) && !liveDocIds.has(rp.uid)) {
                delete this.game.remotePlayers[k];
                dirtyRemote = true;
              }
            }
          }

          if (dirtyRemote) {
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
    const resolvedName = loggedIn
      ? this.getResolvedAccountName(this.currentUser)
      : (this.game.playerName || 'Játékos');
    const displayName = loggedIn ? resolvedName.slice(0, 10) : '';

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

    // Ranglista oldalsáv / modal kis státusz sáv & név mező zárolása bejelentkezve
    const fullName = resolvedName;

    for (const suffix of ['-pc', '-mobile']) {
      const editRow = document.getElementById(`player-name-edit-row${suffix}`);
      const lockedRow = document.getElementById(`player-name-locked-row${suffix}`);
      const lockedNameEl = document.getElementById(`player-locked-name${suffix}`);
      if (editRow) editRow.style.display = loggedIn ? 'none' : 'flex';
      if (lockedRow) lockedRow.style.display = loggedIn ? 'flex' : 'none';
      if (lockedNameEl) lockedNameEl.textContent = fullName;
    }

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

      if (nameEl) nameEl.textContent = resolvedName;
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

    if (typeof this.game.updateGuestRetentionUI === 'function') {
      this.game.updateGuestRetentionUI();
    }
  }

  // --- Offline Tartalék: Mentési Kód Export / Import ---
  exportSaveCode() {
    try {
      const isGuest = !this.currentUser;
      if (isGuest && typeof this.game.extendGuestDeadlineFromManualTransfer === 'function') {
        this.game.extendGuestDeadlineFromManualTransfer();
      }
      const data = this.game.buildSaveData(this.currentUser ? this.currentUser.uid : null);
      data.exportedAt = Date.now();
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
      if (isGuest) {
        this.game.showToast('📋 Kód kimásolva! A törlési határidő +3 nappal meghosszabbítva (inaktív állapotban ezután is törlődik; végleges védelemhez regisztrálj)!', 5200);
      } else {
        this.game.showToast('📋 Mentési kód legenerálva és vágólapra másolva!', 3500);
      }
    } catch (e) {
      this.showError('Hiba a mentési kód készítésekor.');
    }
  }

  exportRawJsonSave() {
    try {
      const isGuest = !this.currentUser;
      if (isGuest && typeof this.game.extendGuestDeadlineFromManualTransfer === 'function') {
        this.game.extendGuestDeadlineFromManualTransfer();
      }
      const data = this.game.buildSaveData(this.currentUser ? this.currentUser.uid : null);
      data.exportedAt = Date.now();
      const json = JSON.stringify(data);
      const input = document.getElementById('auth-backup-code-input');
      if (input) {
        input.value = json;
        input.select();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).catch(() => {});
      }
      this.game.showToast('📋 JSON mentés vágólapra másolva! Bármikor visszatölthető a Betöltés mezőbe.', 4000);
    } catch (e) {
      this.showError('Hiba a JSON mentés készítésekor.');
    }
  }

  importSaveCode() {
    this.clearError();
    const input = document.getElementById('auth-backup-code-input');
    const raw = (input ? input.value : '').trim();
    if (!raw || (!raw.startsWith('IB4:') && !raw.startsWith('{'))) {
      this.showError('Érvénytelen mentési kód vagy JSON! ("IB4:..." vagy "{...}" formátum szükséges)');
      return;
    }
    try {
      let json;
      if (raw.startsWith('{')) {
        json = raw;
      } else {
        const b64 = raw.slice(4);
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        json = new TextDecoder().decode(bytes);
      }
      const data = JSON.parse(json);
      if (!data || typeof data !== 'object' || data.level == null) {
        throw new Error('Hibás adat');
      }

      if (!this.currentUser && !data.saveOwnerUid && this.game.GUEST_RETENTION_MS) {
        const now = Date.now();
        const codeRefTs = Number(data.exportedAt) || Number(data.lastSavedAt) || 0;
        const codeDeadline = Number(data.guestDeadlineAt) || (codeRefTs ? codeRefTs + this.game.GUEST_RETENTION_MS : now + this.game.GUEST_RETENTION_MS);
        if (codeRefTs > 0 && (now >= codeDeadline || (now - codeRefTs >= this.game.GUEST_RETENTION_MS))) {
          this.showError('⏰ Ez a be nem regisztrált mentési kód 3 nap inaktivitás után lejárt, ezért már nem tölthető be!');
          return;
        }
      }

      this.game.applySaveData(data, { isLiveReload: true, ownerUid: this.currentUser ? this.currentUser.uid : null });
      if (!this.currentUser && typeof this.game.extendGuestDeadlineFromManualTransfer === 'function') {
        this.game.extendGuestDeadlineFromManualTransfer();
      }
      if (this.currentUser) this.saveToCloud(true);
      this.updateAuthUI();
      const loadedName = String(this.game.playerName || '').trim();
      if (loadedName && loadedName.toLowerCase() !== 'játékos' && typeof this.game.closeWelcomeMenu === 'function') {
        this.game.closeWelcomeMenu();
      }
      this.game.showToast(`✅ <strong>Mentés betöltve kódból!</strong> (Rebirth ${this.game.rebirthCount} | Szint ${this.game.level})`, 4000);
    } catch (e) {
      this.showError('Hibás vagy sérült mentési kód!');
    }
  }

  // --- Fejlesztői Ranglista Szabályok & Firestore Moderáció ---
  async saveAdminRulesToCloud(rulesObj) {
    if (!this.db || !rulesObj) return { ok: false, reason: 'no-db' };
    try {
      await this.db.collection('leaderboard').doc('__admin_rules__').set(rulesObj);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: (err && err.code) || 'error' };
    }
  }

  async adminDeleteLeaderboardDocs(docIds = []) {
    if (!this.db) return { deleted: 0, permissionDenied: false };
    let deleted = 0;
    let permissionDenied = false;
    const unique = [...new Set((docIds || []).filter(Boolean))];
    for (const id of unique) {
      if (id === '__admin_rules__') continue;
      try {
        await this.db.collection('leaderboard').doc(id).delete();
        deleted++;
      } catch (err) {
        if (err && err.code === 'permission-denied') permissionDenied = true;
      }
    }
    return { deleted, permissionDenied };
  }

  async adminUpdateLeaderboardDoc(docId, patch) {
    if (!this.db || !docId || docId === '__admin_rules__') return { ok: false };
    try {
      await this.db.collection('leaderboard').doc(docId).set({
        ...patch,
        adminUpdatedAt: Math.max(Date.now(), Number(patch.adminUpdatedAt) || 0),
        serverUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: (err && err.code) || 'error' };
    }
  }
}
