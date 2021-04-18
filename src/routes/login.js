var express = require('express');
var router = express.Router();
const LoginController = require('../app/Controllers/LoginController');


router.get('/', LoginController.login);

module.exports = router;