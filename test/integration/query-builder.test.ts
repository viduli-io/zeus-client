import t from 'tap'
import ViduliClient from '../../src/ViduliClient'

const nock = require('nock')

const scope = nock('http://localhost:4000')


t.test('query builder', async t => {

  t.skip('`find()`: all fluent operators', async t => {
    const client = new ViduliClient()

    const result = await client.collection('blogs')
      .lt('age', 10)
      .gte('age', 5)
      .eq('title', 'Wonderful Title')
      .find()

    console.log(result)
  })

  t.skip('`update()`: all fluent operators', async t => {
    const client = new ViduliClient()
    const result = await client
      .collection('blogs')
      .eq('authorId', 'xxx')
      .update({})
  })

  t.test('logical AND, OR', async t => {
    t.plan(2)

    scope
      .get('/collections/v1/people/documents')
      .query(true)
      .reply(async function (uri: string, body: any) {
        const filter = JSON.parse(
          new URLSearchParams(uri.split('?')[1]).get('filter') ?? '{}'
        )

        t.same(filter, {
          '$and': [
            {
              '$or': [
                {
                  '$or': [ { gender: { '$eq': 'male' }, age: { '$lte': 10 } } ]
                },
                { gender: { '$eq': 'female' }, age: { '$gt': 25 } }
              ]
            },
            { city: { '$eq': 'colombo' } }
          ]
        })

        return [ 200, { error: null, body: [ { x: 1 } ] } ]
      })

    const client = new ViduliClient()
    const result = await client
      .collection('people')
      .or(_ => _
        .eq('gender', 'male')
        .lte('age', 10)
      )
      .or(_ => _
        .eq('gender', 'female')
        .gt('age', 25)
      )
      .and(_ =>  _
        .eq('city', 'colombo')
      )
      .find()

    t.same(result, { error: null, body: [ { x: 1 } ] })
  })
})

t.skip('`auth.getUser()`', async t => {
  const client = new ViduliClient()

  const [ err, data ] = await client.auth.getUser()
})
