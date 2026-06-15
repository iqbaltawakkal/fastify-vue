const jwt = require('jsonwebtoken')

function verifyToken(request, reply, done) {
  const authHeader =
    request.headers.authorization

  if (!authHeader) {
    return reply.code(401).send()
  }

  const token = authHeader.replace(
    'Bearer ',
    ''
  )

  try {
    request.user = jwt.verify(
      token,
      JWT_SECRET
    )

    done()
  } catch {
    return reply.code(401).send()
  }
}

module.exports = verifyToken