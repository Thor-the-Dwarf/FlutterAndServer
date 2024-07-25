const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json')); // Korrigierter Pfad
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/api/codes', (req, res) => {
  try {
    const dbFilePath = path.join(__dirname, 'db.json');
    const newCode = req.body;

    if (!newCode.id || !newCode.code) {
      return res.status(400).json({ error: 'ID and code are required' });
    }

    const dbContent = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

    // Sicherstellen, dass das codes-Array existiert
    if (!Array.isArray(dbContent.codes)) {
      dbContent.codes = [];
    }

    dbContent.codes.push(newCode);

    fs.writeFileSync(dbFilePath, JSON.stringify(dbContent, null, 2));
    res.status(201).json(newCode);
  } catch (error) {
    console.error('Error writing to db.json:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
