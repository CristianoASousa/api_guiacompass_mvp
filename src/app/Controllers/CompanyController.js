const Company = require('../Models/Company');
const User = require('../Models/User');
const jwt = require('../../config/jwt');
const yup = require('yup');

class CompanyController {

    // Buscar empresa pelo id
    async show(req, res) {
        var id = req.params.id
        var company = await Company.findById(id)
        return res.status(200).send(company)
    }

    // Cadastrar nova empresa
    async create(req, res) {
        let schema = yup.object().shape({
            corporateName: yup.string().required(),
            tradeName: yup.string().required(),
            cnpj: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required()
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
                return res.status(400).json({
                    err,
                    message: "Email já cadastrado"
                })
            } 
        });
        
        
        //Desestruturação dos dados da requisição
        const { corporateName, tradeName, cnpj } = req.body;
        const companyData = { corporateName, tradeName, cnpj };

        const { email, password } = req.body;
        const userRootData = { email, password };
        //Salvando nova empresa
        try {
            // Cadastrando a empresa 
            const result = await Company.create(companyData);
            const { ...newCompany } = result.toObject();
           
            // Preparando dados do user root
            userRootData.permission = 1;
            userRootData.name = newCompany.tradeName;
            const companyUser = {
                id: newCompany._id,
                name: newCompany.corporateName
            }
            userRootData.company = companyUser;
            // Cadastrando user root

            const userRoot = await User.create(userRootData);
            const { password, ...user} = userRoot.toObject()
            const token = jwt.sign({ user: user._id });
            const response = {
                token,
                user
            };
            
            return res.status(201).send(response).json();

        } catch (error) {
            return res.status(400).send(error).json({
                error: true,
                message: "Erro ao cadastrar a empresa"
            })
        }

        
    }

    // Atualizar empresa 
    async update(req, res) {
        const root = req.body.root ? req.body.root : false;
        const data = req.body.data;
        const companyId = req.body.companyId

        if(root){
            try {
                await Company.updateOne({_id: companyId }, data);
                const company = await Company.findById(companyId);
                return res.status(200).send(company)
            } catch (error) {
                return res.status(400).json({
                    error,
                    message: "Erro ao atualizar"
                })
            }
        }
        return res.status(401).json({
            error: true,
            message: "Não autorizado"
        })
    }
}

module.exports = new CompanyController();