import t from 'tap'
import type { CollectionRootQueryBuilder as CollectionQueryBuilderType } from '../../src/lib/collections/CollectionRootQueryBuilder'
import { MockApiClient } from '../MockApiClient'

const callStack = {
  calls: [] as any[][],
}

const { CollectionQueryBuilder } = t.mock('../src/lib/CollectionQueryBuilder', {
  '../src/lib/CollectionFilterBuilder': {
    CollectionFilterBuilder: class X {
      constructor(...args: any[]) {
        callStack.calls.push(args)
      }
    },
  },
})

t.test('CollectionQueryBuilder', async () => {
  let builder: CollectionQueryBuilderType<any>, client: MockApiClient

  t.beforeEach(() => {
    client = new MockApiClient()
    builder = new CollectionQueryBuilder('collection', 'endpoint', client)
    callStack.calls = []
  })

  t.test('find', async () => {
    builder.find()

    const [_client, docEndpoint, filters] = callStack.calls[0]
    t.equal(_client, client)
    t.equal(docEndpoint, 'endpoint/collection/documents')
    t.same(filters, {})
  })

  t.test('find by id calls get', async () => {
    await builder.findById('id')

    const [method, url] = client.callStack[0]
    t.equal(method, 'get')
    t.equal(url, 'endpoint/collection/documents/id')
  })

  t.test('create calls post', async () => {
    await builder.create({ test: 'test' })

    const [method, url, data] = client.callStack[0]
    t.equal(method, 'post')
    t.equal(url, 'endpoint/collection/documents')
    t.same(data, { test: 'test' })
  })

  t.test('create many calls post', async () => {
    await builder.createMany([{ test: 'test' }])

    const [method, url, data] = client.callStack[0]
    t.equal(method, 'post')
    t.equal(url, 'endpoint/collection/documents')
    t.same(data, [{ test: 'test' }])
  })

  t.test('update calls patch', async () => {
    await builder.update({ _id: 'xxx', test: 'test' })

    const [method, url, data] = client.callStack[0]
    t.equal(method, 'patch')
    t.equal(url, 'endpoint/collection/documents/xxx')
    t.same(data, { test: 'test' })
  })

  t.test('update many calls patch', async () => {
    await builder.updateMany([{ _id: 'xxx', test: 'test' }])

    const [method, url, data] = client.callStack[0]
    t.equal(method, 'patch')
    t.equal(url, 'endpoint/collection/documents')
    t.same(data, [{ _id: 'xxx', test: 'test' }])
  })

  t.test('upsert calls put', async () => {
    await builder.upsert({ _id: 'xxx', test: 'test' })

    const [method, url, data] = client.callStack[0]
    t.equal(method, 'put')
    t.equal(url, 'endpoint/collection/documents/xxx')
    t.same(data, { _id: 'xxx', test: 'test' })
  })

  t.test('delete calls delete', async () => {
    await builder.delete('xxxx')

    const [method, url] = client.callStack[0]
    t.equal(method, 'delete')
    t.equal(url, 'endpoint/collection/documents/xxxx')
  })

  t.test('delete many calls delete', async () => {
    await builder.deleteMany(['xxxx'])

    const [method, url, data] = client.callStack[0]
    t.equal(method, 'delete')
    t.equal(url, 'endpoint/collection/documents')
    t.same(data, ['xxxx'])
  })
})
