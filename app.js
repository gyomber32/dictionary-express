const DATABASE_URL = 'mongodb://localhost:27017/dictionary';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* routes */
const authRoutes = require('./routes/auth');
const dictionaryRoutes = require('./routes/dictionary');

const app = express();

/* application/json */
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

/*app.use('/auth', authRoutes);
app.use('/dictionary', dictionaryRoutes);*/

mongoose
    .connect(DATABASE_URL, { useNewUrlParser: true })
    .then(result => {
        app.listen(3000);
        console.log('Dictionary express successfully started!');
    })
    .catch(err => {
        console.log(err);
    });