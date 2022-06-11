import t from "tap"
import { CollectionRootQueryBuilder } from "../src/lib/CollectionRootQueryBuilder"
import ViduliClient from "../src/ViduliClient"

t.test('ViduliClient', async () => {

  t.test('it instantiates', async () => {
    const client = new ViduliClient('https://xxxxx.mango.io/')

    t.ok(client)
  })

  t.test('`collection()` creates a query builder', async () => {
    const client = new ViduliClient()
    const builder = client.collection('collection')

    t.ok(builder instanceof CollectionRootQueryBuilder)
  })

  t.test('sets token', async () => {
    const client = new ViduliClient()
    client.setAuth('collection')

    t.pass()
  })
})
