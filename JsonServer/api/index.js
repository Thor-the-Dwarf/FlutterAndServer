const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'db.json')); // Pfad zur db.json im übergeordneten Verzeichnis
const middlewares = jsonServer.defaults();

server.use(cors()); // CORS Middleware hinzufügen
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Custom route to handle POST requests and update db.json
server.post('/api/codes', (req, res) => {
  const dbFilePath = path.join(__dirname, '..', 'db.json');
  const newCode = req.body;

  // Read the current content of db.json
  const dbContent = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  dbContent.codes.push(newCode);

  // Write the updated content back to db.json
  fs.writeFileSync(dbFilePath, JSON.stringify(dbContent, null, 2));

  res.status(201).json(newCode);
});

server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
