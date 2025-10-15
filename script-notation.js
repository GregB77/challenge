const userId = localStorage.getItem('userId');
if (!userId) window.location.href = 'login.html';

const criteres = ['Goût', 'Originalité', 'Réalisation'];
const notesContainer = document.getElementById('notesContainer');
let allUsers = [];

db.ref('users').get().then(snapshot => {
  const users = snapshot.val();
  allUsers = Object.keys(users).filter(u => u !== userId);

  notesContainer.innerHTML = allUsers.map(u => `
    <div class="user-block">
      <h3>${users[u].name}</h3>
      ${criteres.map(c => `<label>${c}: <input type="number" min="1" max="10" id="${u}-${c}" /></label><br>`).join('')}
    </div>
  `).join('');

  // Charger les notes existantes si elles existent
  db.ref('users/' + userId + '/notes').get().then(snap => {
    const existing = snap.val() || {};
    Object.entries(existing).forEach(([targetId, crit]) => {
      Object.entries(crit).forEach(([critName, val]) => {
        const input = document.getElementById(targetId + '-' + critName);
        if (input) input.value = val;
      });
    });
  });
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const newNotes = {};
  allUsers.forEach(u => {
    newNotes[u] = {};
    criteres.forEach(c => {
      const val = parseInt(document.getElementById(u + '-' + c).value);
      if (!isNaN(val)) newNotes[u][c] = val;
    });
  });

  db.ref('users/' + userId + '/notes').set(newNotes)
    .then(() => alert('Notes enregistrées !'))
    .catch(err => {
      console.error(err);
      alert('Erreur lors de l’enregistrement des notes');
    });
});
