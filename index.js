const express = require('express');
const app = express();
const env = require('./config/env');
const bodyParser = require("body-parser");

//api connection routes
const indexRout = require('./api/routes/index')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(env.serverPortM1, () => {
    console.log('Server M1 start');
});

// api routes (Router Controller Model)
app.use('/', indexRout.rout)