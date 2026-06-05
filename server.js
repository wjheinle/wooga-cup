const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'scores.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      players: [
        { id: 'joe',    name: 'Joe',         handicap: 13, eligible: true,  tee: 'Gold' },
        { id: 'ryan',   name: 'Ryan',         handicap: 30, eligible: true,  tee: 'Gold' },
        { id: 'tom',    name: 'Tom',          handicap: 36, eligible: true,  tee: 'Gold' },
        { id: 'tuna',   name: 'Jeff (Tuna)',  handicap: 36, eligible: true,  tee: 'Gold' },
        { id: 'bill',   name: 'Bill',         handicap: 18, eligible: true,  tee: 'Gold' },
        { id: 'jon',    name: 'Jon',          handicap: 36, eligible: true,  tee: 'Gold' },
        { id: 'aiden',  name: 'Aiden',        handicap: 8,  eligible: true,  tee: 'Gold' },
        { id: 'max',    name: 'Max',          handicap: 36, eligible: true,  tee: 'Gold' },
        { id: 'ben',    name: 'Ben',          handicap: null, eligible: false, tee: 'Gold' },
        { id: 'jason',  name: 'Jason',        handicap: null, eligible: false, tee: 'Gold' }
      ],
      scores: {},
      locked: false
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all data
app.get('/api/data', (req, res) => {
  res.json(loadData());
});

// POST score for a player/hole
app.post('/api/score', (req, res) => {
  const { playerId, hole, strokes } = req.body;
  if (!playerId || !hole || strokes === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const data = loadData();
  if (!data.scores[playerId]) data.scores[playerId] = {};
  data.scores[playerId][hole] = strokes;
  saveData(data);
  res.json({ ok: true });
});

// PATCH player handicap
app.patch('/api/player/:id', (req, res) => {
  const { handicap, tee } = req.body;
  const data = loadData();
  const player = data.players.find(p => p.id === req.params.id);
  if (!player) return res.status(404).json({ error: 'Player not found' });
  if (handicap !== undefined) player.handicap = handicap;
  if (tee !== undefined) player.tee = tee;
  saveData(data);
  res.json({ ok: true, player });
});

// DELETE / reset scores
app.delete('/api/scores', (req, res) => {
  const data = loadData();
  data.scores = {};
  saveData(data);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🏌️ Wooga Cup server running on port ${PORT}`);
});
