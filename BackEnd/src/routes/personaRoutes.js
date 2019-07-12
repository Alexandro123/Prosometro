'use strict'

var express = require('express');
var persona = require('../controllers/PersonaController');

var api = express.Router();
var md_auth = require('../middlewares/autheticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './src/uploads/personas'})