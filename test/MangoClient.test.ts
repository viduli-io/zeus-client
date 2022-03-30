import t from "tap"
import { CollectionQueryBuilder } from "../src/lib/CollectionQueryBuilder"
import MangoClient from "../src/MangoClient"

t.test('MangoClient', async () => {

  t.test('it instantiates', async () => {
    const client = new MangoClient('https://xxxxx.mango.io/')

    t.ok(client)
  })

  t.test('`collection()` creates a query builder', async () => {
    const client = new MangoClient()
    const builder = client.collection('collection')

    t.ok(builder instanceof CollectionQueryBuilder)
  })

  t.test('sets token', async () => {
    const client = new MangoClient()
    client.setAuth('collection')

    t.pass()
  })
})
