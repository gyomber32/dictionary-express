const DATABASE_URL = 'mongodb://localhost:27017/dictionary';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* routes */
// const authRoutes = require('./routes/auth');
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

//app.use('/auth', authRoutes);
app.use('/dictionary', dictionaryRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(DATABASE_URL, {
        reconnectTries: 5,
        reconnectInterval: 30000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(result => {
        app.listen(3000);
        console.log('\n');
        console.log('****************************************');
        console.log('Dictionary express successfully started!');
        console.log('****************************************');
        console.log('\n');
    })
    .catch(err => {
        console.log(err);
    });