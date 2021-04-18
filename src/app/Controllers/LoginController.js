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
                return res.status(401)
            }
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(401)
            }

            const token = jwt.sign({ user: user.id });

            user.password = null;

            res.send({ user, token });
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = new Login()