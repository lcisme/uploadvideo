const express = require('express');
const path = require('path');
const upLoadVideo = require('./uploadVideo');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', upLoadVideo);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});