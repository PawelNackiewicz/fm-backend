import { createServer } from '../server'
import * as Hapi from '@hapi/hapi'

describe('users endpoints', () => {
    let server: Hapi.Server

    beforeAll(async () => {
        server = await createServer()
    })

    afterAll(async () => {
        await server.stop()
    })

    let userId: number

    test('create user', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                email: `test-${Date.now()}@prisma.io`,
                password: `testPassword-${Date.now()}`,
            },
        })

        expect(response.statusCode).toEqual(201)

        userId = JSON.parse(response.payload)?.id
        expect(typeof userId === 'number').toBeTruthy()
    })

    test('create user validation', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                email: 'test-email',
            },
        })

        expect(response.statusCode).toEqual(400)
    })

    test('get user returns 404 for non existant user', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/users/9999',
        })

        expect(response.statusCode).toEqual(404)
    })

    test('get users returns array of users', async () => {
        const response = await server.inject({
            method: 'GET',
            url: `/users`,
        })
        expect(response.statusCode).toEqual(200)
        const users = JSON.parse(response.payload)

        expect(Array.isArray(users)).toBeTruthy()
        expect(users[0]?.id).toBeTruthy()
    })

    test('get user returns user', async () => {
        const response = await server.inject({
            method: 'GET',
            url: `/users/${userId}`,
        })
        expect(response.statusCode).toEqual(200)
        const user = JSON.parse(response.payload)

        expect(user.id).toBe(userId)
    })

    test('get user fails with invalid id', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/users/a123',
        })
        expect(response.statusCode).toEqual(400)
    })

    test('update user fails with invalid userId parameter', async () => {
        const response = await server.inject({
            method: 'PUT',
            url: `/users/aa22`,
        })
        expect(response.statusCode).toEqual(400)
    })

    test('update user', async () => {
        const updatedEmail = 'test-email-UPDATED'
        const updatedPassword = 'test-password-UPDATED'

        const response = await server.inject({
            method: 'PUT',
            url: `/users/${userId}`,
            payload: {
                email: updatedEmail,
                password: updatedPassword,
            },
        })
        expect(response.statusCode).toEqual(200)
        const user = JSON.parse(response.payload)
        expect(user.email).toEqual(updatedEmail)
        expect(user.id).toEqual(userId)
    })

    test('delete user fails with invalid userId parameter', async () => {
        const response = await server.inject({
            method: 'DELETE',
            url: `/users/aa22`,
        })
        expect(response.statusCode).toEqual(400)
    })

    test('delete user', async () => {
        const response = await server.inject({
            method: 'DELETE',
            url: `/users/${userId}`,
        })
        expect(response.statusCode).toEqual(204)
    })
})
