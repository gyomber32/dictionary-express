const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const dotenv = require("dotenv")
dotenv.config({ path: path.resolve(__dirname, `../dictionary-express/config/${process.env.ENVIRONMENT}.env`) });

const port = process.env.PORT;
const database_host = process.env.DATABASE_HOST;
const database_port = process.env.DATABASE_PORT;
const database_name = process.env.DATABASE_NAME;

/* routes */
// const authRoutes = require('./routes/auth');
const dictionaryRoutes = require('./routes/dictionary');
const translateRoutes = require('./routes/translate');

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
app.use('/translate', translateRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(`${database_host}${database_port}${database_name}`, {
        reconnectTries: 5,
        reconnectInterval: 30000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(result => {
        app.listen(port);
        console.log('\n');
        console.log('****************************************');
        console.log('Dictionary express successfully started!');
        console.log('****************************************');
        console.log('\n');
    })
    .catch(err => {
        console.log(err);
    });