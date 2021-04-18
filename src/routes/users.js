const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const UserController = require('../app/Controllers/UserController');

router.use(auth);
//Buscar user pelo id
router.get('/:id', UserController.show);

//Criar novo user
router.post('/create', UserController.create);

//Update user
router.put('/update', UserController.update);

module.exports = router;