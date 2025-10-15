const userId = localStorage.getItem('userId');
if (!userId) window.location.href = 'login.html';

const usersRef = db.collection('users');
const notesContainer = document.getElementById('notesContainer');
const criteres = ['Travail', 'Esprit d’équipe', 'Créativité', 'Communication', 'Fiabilité'];
let allUsers = [];
let notes = {};

async function loadUsers() {
  const snapshot = await usersRef.get();
  allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const others = allUsers.filter(u => u.id !== userId);

  notesContainer.innerHTML = others.map(u => `
    <div class="user-block">
      <h3>${u.name || u.id}</h3>
      ${criteres.map(c => `
        <label>${c}: 
          <input type="number" min="1" max="10" id="${u.id}-${c}" />
        </label><br>
      `).join('')}
    </div>
  `).join('');

  // Charger les notes précédentes si elles existent
  const docSnap = await usersRef.doc(userId).get();
  const existingNotes = docSnap.data()?.notes || {};
  Object.entries(existingNotes).forEach(([targetId, crit]) => {
    Object.entries(crit).forEach(([critName, val]) => {
      const input = document.getElementById(`${targetId}-${critName}`);
      if (input) input.value = val;
    });
  });
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const newNotes = {};
  allUsers.filter(u => u.id !== userId).forEach(u => {
    newNotes[u.id] = {};
    criteres.forEach(c => {
      const val = parseInt(document.getElementById(`${u.id}-${c}`).value);
      if (!isNaN(val)) newNotes[u.id][c] = val;
    });
  });

  await usersRef.doc(userId).update({ notes: newNotes });
  alert('Notes enregistrées !');
});

loadUsers();
