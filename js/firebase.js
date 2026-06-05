// EarnZone Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB94zgBIclBjVTgiuR_ceRuCoQtx555Qk8",
  authDomain: "earnzone-51a4f.firebaseapp.com",
  projectId: "earnzone-51a4f",
  storageBucket: "earnzone-51a4f.firebasestorage.app",
  messagingSenderId: "263039604264",
  appId: "1:263039604264:web:845b2389b49e572209071d",
  measurementId: "G-DGN3KPV38K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── AUTH FUNCTIONS ──

// Sign Up
async function ezSignup(name, email, password, referralCode = '') {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const myCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    await setDoc(doc(db, 'users', uid), {
      name,
      email,
      points: 100,
      referralCode: myCode,
      joinedAt: serverTimestamp(),
      history: [{ amount: 100, reason: 'Welcome bonus 🎁', date: new Date().toISOString() }]
    });

    // Reward referrer
    if (referralCode) {
      const refSnap = await getDoc(doc(db, 'referrals', referralCode));
      if (refSnap.exists()) {
        const refUid = refSnap.data().uid;
        await updateDoc(doc(db, 'users', refUid), {
          points: increment(50),
          history: arrayUnion({ amount: 50, reason: 'Referral bonus 👥', date: new Date().toISOString() })
        });
      }
    }

    // Save referral code
    await setDoc(doc(db, 'referrals', myCode), { uid });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Login
async function ezLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Logout
async function ezLogout() {
  await signOut(auth);
  window.location.href = '../pages/login.html';
}

// Get current user data
async function ezGetUser() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  return snap.exists() ? { uid: user.uid, ...snap.data() } : null;
}

// Add points
async function ezAddPoints(amount, reason) {
  const user = auth.currentUser;
  if (!user) return;
  await updateDoc(doc(db, 'users', user.uid), {
    points: increment(amount),
    history: arrayUnion({ amount, reason, date: new Date().toISOString() })
  });
  showToast(`+${amount} pts — ${reason} 🎉`);
}

// Redeem points
async function ezRedeem(method, required) {
  const user = auth.currentUser;
  if (!user) return;
  const snap = await getDoc(doc(db, 'users', user.uid));
  const pts = snap.data().points || 0;
  if (pts < required) {
    showToast(`Need ${required} pts! You have ${pts} pts.`);
    return false;
  }
  await updateDoc(doc(db, 'users', user.uid), {
    points: increment(-required),
    history: arrayUnion({ amount: -required, reason: `Redeemed via ${method} 💸`, date: new Date().toISOString() })
  });
  showToast(`Redemption requested via ${method}! Processing in 24h.`);
  return true;
}

// Toast notification
function showToast(msg) {
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
}

export { auth, db, onAuthStateChanged, ezSignup, ezLogin, ezLogout, ezGetUser, ezAddPoints, ezRedeem, showToast };
