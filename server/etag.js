const crypto = require("crypto");

const REFRESH_SECONDS = 120

let etagValue = null

let etagCalled = new Date()
let value = etagCalled.getMinutes()

const etagAPIObject = {
  type: 'object',
  required: ['value'],
  properties: {
    value: { type: 'integer' }
  }
}

const hash = (payload) => '"' +
  crypto.createHash('sha256').update(payload)
    .digest().toString('hex').substring(0, 8) +
  '"'

// basic rudimentary incomplete cache control hook
function etagPreHook (req, reply, done) {
  let newPayload

  let ifNoneMatch = req.headers['if-none-match']
  let ifMatch = req.headers['if-match']

  if (etagValue != null && ifNoneMatch && ifNoneMatch === etagValue) {
    reply.code(304)
    newPayload = ''
  }

  if ((req.method == 'PUT' || req.method == 'POST') && !ifMatch) {
    reply.code(412)
    newPayload = ''
    reply.send(newPayload)
    return
  }

  if (etagValue != null && ifMatch && ifMatch !== etagValue) {
    reply.code(412)
    newPayload = ''
    reply.send(newPayload)
    return
  }

  done(null, newPayload)
}

function etagOnSendHook (req, reply, payload, done) {
  let etag = reply.getHeader('etag')
  let newPayload

  // we do not generate with an already existing etag
  if (!etag) {
    // we do not generate etags for anything but strings and buffers
    if (!(typeof payload === 'string' || payload instanceof Buffer)) {
      done(null, newPayload)
      return
    }

    if (reply.statusCode < 400) {
      etag = hash(payload)
      etagValue = etag
      reply.header('etag', etag)
    }
  }

  let ifNoneMatch = req.headers['if-none-match']

  if (etag && ifNoneMatch && ifNoneMatch === etag) {
    reply.code(304)
    newPayload = ''
  }

  done(null, newPayload)
}

module.exports = function (app, opts, done) {

  app.addHook('preHandler', etagPreHook)

  app.addHook('onSend', etagOnSendHook)

  app.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        '2xx': etagAPIObject
      }
    },
    handler: function (request, reply) {
      let now = new Date()
      const millis = now.getTime() - etagCalled.getTime();
      let elapsed = Math.floor(millis / 1000)
      if (elapsed > REFRESH_SECONDS) {
        etagCalled = now
        value = now.getMinutes()
      }

      return { value }
    }
  })

  app.route({
    method: 'POST',
    url: '/',
    schema: {
      body: etagAPIObject,
      response: {
        '2xx': etagAPIObject
      }
    },
    handler: function (request, reply) {
      value = request.body.value
      return { value }
    }
  })

  app.route({
    method: 'PUT',
    url: '/',
    schema: {
      body: etagAPIObject,
      response: {
        '2xx': etagAPIObject
      }
    },
    handler: function (request, reply) {
      value = request.body.value
      return { value }
    }
  })

  done()
}