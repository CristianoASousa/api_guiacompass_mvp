const app = require('./src/app');

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('ola mundo 2')
})