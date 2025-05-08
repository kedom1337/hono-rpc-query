# hono-rpc-query

Tries to solve the problem of repeated boilerplate from integrating Hono's RPC client
with Tanstack React Query. It does so by automatically generating both
`queryOptions` and `mutationOptions` for all of your endpoints.

## Installation

Use your favourite package manager to install `hono-rpc-query`

```bash
pnpm add hono-rpc-query
```

## Usage

```typescript
import { hc } from "hono/client";
import { Hono } from "hono";
import { hcQuery } from 'hono-rpc-query';
import * as z from 'zod';

const posts = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
];

// 1. Create your hono application
const app = new Hono();
const routes = app
  .get("/posts", (c) => {
    return c.json([
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ]);
  });
  .get('/posts/:id', sValidator('param', z.object({ id: z.number() })), (c) => {
    const { id } = c.req.valid('param')
    const post = posts.find((p) => p.id === id);
    return post ? c.json(post) : c.notFound();
  })

// 2. Create a hono RPC client and wrap it with `hcQuery`
type AppRoutes = typeof routes;
const api = hcQuery(hc<AppRoutes>("http://localhost"));

// 3. Profit!
const posts = api.posts.$get.queryOptions({})
const post = api.posts[":id"].$get.queryOptions({
  input: {
    param: {
      id: 1
    }
  }
})
```

## Known limitations
- No support for `infiniteQueryOptions`

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
