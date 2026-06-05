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

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      players: [
        { id: 'joe',   name: 'Joe',        handicap: 13, eligible: true  },
        { id: 'ryan',  name: 'Ryan',        handicap: 30, eligible: true  },
        { id: 'tom',   name: 'Tom',         handicap: 36, eligible: true  },
        { id: 'tuna',  name: 'Jeff (Tuna)', handicap: 36, eligible: true  },
        { id: 'bill',  name: 'Bill',        handicap: 18, eligible: true  },
        { id: 'jon',   name: 'Jon',         handicap: 36, eligible: true  },
        { id: 'aiden', name: 'Aiden',       handicap: 8,  eligible: true  },
        { id: 'max',   name: 'Max',         handicap: 36, eligible: true  },
        { id: 'ben',   name: 'Ben',         handicap: null, eligible: false },
        { id: 'jason', name: 'Jason',       handicap: null, eligible: false }
      ],
      // scores[round][playerId][hole] = strokes
      // round = 'friday' (holes 10-18) or 'saturday' (holes 1-18)
      scores: { friday: {}, saturday: {} }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  // migrate old format
  if (!data.scores.friday) data.scores = { friday: {}, saturday: data.scores };
  return data;
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/data', (req, res) => res.json(loadData()));

app.post('/api/score', (req, res) => {
  const { playerId, round, hole, strokes } = req.body;
  if (!playerId || !round || !hole || strokes === undefined)
    return res.status(400).json({ error: 'Missing fields' });
  const data = loadData();
  if (!data.scores[round]) data.scores[round] = {};
  if (!data.scores[round][playerId]) data.scores[round][playerId] = {};
  if (strokes === null || strokes === '') {
    delete data.scores[round][playerId][hole];
  } else {
    data.scores[round][playerId][hole] = parseInt(strokes);
  }
  saveData(data);
  res.json({ ok: true });
});

app.patch('/api/player/:id', (req, res) => {
  const { handicap } = req.body;
  const data = loadData();
  const player = data.players.find(p => p.id === req.params.id);
  if (!player) return res.status(404).json({ error: 'Not found' });
  if (handicap !== undefined) player.handicap = handicap;
  saveData(data);
  res.json({ ok: true, player });
});

// Reset a specific round or all
app.delete('/api/scores', (req, res) => {
  const { round } = req.query;
  const data = loadData();
  if (round === 'friday') data.scores.friday = {};
  else if (round === 'saturday') data.scores.saturday = {};
  else data.scores = { friday: {}, saturday: {} };
  saveData(data);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`🏌️  Wooga Cup 2026 on port ${PORT}`));
