document.getElementById('loginBtn').addEventListener('click', async () => {
  const userId = document.getElementById('userId').value.trim();
  if (!userId) return alert('Veuillez entrer un identifiant');

  // Stocke l'identifiant dans localStorage (pas besoin de mot de passe ici)
  localStorage.setItem('userId', userId);

  // Vérifie si l'utilisateur existe déjà
  const userRef = db.collection('users').doc(userId);
  const docSnap = await userRef.get();
  if (!docSnap.exists) {
    // Crée un utilisateur s'il n'existe pas encore
    await userRef.set({ id: userId, createdAt: new Date() });
  }

  // Redirige vers la page de notation
  window.location.href = "notation.html";
});
