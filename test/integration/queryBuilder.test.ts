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

t.test('query builder', async () => {

  t.test('`find()`: all fluent operators', async () => {
    const client: ViduliClientType = new ViduliClient()

    const result = await client.collection('blogs')
      .find()
      .lt('age', 10)
      .gte('age', 5)
      .eq('title', 'Wonderful Title')

    console.log(result)
  })
})
