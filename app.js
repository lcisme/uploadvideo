const express = require('express');
const path = require('path');
const upLoadVideo = require('./uploadVideo');
require('dotenv').config()


const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', upLoadVideo);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

