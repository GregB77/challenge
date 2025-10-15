document.getElementById('loginBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value.trim().toLowerCase();
  if (!userId) return alert('Veuillez entrer votre prénom');

  localStorage.setItem('userId', userId);

  // Vérifie si l'utilisateur existe dans Realtime Database
  const userRef = db.ref('users/' + userId);
  userRef.get().then(snapshot => {
    if (!snapshot.exists()) {
      alert('Utilisateur inconnu');
      return;
    }
    // Redirige vers la page de notation
    window.location.href = "notation.html";
  }).catch(err => {
    console.error(err);
    alert('Erreur lors de la connexion');
  });
});
