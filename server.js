const express = require('express');
const path = require('path');

const app = express();

// Serve static files in the /dist folder
app.use('/', express.static(path.join(__dirname, '/dist')));

app.get('/', (req, res) => res.sendFile(__dirname, '/dist/index.html'));

app.listen(3000, () => console.log('The server is running at port 3000'));

module.exports = app;
