const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'web-appservice',
    host: 'appservice',
    time: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`web-appservice listening on port ${port}`);
});
