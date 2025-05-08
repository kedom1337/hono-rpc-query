import type { QueryKey } from '@tanstack/react-query'

type KeyType = 'query' | 'mutation'

interface BuildKeyOptions<TType extends KeyType, TInput> {
  type: TType
  input?: TType extends 'mutation' ? never : TInput
}

export function buildKey<TType extends KeyType, TInput>(
  path: string[],
  opts: BuildKeyOptions<TType, TInput>
): QueryKey {
  return [
    path,
    { type: opts.type, ...(opts.input !== undefined && { input: opts.input }) },
  ] as const
}
