import t from 'tap'
import { CollectionFilterBuilder } from "../src/lib/CollectionFilterBuilder"
import { MockApiClient } from "./MockApiClient"

const testDollarFilter = (filter: string, value: any = 'value') => {
  t.test(`applies ${filter}`, async () => {
    const client = new MockApiClient()

    const builder = new CollectionFilterBuilder(
      client,
      '',
      {}
    )

    // @ts-ignore
    await builder[filter]('field', value)

    t.same(client.callStack[0][1], `?filter=${encodeURIComponent(JSON.stringify({ field: { [`$${filter}`]: value } }))}`)
  })
}

t.test('applies default filter', async () => {
  const client = new MockApiClient()
  const builder = new CollectionFilterBuilder(client, '', {})

  await builder

  t.same(client.callStack[0][1], `?filter=${encodeURIComponent('{}')}`)
})

;[ 'eq', 'gt', 'gte', 'lt', 'lte', 'ne', 'in', 'nin', 'regex' ].forEach(op => {
  testDollarFilter(op)
})

testDollarFilter('exists', true)

testDollarFilter('mod', [ 5, 2 ])

t.test('applies geo intersects filter', async () => {
  const client = new MockApiClient()
  const builder = new CollectionFilterBuilder(client, '', {})

  await builder.geoIntersects('location', { type: 'Geometry' })

  t.same(client.callStack[0][1], `?filter=${
    encodeURIComponent(JSON.stringify({
      location: { $geoIntersects: { $geometry: { type: 'Geometry' } } }
    }))
  }`)
})

t.test('applies skip', async () => {
  const client = new MockApiClient()
  const builder = new CollectionFilterBuilder(client, '', {})

  await builder.skip(100)

  t.same(client.callStack[0][1], `?filter=${encodeURIComponent('{}')}&skip=100`)
})

t.test('applies limit', async () => {
  const client = new MockApiClient()
  const builder = new CollectionFilterBuilder(client, '', {})

  await builder.limit(100)

  t.same(client.callStack[0][1], `?filter=${encodeURIComponent('{}')}&limit=100`)
})