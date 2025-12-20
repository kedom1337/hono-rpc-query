import { hcQuery } from 'hono-rpc-query'
import { hc } from 'hono/client'
import type { AppRoutes } from '../../server/src/index'

// Create the Hono RPC client and wrap it with hcQuery
const client = hc<AppRoutes>('http://localhost:3001')
export const api = hcQuery(client)
