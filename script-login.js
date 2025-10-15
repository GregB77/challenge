document.getElementById('loginBtn').addEventListener('click', () => {
  // Récupère le prénom saisi
  const userId = document.getElementById('userId').value.trim().toLowerCase();
  if (!userId) return alert('Veuillez entrer votre prénom');

  // Stocke l'identifiant dans localStorage
  localStorage.setItem('userId', userId);

  // Référence Realtime Database pour l'utilisateur
  const userRef = db.ref('users/' + userId);

  // Vérifie si l'utilisateur existe
  userRef.get()
    .then(snapshot => {
      if (!snapshot.exists()) {
        alert('Utilisateur inconnu');
        return;
      }
      // Redirection vers la page de notation
      window.location.href = "notation.html";
    })
    .catch(err => {
      console.error(err);
      alert('Erreur lors de la connexion');
    });
});
