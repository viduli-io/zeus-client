import t from 'tap'
import type { ApiClient as ApiClientType } from '../../src/lib/ApiClient'

const callStack = {
  calls: [] as [string, RequestInit][],
}

const { ApiClient } = t.mock('../src/lib/ApiClient', {
  'isomorphic-unfetch': (url: string, config: RequestInit) => {
    callStack.calls.push([url, config])
    return Promise.resolve({
      json: () => Promise.resolve({}),
    })
  },
})

t.test('ApiClient', async () => {
  let client: ApiClientType

  t.beforeEach(() => {
    client = new ApiClient()
  })

  t.afterEach(() => {
    callStack.calls = []
  })

  t.test('request sets Authorization header', async () => {
    client = new ApiClient('xxx')
    await client.request('url')

    const [url, info] = callStack.calls[0]
    t.equal(url, 'url')
    t.equal(
      (info.headers as Record<string, string>)!['Authorization'],
      'Bearer xxx'
    )
  })

  t.test('get calls fetch with url and method: GET', async () => {
    await client.get('url')

    const [url, info] = callStack.calls[0]
    t.equal(url, 'url')
    t.equal(info.method, 'GET')
  })

  t.test('post calls fetch with url and method: POST and data', async () => {
    await client.post('url', { test: 'test' })

    const [url, info] = callStack.calls[0]
    t.equal(url, 'url')
    t.equal(info.method, 'POST')
    t.equal(info.body, JSON.stringify({ test: 'test' }))
  })

  t.test('patch calls fetch with url and method: PATCH and data', async () => {
    await client.patch('url', { test: 'test' })

    const [url, info] = callStack.calls[0]
    t.equal(url, 'url')
    t.equal(info.method, 'PATCH')
    t.equal(info.body, JSON.stringify({ test: 'test' }))
  })

  t.test('put calls fetch with url and method: PUT and data', async () => {
    await client.put('url', { test: 'test' })

    const [url, info] = callStack.calls[0]
    t.equal(url, 'url')
    t.equal(info.method, 'PUT')
    t.equal(info.body, JSON.stringify({ test: 'test' }))
  })

  t.test(
    'delete calls fetch with url and method: DELETE and data',
    async () => {
      await client.delete('url', { test: 'test' })

      const [url, info] = callStack.calls[0]
      t.equal(url, 'url')
      t.equal(info.method, 'DELETE')
      t.equal(info.body, JSON.stringify({ test: 'test' }))
    }
  )
})
