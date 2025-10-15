const criteres = ['Travail', 'Esprit d’équipe', 'Créativité', 'Communication', 'Fiabilité'];
const pondérations = { 'Travail': 1, 'Esprit d’équipe': 1, 'Créativité': 1, 'Communication': 1, 'Fiabilité': 1 };

async function calcClassement() {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const scores = {};

  users.forEach(u => {
    u.notes && Object.entries(u.notes).forEach(([targetId, crits]) => {
      if (!scores[targetId]) scores[targetId] = { total: 0, count: 0, byCrit: {} };
      Object.entries(crits).forEach(([crit, val]) => {
        if (!scores[targetId].byCrit[crit]) scores[targetId].byCrit[crit] = [];
        scores[targetId].byCrit[crit].push(val);
      });
    });
  });

  const result = Object.entries(scores).map(([id, s]) => {
    const byCritAvg = {};
    let weightedTotal = 0, totalWeight = 0;
    criteres.forEach(c => {
      const arr = s.byCrit[c] || [];
      const avg = arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
      byCritAvg[c] = avg.toFixed(2);
      weightedTotal += avg * (pondérations[c] || 1);
      totalWeight += (pondérations[c] || 1);
    });
    return { id, ...byCritAvg, total: (weightedTotal / totalWeight).toFixed(2) };
  }).sort((a,b) => b.total - a.total);

  const thead = document.querySelector('#resultTable thead');
  const tbody = document.querySelector('#resultTable tbody');
  thead.innerHTML = `<tr><th>Nom</th>${criteres.map(c=>`<th>${c}</th>`).join('')}<th>Total</th></tr>`;
  tbody.innerHTML = result.map(r => `
    <tr>
      <td>${users.find(u=>u.id===r.id)?.name || r.id}</td>
      ${criteres.map(c=>`<td>${r[c]}</td>`).join('')}
      <td><b>${r.total}</b></td>
    </tr>
  `).join('');
}

calcClassement();
