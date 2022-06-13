import t from 'tap'
import ViduliClient from '../src/ViduliClient'

interface TestBlog {
  id: string
  title: string
  body: string
}

const test_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.zbgd5BNF1cqQ_prCEqIvBTjSxMS8bDLnJAE_wE-0Cxg'

t.skip('ViduliClient', async () => {
  const client = new ViduliClient()
  client.setAuth(test_token)

  t.test('find by id', async () => {
    t.test('successfully fetches existing doc', async () => {
      const { data, error } = await client
        .collection<TestBlog>('blogs')
        .findById('6242f8505b1de3456a0b4b26')

      t.ok(data)
      t.notOk(error)
      t.equal(data.id, '6242f8505b1de3456a0b4b26')
    })

    t.test('returns null for non-existing doc', async () => {
      const { data, error } = await client
        .collection<TestBlog>('blogs')
        .findById('6242f8505b1de3456a0b4b27')

      t.equal(data, null)
    })
  })

  t.test('create', async () => {
    t.test('successfully creates a doc', async () => {
      const { data, error } = await client
        .collection<TestBlog>('blogs')
        .create({
          title: 'How to write code',
          body: 'Use your keyboard',
        })

      t.ok(data)
      t.notOk(error)
    })
  })

  t.test('delete', async () => {
    t.skip('successfully deletes a doc', async () => {
      const res = await client.collection<TestBlog>('blogs').create({
        title: 'This will be deleted',
        body: 'soon',
      })

      const { error } = await client
        .collection<TestBlog>('blogs')
        .delete(res.data.id)

      t.notOk(error)
    })
  })

  t.test('update', async () => {
    t.test('successfully updates a doc', async () => {
      const { data } = await client.collection<TestBlog>('blogs').update({
        _id: '6242f8505b1de3456a0b4b26',
        title: 'Updated title ' + Math.random(),
        body: 'nonce',
      })

      t.ok(data)
    })
  })

  t.test('upsert', async () => {
    t.test('successfully inserts a new doc', async () => {
      const { data, error } = await client
        .collection<TestBlog>('blogs')
        .upsert({
          id: '6241aaaabaca358758365a99',
          title: 'Upsert inserts this doc',
          body: 'Use your keyboard',
        })

      t.equal(data.title, 'Upsert inserts this doc')
      t.notOk(error)
    })

    t.test('successfully updates the doc', async () => {
      const { data, error } = await client
        .collection<TestBlog>('blogs')
        .upsert({
          id: '6241aaaabaca358758365a99',
          title: 'Upsert modifies this doc',
          body: 'Use your keyboard',
        })

      t.equal(data.title, 'Upsert modifies this doc')
      t.notOk(error)
    })
  })

  t.test('many ops', async () => {
    let blogs: TestBlog[]

    t.test('successfully creates many docs', async () => {
      const dummyData = Array.from({ length: 5 }).map(() => ({
        title: 'dummy title',
        body: 'nonce',
      }))

      const res = await client
        .collection<TestBlog>('blogs')
        .createMany(dummyData)
      blogs = res.data

      t.ok(Array.isArray(blogs))
      t.equal(blogs.length, 5)
    })

    t.test('successfully updates many docs', async () => {
      const updates = blogs.map(d => ({ _id: d.id, title: 'updated title' }))

      const { data } = await client
        .collection<TestBlog>('blogs')
        .updateMany(updates)

      t.ok(data)
    })

    t.test('successfully deletes many docs', async () => {
      const {} = await client
        .collection<TestBlog>('blogs')
        .deleteMany(blogs.map(d => d.id))

      t.ok('test')
    })
  })

  t.skip('find', async () => {
    const res = await client
      .collection<TestBlog>('blogs')
      .find({ title: { $eq: 'what now 4' } })

    console.log(res)
  })
})

t.test('dev', async () => {
  const client = new ViduliClient('http://localhost:3010')
  const res = await client
    .collection<TestBlog>('blogs')
    .find({ title: { $eq: 'what now 4' } })

  console.log(res)
})
