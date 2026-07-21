const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.json({
    service: 'api-containerapp',
    host: 'containerapp',
    message: 'Hello from Azure Container Apps',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'api-containerapp',
    host: 'containerapp',
    time: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`api-containerapp listening on port ${port}`);
});
