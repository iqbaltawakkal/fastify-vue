// db.js

const { Pool } = require('pg')

module.exports = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'fullstack',
  user: 'postgres',
  password: 'admin'
})