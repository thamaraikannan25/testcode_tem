import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import fastify from 'fastify'
import etagPlugin from './etag.js'

// Import the routes directly to test
const app = fastify({ logger: false })

// Register the routes and plugins from our application
app.register(etagPlugin, { prefix: '/etag' })

// Add the greeting route
app.route({
  method: 'GET',
  url: '/greet',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        greeting: { type: 'string' },
        name: { type: 'string' },
        excited: { type: 'boolean' }
      },
      required: ['name']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: function (request, reply) {
    const greeting = request.query.greeting ? request.query.greeting : 'Hello'
    const name = request.query.name
    let message = greeting + ' ' + name + '!'
    if (request.query.excited) {
      message = message.toUpperCase() + '!!'
    }

    reply.send({ message })
  }
})

// Create a request instance
const request = supertest(app.server)

describe('Server API', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /greet', () => {
    it('should return a greeting with the required name parameter', async () => {
      const response = await request.get('/greet?name=John')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Hello John!' })
    })

    it('should use a custom greeting if provided', async () => {
      const response = await request.get('/greet?name=John&greeting=Hi')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Hi John!' })
    })

    it('should make the greeting excited if excited=true', async () => {
      const response = await request.get('/greet?name=John&excited=true')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'HELLO JOHN!!!' })
    })

    it('should return 400 if name is not provided', async () => {
      const response = await request.get('/greet')
      
      expect(response.status).toBe(400)
    })
  })
})