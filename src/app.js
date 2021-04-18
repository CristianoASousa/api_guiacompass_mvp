const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const companies = require('./routes/companies');
const products = require('./routes/products');
const login = require('./routes/login');
const morgan = require('morgan');
require('./config/connection');

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(morgan('dev'));
        this.app.use((req, res, next) => {
            res.header("Access-Controll-Allow-Origin", "*");
            res.header("Access-Controll-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Controll-Allow-Headers", "Access, Content-type, Authorization, Acept, Origin, X-Requested-With");

            this.app.use(cors());
            
            next();
        })
    }

    routes() {
        this.app.use('/users', users);
        this.app.use('/companies', companies);
        this.app.use('/products', products);
        this.app.use('/login', login);
    }
}

module.exports = new App().app