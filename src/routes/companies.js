var express = require('express');
var router = express.Router();
const auth = require('../config/auth');
const CompanyController = require('../app/Controllers/CompanyController');

router.use(auth);

//Criar nova empresa
router.post('/create', CompanyController.create);


//Buscar empresa pelo id
router.get('/:id', CompanyController.show);

// Atualizar empresa
router.put('/update', CompanyController.update);

module.exports = router;