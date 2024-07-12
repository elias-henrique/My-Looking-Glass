const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/ping/:address', (req, res) => {
  const address = req.params.address;

  exec(`ping -c 1 ${address}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send({ error: stderr });
      return;
    }

    res.send({ result: stdout });
  });
});

