var express = require('express');
var router = express.Router();
const ProductController = require('../app/Controllers/ProductController');
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });
const auth = require('../config/auth');


router.use(auth);

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

// Deletar todos
router.delete('/delete', ProductController.delete);

module.exports = router;