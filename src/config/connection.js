require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGO_URL
class Connection {
    constructor() {
        this.dataBaseConnectionMongoDB();

    }

    dataBaseConnectionMongoDB() {
        this.mogoDBConnection = mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          })
          .then(() => {
            console.log("Conexão estabelecida com o mongoDB")
          })
          .catch((error) => {
            console.log(`Erro ao estabelecer conexão com o mongoDB: ${error}`)
          })
    }
}

module.exports = new Connection();