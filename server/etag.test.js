import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import fastify from 'fastify'
import crypto from 'crypto'
import etagPlugin from './etag.js'

// Create a test instance of the fastify app
const app = fastify({ logger: false })

// Register the etag plugin
app.register(etagPlugin, { prefix: '/etag' })

// Create a request instance
const request = supertest(app.server)

// Helper to get a hash similar to the one in etag.js
const generateEtag = (payload) => '"' + 
  crypto.createHash('sha256').update(payload)
    .digest().toString('hex').substring(0, 8) + 
  '"'

describe('Etag Plugin', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /etag', () => {
    it('should return a value and an etag header', async () => {
      const response = await request.get('/etag')
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('value')
      expect(response.headers).toHaveProperty('etag')
      expect(typeof response.body.value).toBe('number')
    })

    it('should return 304 Not Modified when If-None-Match matches the etag', async () => {
      // First request to get the etag
      const firstResponse = await request.get('/etag')
      const etag = firstResponse.headers.etag
      
      // Second request with If-None-Match
      const secondResponse = await request
        .get('/etag')
        .set('If-None-Match', etag)
      
      expect(secondResponse.status).toBe(304)
      expect(secondResponse.body).toEqual({})
    })
  })

  describe('POST /etag', () => {
    it('should return 412 Precondition Failed when If-Match header is missing', async () => {
      const response = await request
        .post('/etag')
        .send({ value: 42 })
      
      expect(response.status).toBe(412)
    })

    it('should update the value when If-Match header matches', async () => {
      // First request to get the etag
      const firstResponse = await request.get('/etag')
      const etag = firstResponse.headers.etag
      
      // POST request with If-Match
      const postResponse = await request
        .post('/etag')
        .set('If-Match', etag)
        .send({ value: 99 })
      
      expect(postResponse.status).toBe(200)
      expect(postResponse.body).toEqual({ value: 99 })
      
      // Verify the value was updated
      const getResponse = await request.get('/etag')
      expect(getResponse.body).toEqual({ value: 99 })
    })
  })

  describe('PUT /etag', () => {
    it('should return 412 Precondition Failed when If-Match header is missing', async () => {
      const response = await request
        .put('/etag')
        .send({ value: 42 })
      
      expect(response.status).toBe(412)
    })

    it('should update the value when If-Match header matches', async () => {
      // First request to get the etag
      const firstResponse = await request.get('/etag')
      const etag = firstResponse.headers.etag
      
      // PUT request with If-Match
      const putResponse = await request
        .put('/etag')
        .set('If-Match', etag)
        .send({ value: 77 })
      
      expect(putResponse.status).toBe(200)
      expect(putResponse.body).toEqual({ value: 77 })
      
      // Verify the value was updated
      const getResponse = await request.get('/etag')
      expect(getResponse.body).toEqual({ value: 77 })
    })
  })
})