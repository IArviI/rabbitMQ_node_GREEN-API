const express = require('express'),
    router = express.Router();

const indexController = require('../controllers/index');


router.post('/', indexController.controller);

module.exports = {rout : router};