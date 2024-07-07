const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Soumettre un pronostic
  router.post('/submit', (req, res) => {
    const { user_id, match, prediction } = req.body;
    db.run('INSERT INTO predictions (user_id, match, prediction) VALUES (?, ?, ?)', [user_id, match, prediction], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    });
  });

  // Voir tous les pronostics
  router.get('/view', (req, res) => {
    db.all('SELECT * FROM predictions', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ predictions: rows });
    });
  });

  // Voir un pronostic spécifique (vulnérabilité IDOR)
  router.get('/view/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM predictions WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Prediction not found' });
      }
      res.status(200).json({ prediction: row });
    });
  });

  return router;
};
