/* ============================================================
   UN GAMING PRESQUE PARFAIT — script.js
   Gère : ratings buttons, soumission du form, localStorage,
          rendu de la page admin (stats + réponses).
   ============================================================ */

'use strict';

const LS_KEY = 'ugpp_responses';

// ── Helpers ────────────────────────────────────────────────────────

function getResponses() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function saveResponses(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ── Rating buttons ─────────────────────────────────────────────────

function initRatingGroups() {
  document.querySelectorAll('.rating-group').forEach(group => {
    const name = group.dataset.name;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.className = 'rating-input';
    group.appendChild(input);

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rating-btn';
      btn.textContent = i;
      btn.dataset.value = i;

      btn.addEventListener('click', () => {
        group.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        input.value = i;
      });

      group.insertBefore(btn, input);
    }
  });
}

// ── Form submit ────────────────────────────────────────────────────

function initForm() {
  const form = document.getElementById('gamingForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const entry = { id: Date.now(), date: new Date().toISOString() };

    for (const [key, value] of data.entries()) {
      entry[key] = value;
    }

    const requiredNotes = [
      'note_accueil','note_ambiance','note_discussions',
      'note_jeu','note_social','note_globale'
    ];

    for (const n of requiredNotes) {
      if (!entry[n]) {
        alert('Merci de donner une note pour chaque section avant d\'envoyer !');
        return;
      }
    }

    const responses = getResponses();
    responses.push(entry);
    saveResponses(responses);

    form.classList.add('hidden');
    const msg = document.getElementById('successMsg');
    msg.classList.remove('hidden');
    document.getElementById('globalScore').textContent = entry.note_globale;
  });
}

// ── Admin page ─────────────────────────────────────────────────────

const NOTE_FIELDS = [
  { key: 'note_accueil', label: 'Accueil' },
  { key: 'note_ambiance', label: 'Ambiance' },
  { key: 'note_discussions', label: 'Discussions' },
  { key: 'note_onibi', label: 'Onibi' },
  { key: 'note_ares', label: 'Ares' },
  { key: 'note_rekirts', label: 'Rekirts' },
  { key: 'note_astreia', label: 'Astreia' },
  { key: 'note_jeu', label: 'Session jeu' },
  { key: 'note_social', label: 'Expérience sociale' },
  { key: 'note_globale', label: 'Note globale' },
];

const SECTIONS = [
  {
    title: '⭐ Accueil', fields: [
      { key: 'accueil_ressenti', label: 'Ressenti' },
      { key: 'accueil_impression', label: 'Première impression' },
      { key: 'note_accueil', label: 'Note', isNote: true },
    ]
  },
  {
    title: '😂 Ambiance', fields: [
      { key: 'ambiance_ambiance', label: 'Ambiance' },
      { key: 'ambiance_vannes', label: 'Vannes' },
      { key: 'ambiance_confort', label: 'Confort vocal' },
      { key: 'note_ambiance', label: 'Note', isNote: true },
    ]
  },
  {
    title: '🎧 Discussions', fields: [
      { key: 'disc_sujets', label: 'Sujets' },
      { key: 'disc_moment_top', label: 'Moment préféré' },
      { key: 'disc_moment_wtf', label: 'Moment WTF' },
      { key: 'note_discussions', label: 'Note', isNote: true },
    ]
  },
  {
    title: '🎭 Casting', fields: [
      { key: 'onibi_impression', label: 'Onibi — impression' },
      { key: 'onibi_vibe', label: 'Onibi — vibe' },
      { key: 'note_onibi', label: 'Onibi — note', isNote: true },
      { key: 'ares_impression', label: 'Ares — impression' },
      { key: 'ares_vibe', label: 'Ares — vibe' },
      { key: 'note_ares', label: 'Ares — note', isNote: true },
      { key: 'rekirts_impression', label: 'Rekirts — impression' },
      { key: 'rekirts_vibe', label: 'Rekirts — vibe' },
      { key: 'note_rekirts', label: 'Rekirts — note', isNote: true },
      { key: 'astreia_impression', label: 'Astreia — impression' },
      { key: 'astreia_vibe', label: 'Astreia — vibe' },
      { key: 'note_astreia', label: 'Astreia — note', isNote: true },
    ]
  },
  {
    title: '🎮 Session jeu', fields: [
      { key: 'jeu_ressenti', label: 'Ressenti' },
      { key: 'jeu_coordination', label: 'Coordination' },
      { key: 'jeu_chaos', label: 'Chaos' },
      { key: 'jeu_moment', label: 'Moment clutch/honteux' },
      { key: 'note_jeu', label: 'Note', isNote: true },
    ]
  },
  {
    title: '🍽️ Expérience sociale', fields: [
      { key: 'social_confort', label: 'Confort' },
      { key: 'social_integration', label: 'Intégration' },
      { key: 'social_feeling', label: 'Feeling' },
      { key: 'note_social', label: 'Note', isNote: true },
    ]
  },
  {
    title: '🧁 Avis final', fields: [
      { key: 'retour', label: 'Retour ?' },
      { key: 'resume', label: 'Résumé' },
      { key: 'note_globale', label: 'Note globale', isNote: true },
      { key: 'commentaire', label: 'Commentaire' },
    ]
  },
];

function average(responses, key) {
  const vals = responses.map(r => parseFloat(r[key])).filter(v => !isNaN(v));
  if (!vals.length) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

function renderStats(responses) {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  NOTE_FIELDS.forEach(({ key, label }) => {
    const avg = average(responses, key);
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <span class="stat-label">${label}</span>
      <span class="stat-value">${avg !== null ? avg : '—'}</span>
      <span class="stat-sub">/ 10 · ${responses.filter(r => r[key]).length} vote(s)</span>
    `;
    grid.appendChild(card);
  });
}

function buildResponseTable(entry) {
  let html = '<table class="response-table">';
  SECTIONS.forEach(section => {
    html += `<tr class="section-row"><td colspan="2">${section.title}</td></tr>`;
    section.fields.forEach(f => {
      const val = entry[f.key] || '—';
      html += `
        <tr>
          <th>${f.label}</th>
          <td class="${f.isNote ? 'note' : ''}">${f.isNote ? val + '/10' : val}</td>
        </tr>`;
    });
  });
  html += '</table>';
  return html;
}

function renderResponses(responses) {
  const list = document.getElementById('responsesList');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('responseCount');
  if (!list) return;

  count.textContent = responses.length + ' réponse' + (responses.length > 1 ? 's' : '');

  if (!responses.length) {
    list.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.classList.remove('hidden');
  list.innerHTML = '';

  [...responses].reverse().forEach(entry => {
    const card = document.createElement('div');
    card.className = 'response-card';

    const retour = entry.retour || '?';
    const score = entry.note_globale ? entry.note_globale + '/10' : '—';
    const resume = entry.resume ? `"${entry.resume}"` : 'Pas de résumé';

    card.innerHTML = `
      <div class="response-card-header">
        <div class="response-meta">
          <span class="response-date">${formatDate(entry.date)}</span>
          <span class="response-score">${score} · ${resume} · Retour : ${retour}</span>
        </div>
        <div class="response-actions">
          <button class="btn-delete" data-id="${entry.id}">Supprimer</button>
          <span class="toggle-icon">▾</span>
        </div>
      </div>
      <div class="response-body">
        ${buildResponseTable(entry)}
      </div>
    `;

    card.querySelector('.response-card-header').addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-delete')) return;
      card.classList.toggle('open');
    });

    card.querySelector('.btn-delete').addEventListener('click', () => {
      if (!confirm('Supprimer cette réponse ?')) return;
      const updated = getResponses().filter(r => r.id !== entry.id);
      saveResponses(updated);
      initAdmin();
    });

    list.appendChild(card);
  });
}

function initAdmin() {
  if (!document.getElementById('statsGrid')) return;
  const responses = getResponses();
  renderStats(responses);
  renderResponses(responses);
}

// ── Init ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initRatingGroups();
  initForm();
  initAdmin();
});

/* ============================================================
   GATE D'ACCÈS ADMIN — MOT DE PASSE
   ============================================================ */

const gateOverlay = document.getElementById('adminGate');
const gateInput = document.getElementById('gateInput');
const gateBtn = document.getElementById('gateBtn');
const gateError = document.getElementById('gateError');
const adminContent = document.getElementById('adminContent');

if (gateOverlay && gateInput && gateBtn && gateError && adminContent) {

  const ADMIN_CODE = test ;

  gateBtn.addEventListener('click', () => {
    if (gateInput.value.trim() === ADMIN_CODE) {
      gateOverlay.classList.add('hidden');
      adminContent.classList.remove('hidden');
    } else {
      gateError.classList.remove('hidden');
      setTimeout(() => gateError.classList.add('hidden'), 2000);
    }
  });

  gateInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
      gateBtn.click();
    }
  });

}
