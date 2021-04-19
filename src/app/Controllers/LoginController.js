const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const jwt = require('../../config/jwt')

class Login {
    async login(req, res) {

        const [, hash] = req.headers.authorization.split(' ')
        const [email, password] = Buffer.from(hash, 'base64')
            .toString()
            .split(':')

        try {
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(401).send({error: true, message: "user not found"})
            }
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(401).send({error: true, message: "invalid password"})
            }

            const token = jwt.sign({ user: user.id });

            user.password = null;

            return res.send({ user, token });
        } catch (error) {
            return res.send(error)
        }
    }
}

module.exports = new Login()