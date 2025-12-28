// 🔥 CONFIG FIREBASE (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists || userDoc.data().plan !== 'pro') {
      alert('Acesso disponível apenas para assinantes do NeuroCAA Pro.');
      auth.signOut();
      return;
    }

    window.location.href = 'dashboard.html';
  } catch (e) {
    alert('Erro no login: ' + e.message);
  }
}

// RESET SENHA
function resetPassword() {
  const email = document.getElementById('email').value;
  if (!email) {
    alert('Digite seu e-mail.');
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert('E-mail de redefinição enviado!'))
    .catch(err => alert(err.message));
}
