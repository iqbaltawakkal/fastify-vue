const verifyToken = require('../middleware/verifyToken')
const pool = require('../db')

async function peoplesRoutes(fastify) {
  fastify.get('/peoples', { preHandler: verifyToken }, async (_request) => {
    const result = await pool.query(
      'SELECT id, name, email, address, gender, status FROM peoples ORDER BY id ASC',
    )
    return result.rows
  })

  fastify.post('/peoples', { preHandler: verifyToken }, async (request, reply) => {
    const { name, email, address, gender, status } = request.body

    const result = await pool.query(
      `INSERT INTO peoples (name, email, address, gender, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, gender, status`,
      [name, email, address, gender, status],
    )

    return reply.code(201).send(result.rows[0])
  })

  fastify.put('/peoples/:id', { preHandler: verifyToken }, async (request, reply) => {
    const { id } = request.params
    const { name, email, address, gender, status } = request.body

    const result = await pool.query(
      `UPDATE peoples
       SET name = $1, email = $2, address = $3, gender = $4, status = $5
       WHERE id = $6
       RETURNING id, name, email, address, gender, status`,
      [name, email, address, gender, status, id],
    )

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: 'Person not found' })
    }

    return result.rows[0]
  })

  fastify.delete('/peoples/:id', { preHandler: verifyToken }, async (request, reply) => {
    const { id } = request.params

    const result = await pool.query('DELETE FROM peoples WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: 'Person not found' })
    }

    return reply.code(204).send()
  })
}

module.exports = peoplesRoutes
