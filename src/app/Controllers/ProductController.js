const Product = require('../Models/Product');
const yup = require('yup');

function generateTags(text){
    const separators = /[s,.;:()'+]/g;
    text = text.toUpperCase().normalize("NFD").replace(separators, "");
    //separando e removendo repetidos
    const arr = text.split(' ').filter((item, pos, self) => self.indexOf(item) == pos);
    //removendo nulls, undefineds e strings vazias
    return arr.filter(item => (item));
}

class ProductController {

   
    // Buscar empresa pelo id
    async show(req, res) {
        var id = req.params.id;
        try {
            var product = await Product.findById(id);
            return res.status(200).send(product);
        } catch (error) {
            return res.status(400).send({error: true, message: "produto inexistente"});
        }
        
    }

    //Buscar produto por nome, fabricante, categoria, tags
    async search(req, res) {
        
        const query = req.query.product.trim().replace(/\s+/g, ' ')
        const search = generateTags(query)
        const manufacturer = req.query.manufacturer ? req.query.manufacturer : false;
        //Limite de páginas
        const currentPage = req.query.currentPage;
        const limit = 20;
        const skip = limit * (currentPage - 1);

        // Pesquisa com filtro de fabricante
        if (manufacturer) {
            try {
                const result = await Product.find().and(
                    [
                        { tags: { $all: search } },
                        { manufacturer: manufacturer }
                    ]
                ).skip(skip).limit(limit)

                return res.status(200).send(result)

            } catch (error) {
                return res.status(400).json({
                    error: true,
                    message: "Erro na busca"
                })
            }
        }

        // Pesquisa apenas com o nome do produto
        try {

            const result = await Product.find( { tags: { $all: search } } )
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Erro na busca"
            })
        }

    }

    // Cadastrar produto
    async create(req, res) {
        let schema = yup.object().shape({
            product: yup.string().required(),
            manufacturer: yup.string().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: true,
                message: "Dados inválidos"
            })
        }
        // Salvando produto
        try {

            const product = await Product.create(req.body);
            const newProduct = await Product.findById(product._id)
            return res.status(201).send(newProduct).json();

        } catch (error) {
            return res.status(400).send(error).json({
                error: true,
                message: "Erro ao cadastrar o produto"
            })
        }

    }

    // Cadastro em massa 
    async addMany(req, res) {

        const data = JSON.parse(req.file.buffer.toString())
        // Salvando produto
        
        try {

            const product = await Product.insertMany(data);
            return res.status(201).send({error: false, message: "success"});

        } catch (error) {
            return res.status(400).send(error).json({
                error: true,
                message: "Erro ao cadastrar o produto"
            })
        }

    }

    // Update 
    async update(req, res) {
        return res.send(req.body)
    }
    // Delete
    async delete(req, res) {
        try {
            await Product.deleteMany({manufacturer: 'henn'})
            return res.status(200).send({error: false, message: "success"})
        } catch (error) {
            return res.status(200).send({error: true, message: error})
        }
    }
}

module.exports = new ProductController();