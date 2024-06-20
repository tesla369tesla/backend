const Pool = require("pg").Pool;
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    port: 5432,
    database: 'master', // default database to connect to initially
})

client.connect((err) => {
    if (err) {
        console.log('connect error', err.stack)
    } else {
        console.log('connected')
    }
})
module.exports = client;
