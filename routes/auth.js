const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')
const verifyToken = require('../middleware/verifyToken')

const JWT_SECRET = 'super-secret-key'

async function authRoutes(fastify) {
  fastify.post('/register', async (request, _reply) => {
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
    const { userId } = request.user

    const result = await pool.query(
      'SELECT id, name, email, address, gender FROM users WHERE id = $1',
      [userId],
    )

    const user = result.rows[0]

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      gender: user.gender,
    }
  }
)

  fastify.put(
    '/me',
    { preHandler: verifyToken },
    async (request) => {
      const { userId } = request.user
      const { name, email, address, gender } = request.body

      const result = await pool.query(
        `UPDATE users
         SET name = $1, email = $2, address = $3, gender = $4
         WHERE id = $5
         RETURNING id, name, email, address, gender`,
        [name, email, address, gender, userId],
      )

      const user = result.rows[0]

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        gender: user.gender,
      }
    },
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