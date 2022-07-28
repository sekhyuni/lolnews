const express = require('express');
const app = express();

app.use(express.json());

app.listen(31053, () => {
    console.log('Server is started');
});

app.get('/search/keyword', (req, res) => {
    const query = req.query;

    console.log(query);

    res.send(query);
});

app.post('/search/keyword', (req, res) => {
    const body = req.body;

    console.log(body);

    res.send(body);
});