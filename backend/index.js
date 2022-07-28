const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();

app.use(express.json());

app.listen(8080, () => {
    console.log('Server is started');
});

// app.post('/accounts/login', (req, res) => {
//     const { id, password } = req.body;

//     fs.readFile('./accounts.json', (err, data) => {
//         const accounts = JSON.parse(data);

//         let accountFound = false;

//         accounts.forEach(account => {
//             if (account.id === id && account.password === password) {
//                 accountFound = true;
//                 res.send('Success!');
//             }
//         });

//         if (!accountFound) {
//             res.status(406).send('Error!');
//         }
//     });
// });

app.get('/search/keyword', (req, res) => {
    const query = req.query;

    console.log(query);

    res.send(query);
});

// app.post('/search/keyword', (req, res) => {
//     const body = req.body;

//     console.log(body);

//     res.send(body);
// });