var express = require('express');
var router = express.Router();
const ProductController = require('../app/Controllers/ProductController');
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });



router.use(upload.single('file'));
//Buscar produto por nome, fabricante, categoria, tags
router.get('/search', ProductController.search);
//Buscar empresa pelo id
router.get('/:id', ProductController.show);
//Criar nova empresa
router.post('/create', ProductController.create);
// Adicionar muitos produtos 
router.post('/addMany', ProductController.addMany);

// Atualizar produto
router.put('/update', ProductController.update);

module.exports = router;