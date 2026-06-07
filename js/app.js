// EarnZone Firebase Config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB94zgBIclBjVTgiuR_ceRuCoQtx555Qk8",
  authDomain: "earnzone-51a4f.firebaseapp.com",
  projectId: "earnzone-51a4f",
  storageBucket: "earnzone-51a4f.firebasestorage.app",
  messagingSenderId: "263039604264",
  appId: "1:263039604264:web:845b2389b49e572209071d"
};

// Toast notification
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.style.display = 'none', 3000);
}
