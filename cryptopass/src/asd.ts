import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { Hono } from 'hono'

const app = new Hono()

app.get('/hello',
(c) => {
  return c.json({
    message: `Hello!`,
  })
})

app.get(
  '/hello',
  zValidator(
    'query',
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid('query')
    return c.json({
      message: `Hello! ${name}`,
    })
  }
)