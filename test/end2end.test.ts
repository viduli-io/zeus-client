import t from 'tap'
import MangoClient from "../src/MangoClient"

interface TestBlogType {
  _id: string
  title: string
  body: string
}

const test_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.zbgd5BNF1cqQ_prCEqIvBTjSxMS8bDLnJAE_wE-0Cxg'

t.test('MangoClient', async () => {
  const client = new MangoClient()
  client.setAuth(test_token)

  t.test('find by id', async () => {

    t.test('successfully fetches existing doc', async () => {
      const { data, error } = await client.collection<TestBlogType>('blogs')
        .findById('6242f8505b1de3456a0b4b26')

      t.ok(data)
      t.notOk(error)
      t.equal(data._id, '6242f8505b1de3456a0b4b26')
    })

    t.test('returns null for non-existing doc', async () => {
      const { data, error } = await client.collection<TestBlogType>('blogs')
        .findById('6242f8505b1de3456a0b4b27')

      t.equal(data, null)
    })
  })

  t.test('create', async () => {
    t.test('successfully creates a doc', async () => {
      const { data, error } = await client.collection<TestBlogType>('blogs')
        .create({
          title: 'How to write code',
          body: 'Use your keyboard'
        })

      t.ok(data)
      t.notOk(error)
    })
  })

  t.test('delete', async () => {
    t.skip('successfully deletes a doc', async () => {
      const res = await client.collection<TestBlogType>('blogs')
        .create({
          title: 'This will be deleted',
          body: 'soon'
        })

      const { error } = await client.collection<TestBlogType>('blogs')
        .delete(res.data._id)

      t.notOk(error)
    })
  })

  t.test('update', async () => {
    t.test('successfully updates a doc', async () => {
      const { meta } = await client.collection<TestBlogType>('blogs')
        .update({
          _id: '6242f8505b1de3456a0b4b26',
          title: 'Updated title ' + Math.random(),
          body: 'nonce'
        })

      t.equal(meta.matchedCount, 1)
      t.equal(meta.modifiedCount, 1)
    })
  })

  t.test('upsert', async () => {
    t.test('successfully inserts a new doc', async () => {
      const { data, error } = await client.collection<TestBlogType>('blogs')
        .upsert({
          _id: '6241aaaabaca358758365a99',
          title: 'Upsert inserts this doc',
          body: 'Use your keyboard'
        })

      t.equal(data.title, 'Upsert inserts this doc')
      t.notOk(error)
    })

    t.test('successfully updates the doc', async () => {
      const { data, error } = await client.collection<TestBlogType>('blogs')
        .upsert({
          _id: '6241aaaabaca358758365a99',
          title: 'Upsert modifies this doc',
          body: 'Use your keyboard'
        })

      t.equal(data.title, 'Upsert modifies this doc')
      t.notOk(error)
    })
  })

  t.test('many ops', async () => {
    let data: TestBlogType[]
    t.test('successfully creates many docs', async () => {
      const dummyData = Array.from({ length: 5 }).map(() => ({
        title: 'dummy title',
        body: 'nonce'
      }))

      const res = await client.collection<TestBlogType>('blogs')
        .createMany(dummyData)
      data = res.data

      t.ok(Array.isArray(data))
      t.equal(data.length, 5)
    })

    t.test('successfully updates many docs', async () => {
      const updates = data.map(d => ({ _id: d._id, title: 'updated title' }))

      const { meta } = await client.collection<TestBlogType>('blogs')
        .updateMany(updates)

      t.equal(meta.matchedCount, 5)
      t.equal(meta.modifiedCount, 5)
    })

    t.test('successfully deletes many docs', async () => {
      const {} = await client.collection<TestBlogType>('blogs')
        .deleteMany(data.map(d => d._id))

      t.ok('test')
    })
  })
})
