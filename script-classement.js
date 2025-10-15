const criteres = ['Goût', 'Originalité', 'Réalisation'];
const pond = { Goût: 1, Originalité: 1, Réalisation: 1 };

db.ref('users').get().then(snapshot => {
  const users = snapshot.val();
  const scores = {};

  Object.entries(users).forEach(([uid, u]) => {
    if (u.notes) {
      Object.entries(u.notes).forEach(([targetId, crit]) => {
        if (!scores[targetId]) scores[targetId] = { byCrit: {}, total: 0 };
        Object.entries(crit).forEach(([c, val]) => {
          if (!scores[targetId].byCrit[c]) scores[targetId].byCrit[c] = [];
          scores[targetId].byCrit[c].push(val);
        });
      });
    }
  });

  const result = Object.entries(scores).map(([id, s]) => {
    const byCritAvg = {};
    let weightedTotal = 0, totalWeight = 0;
    criteres.forEach(c => {
      const arr = s.byCrit[c] || [];
      const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      byCritAvg[c] = avg.toFixed(2);
      weightedTotal += avg * pond[c];
      totalWeight += pond[c];
    });
    return { id, ...byCritAvg, total: (weightedTotal / totalWeight).toFixed(2) };
  }).sort((a, b) => b.total - a.total);

  const thead = document.querySelector('#resultTable thead');
  const tbody = document.querySelector('#resultTable tbody');
  thead.innerHTML = `<tr><th>Nom</th>${criteres.map(c => `<th>${c}</th>`).join('')}<th>Total</th></tr>`;
  tbody.innerHTML = result.map(r => `
    <tr>
      <td>${users[r.id].name}</td>
      ${criteres.map(c => `<td>${r[c]}</td>`).join('')}
      <td><b>${r.total}</b></td>
    </tr>
  `).join('');
});
