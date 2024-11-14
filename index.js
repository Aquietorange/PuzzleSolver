// index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000);
}

module.exports = app;
