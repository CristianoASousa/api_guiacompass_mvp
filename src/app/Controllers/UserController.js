const User = require('../Models/User');
const yup = require('yup');
const jwt = require('../../config/jwt');

class UserController {

    //Buscando um user pelo id
    async show(req, res) {
        var id = req.params.id
        var user = await User.findById(id)
        return res.status(200).send(user)
    }

    // Cadastrando o usuário
    async create(req, res) {

        //Validação dos dados com YUP
        let schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required(),
            permission: yup.number().required(),
            company: yup.object({
                id: yup.string().required(),
                name: yup.string().required()
            })
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: true,
                message: "Dados inválidos"
            })
        }

        //Verificando se o email já está cadastrado
        const emailExist = req.body.email;
        await User.findOne({ email:emailExist },(err, resp) => {
            if (resp && resp.email === emailExist) { 
                res.status(400).json({
                    err,
                    message: "Email já cadastrado"
                })
            } 
        });
        

        //Desestruturação dos dados da requisição
        const { name, lastname, email, password, permission, company } = req.body;

        const data = {
            name,
            lastname,
            email,
            password,
            permission,
            company
        }

        //Salvando novo user
        try {
            const result = await User.create(data);
            const { password, ...user} = result.toObject()
            const token = jwt.sign({ user: user._id });
            user.createdAt = user.createdAt.toLocaleString('pt-br');
            user.updatedAt = user.createdAt.toLocaleString('pt-br');
            const response = {
                token,
                user
            };
            
            res.status(201).send(response).json();

        } catch (error) {
            res.send(400, error).json({
                error: true,
                message: "Erro ao cadastrar o usuário"
            })
        }
    }

    // Update user
    async update(req, res) {
        const { permission, ...data } = req.body.data; 
        const id = req.body.id;
        const loggedUser = req.body.loggedUser;
        const root = req.body.root ? req.body.root : false;

        if(root) { data.permission = permission }
        
        if(loggedUser == id) {
            try {
                await User.updateOne({_id : id}, data );
                const user = await User.findById(id);
                res.status(201).send(user);
            } catch (error) {
                res.status(401).json({
                    error: true,
                    message: "Não autorizado"
                })
            }
        }
        res.status(401).json({
            error: true,
            message: "Não autorizado"
        })
        
    }
}

module.exports = new UserController();