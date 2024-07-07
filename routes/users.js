const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Inscription d'un utilisateur
  router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    });
  });

  // Connexion d'un utilisateur
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT id FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.status(200).json({ id: row.id });
    });
  });

  // Déconnexion d'un utilisateur
  router.post('/logout', (req, res) => {
    // Pour la démo, nous renvoyons simplement un succès. En pratique, vous devez gérer la déconnexion côté client.
    res.status(200).json({ message: 'Successfully logged out' });
  });

  // Voir tous les utilisateurs (pour vérification)
  router.get('/all', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ users: rows });
    });
  });

  return router;
};
