const jwt = require('./jwt');
const User = require('../app/Models/User');

module.exports = async function auth(req, res, next) {
  const authorization = req.headers.authorization ? true : false;
  
  if (req.originalUrl == '/companies/create') {
    next()
  } else {

    if (authorization) {
      const [, token] = req.headers.authorization.split(' ')

      try {
        const payload = await jwt.verify(token)
        const user = await User.findById(payload.user)

        if (!user) {
          return res.status(401).json({
            error: "acesso não autorizado"
          })
        }

        next()
      } catch (error) {
        res.status(401).json({
          error: "acesso não autorizado"
        })
      }

    } else {
      res.status(401).json({
        error: "acesso não autorizado"
      })
    }
  }
}