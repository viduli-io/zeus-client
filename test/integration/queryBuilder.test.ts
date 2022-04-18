import t from "tap"
import type { default as ViduliClientType } from "../../src/ViduliClient"

const callStack = {
  calls: [] as [ string, RequestInit ][]
}

const { default: ViduliClient } = t.mock('../../src/ViduliClient', {
  'isomorphic-unfetch': (url: string, config: RequestInit) => {
    callStack.calls.push([ url, config ])
    return Promise.resolve({
      json: () => Promise.resolve({})
    })
  }
})

t.test('query builder', async t => {

  t.test('`find()`: all fluent operators', async t => {
    const client: ViduliClientType = new ViduliClient()

    const result = await client.collection('blogs')
      .lt('age', 10)
      .gte('age', 5)
      .eq('title', 'Wonderful Title')
      .find()

    console.log(result)
  })

  t.test('`update()`: all fluent operators', async t => {
    const client: ViduliClientType = new ViduliClient()
    const result = await client.collection('blogs').eq('authorId', 'xxx').update({ })
  })
})

t.test('`auth.getUser()`', async t => {
  const client: ViduliClientType = new ViduliClient()

  const [ err, data ] = await client.auth.getUser()
})
