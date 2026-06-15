const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const JWT_SECRET = 'super-secret-key'

async function authRoutes(fastify) {
  fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body

    console.log(email, password)

    const passwordHash = await bcrypt.hash(password, 10)

    await pool.query(
      `
      INSERT INTO users
      (email, password_hash)
      VALUES ($1, $2)
      `,
      [email, passwordHash]
    )

    return { success: true }
  })

  fastify.get(
  '/me',
  {
    preHandler: verifyToken
  },
  async (request) => {
    return {
      userId: request.user.userId
    }
  }
)

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    const user = result.rows[0]

    if (!user) {
      return reply.code(401).send({
        message: 'Invalid credentials'
      })
    }

    const valid = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!valid) {
      return reply.code(401).send({
        message: 'Invalid credentials'
      })
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return { token }
  })
}

module.exports = authRoutes