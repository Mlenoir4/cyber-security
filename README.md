# Football Predictions Application

## Description

Cette application web de pronostics de football est développée dans le cadre d'un projet pédagogique pour démontrer la compréhension des concepts de cybersécurité, notamment les vulnérabilités XSS (Cross-Site Scripting) et IDOR (Insecure Direct Object Reference). L'application permet aux utilisateurs de s'inscrire, de se connecter, de soumettre des prédictions de matchs de football, de voir les prédictions et de se déconnecter.

## Technologies utilisées

- Frontend : React
- Backend : Node.js, Express
- Base de données : SQLite

## Installation

1. **Clonez le dépôt :**

    ```bash
    git clone <URL_DU_DEPOT>
    cd <NOM_DU_DEPOT>
    ```

2. **Installez les dépendances pour le backend :**

    ```bash
    cd backend
    npm install
    ```

3. **Installez les dépendances pour le frontend :**

    ```bash
    cd frontend
    npm install
    ```

## Lancement de l'application

1. **Lancez le backend :**

    ```bash
    cd backend
    node index.js
    ```

    Le serveur backend écoute sur `http://localhost:5001`.

2. **Lancez le frontend :**

    ```bash
    cd frontend
    npm start
    ```

    Le frontend est accessible sur `http://localhost:3000`.

## Utilisation

- **Inscription :** Entrez un nom d'utilisateur, un mot de passe et un email pour créer un compte.
- **Connexion :** Connectez-vous avec votre nom d'utilisateur et votre mot de passe.
- **Soumettre une prédiction :** Entrez les détails du match et votre prédiction.
- **Voir les prédictions :** Affichez toutes les prédictions soumises.
- **Déconnexion :** Cliquez sur le bouton de déconnexion pour vous déconnecter.

## Vulnérabilités intentionnelles

### XSS (Cross-Site Scripting)

La vulnérabilité XSS est présente dans l'affichage des prédictions. Le code suivant permet l'injection de code HTML/JavaScript dans les prédictions soumises.

**Frontend (React) - Composant `PredictionsList` :**

```javascript
const PredictionsList = ({ predictions }) => {
  return (
    <ul>
      {predictions.map(prediction => (
        <li key={prediction.id} dangerouslySetInnerHTML={{ __html: `${prediction.match}: ${prediction.prediction} (User ${prediction.user_id})` }} />
      ))}
    </ul>
  );
};

### IDOR

 La vulnérabilité IDOR est présente dans la route permettant de voir une prédiction spécifique. La route ne vérifie pas si l'utilisateur a le droit d'accéder à la prédiction demandée.

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


 ### Mesures correctives
    Pour XSS :

Évitez d'utiliser dangerouslySetInnerHTML.
Utilisez des bibliothèques pour échapper les entrées utilisateur avant de les afficher.

    Pour IDOR :
    
Implémentez des contrôles d'accès robustes.
Vérifiez que l'utilisateur authentifié a le droit d'accéder à la ressource demandée avant de la renvoyer.
