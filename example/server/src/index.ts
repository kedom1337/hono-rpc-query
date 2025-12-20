import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'

const posts = [
  { id: 1, title: 'Hello World', content: 'This is my first post!' },
  { id: 2, title: 'Learning Hono', content: 'Hono is a fast web framework.' },
  { id: 3, title: 'React Query', content: 'Data fetching made easy.' },
]

let nextId = 4

const app = new Hono()

app.use('/*', cors())

const routes = app
  .get('/posts', (c) => {
    return c.json(posts)
  })
  .get('/posts/:id', zValidator('param', z.object({ id: z.string() })), (c) => {
    const { id } = c.req.valid('param')
    const post = posts.find((p) => p.id === parseInt(id))
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }
    return c.json(post)
  })
  .post(
    '/posts',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    ),
    (c) => {
      const { title, content } = c.req.valid('json')
      const newPost = { id: nextId++, title, content }
      posts.push(newPost)
      return c.json(newPost, 201)
    }
  )
  .delete(
    '/posts/:id',
    zValidator('param', z.object({ id: z.string() })),
    (c) => {
      const { id } = c.req.valid('param')
      const index = posts.findIndex((p) => p.id === parseInt(id))
      if (index === -1) {
        return c.json({ error: 'Post not found' }, 404)
      }
      const deleted = posts.splice(index, 1)[0]
      return c.json(deleted)
    }
  )

// Export the type for the client
export type AppRoutes = typeof routes

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
