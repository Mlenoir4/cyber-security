const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5001; // Vous pouvez changer le port ici si nécessaire

// Connexion à la base de données SQLite
const db = new sqlite3.Database(':memory:');

// Insertion des données par défaut
const insertDefaultData = () => {
  const users = [
    { username: 'user1', password: 'password1', email: 'user1@example.com' },
    { username: 'user2', password: 'password2', email: 'user2@example.com' }
  ];

  const predictions = [
    { user_id: 1, match: 'TeamA vs TeamB', prediction: 'TeamA wins' },
    { user_id: 1, match: 'TeamC vs TeamD', prediction: 'Draw' },
    { user_id: 1, match: 'TeamE vs TeamF', prediction: 'TeamF wins' },
    { user_id: 1, match: 'TeamG vs TeamH', prediction: 'TeamG wins' },
    { user_id: 1, match: 'TeamI vs TeamJ', prediction: 'TeamJ wins' },
    { user_id: 2, match: 'TeamA vs TeamB', prediction: 'TeamB wins' },
    { user_id: 2, match: 'TeamC vs TeamD', prediction: 'TeamC wins' },
    { user_id: 2, match: 'TeamE vs TeamF', prediction: 'Draw' },
    { user_id: 2, match: 'TeamG vs TeamH', prediction: 'TeamH wins' },
    { user_id: 2, match: 'TeamI vs TeamJ', prediction: 'TeamI wins' }
  ];

  users.forEach(user => {
    db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [user.username, user.password, user.email]);
  });

  predictions.forEach(prediction => {
    db.run('INSERT INTO predictions (user_id, match, prediction) VALUES (?, ?, ?)', [prediction.user_id, prediction.match, prediction.prediction]);
  });
};

// Création des tables et insertion des données par défaut
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS predictions (id INTEGER PRIMARY KEY, user_id INTEGER, match TEXT, prediction TEXT)');
  insertDefaultData();
});

const usersRouter = require('./routes/users')(db);
const predictionsRouter = require('./routes/predictions')(db);

app.use(cors());
app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/predictions', predictionsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
