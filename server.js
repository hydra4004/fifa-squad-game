const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

app.get('/players', (req, res) => {
  const data = fs.readFileSync('./data/players.json');
  res.json(JSON.parse(data));
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});