const jsonServer = require('json-server');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-service-account-file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

const db = admin.database();

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/api/codes', (req, res) => {
  try {
    const newCode = req.body;

    if (!newCode.id || !newCode.code) {
      return res.status(400).json({ error: 'ID and code are required' });
    }

    const codesRef = db.ref('codes');
    codesRef.push(newCode, error => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
      } else {
        res.status(201).json(newCode);
      }
    });
  } catch (error) {
    console.error('Error writing to Firebase:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
