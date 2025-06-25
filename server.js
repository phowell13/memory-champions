const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const SCORE_FILE = './scores.json';

app.use(cors());
app.use(express.json());

// Get top scores
app.get('/scores', (req, res) => {
  try {
    if (!fs.existsSync(SCORE_FILE)) {
      fs.writeFileSync(SCORE_FILE, JSON.stringify([]));
    }
    const scores = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read scores' });
  }
});

// Post a new score
app.post('/scores', (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid data' });
    }

    let scores = [];
    if (fs.existsSync(SCORE_FILE)) {
      scores = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
    }

    scores.push({ name, score });
    // Sort descending by score and keep top 10
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 10);

    fs.writeFileSync(SCORE_FILE, JSON.stringify(scores, null, 2));
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
