// EarnZone Points System
// Handles all point tracking via localStorage (upgrade to Firebase later)

const EZ = {
  getUser() {
    return JSON.parse(localStorage.getItem('ez_user') || 'null');
  },

  saveUser(user) {
    localStorage.setItem('ez_user', JSON.stringify(user));
  },

  addPoints(amount, reason) {
    const user = this.getUser();
    if (!user) return;
    user.points = (user.points || 0) + amount;
    user.history = user.history || [];
    user.history.unshift({ amount, reason, date: new Date().toISOString() });
    this.saveUser(user);
    this.updateUI();
    this.showToast(`+${amount} pts — ${reason} 🎉`);
    return user.points;
  },

  updateUI() {
    const user = this.getUser();
    if (!user) return;
    const els = document.querySelectorAll('.ez-pts');
    els.forEach(el => el.textContent = (user.points || 0).toLocaleString());
  },

  showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
  },

  requireLogin() {
    if (!this.getUser()) {
      window.location.href = '../pages/login.html';
      return false;
    }
    return true;
  }
};

window.EZ = EZ;
