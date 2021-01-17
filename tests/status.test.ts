import { createServer } from '../server'
import * as Hapi from '@hapi/hapi'

describe('Status plugin', () => {
    let server: Hapi.Server
    beforeAll(async () => {
        server = await createServer()
    })
    afterAll(async () => {
        await server.stop()
    })
    test('status endpoint returns 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/players/test',
        })
        expect(res.statusCode).toEqual(200)
    })
})
