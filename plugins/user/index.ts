import * as Hapi from '@hapi/hapi';
import * as Joi from 'joi'
import * as Boom from '@hapi/boom'

export const UserPlugin = {
    multiple: false,
    name: 'user',
    version: '1.0.0',
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'GET',
                path: '/users',
                handler: getUsersHandler,
                options: {
                    validate: {
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/users/{userId}',
                handler: getUserHandler,
                options: {
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err
                        },
                    },
                },
            },
            {
                method: 'POST',
                path: '/users',
                handler: createUserHandler,
                options: {
                    validate: {
                        payload: createUserValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err
                        },
                    },
                },
            },
            {
                method: 'DELETE',
                path: '/users/{userId}',
                handler: deleteUserHandler,
                options: {
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err
                        },
                    },
                },
            },
            {
                method: 'PUT',
                path: '/users/{userId}',
                handler: updateUserHandler,
                options: {
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                        payload: updateUserValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err
                        },
                    },
                },
            },
        ])
    }
};

const userInputValidator = Joi.object({
    email: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
    password: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
})

const createUserValidator = userInputValidator.tailor('create')
const updateUserValidator = userInputValidator.tailor('update')

interface UserInput {
    email: string,
    password: string,
}

async function getUsersHandler(request, h) {
    const { prisma }  = request.server.app
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        })
        return h.response(users).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation('failed to get users')
    }
}

async function getUserHandler(request, h) {
    const { prisma } = request.server.app
    const userId = parseInt(request.params.userId, 10)

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        if (!user) {
            return h.response().code(404)
        } else {
            return h.response(user).code(200)
        }
    } catch (err) {
        console.log(err)
        return Boom.badImplementation('failed to get user')
    }
}

async function createUserHandler(request, h) {
    const { prisma } = request.server.app
    const {email, password} = request.payload as UserInput

    try {
        const createdUser = await prisma.user.create({
            data: {
                email,
                password,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        })
        return h.response(createdUser).code(201)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation('failed to create user')
    }
}

async function deleteUserHandler(request, h) {
    const { prisma } = request.server.app
    const userId = parseInt(request.params.userId, 10)

    try {
        await prisma.user.delete({
            where: {
                id: userId,
            },
        })
        return h.response().code(204)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation('failed to delete user')
    }
}

async function updateUserHandler(request, h) {
    const { prisma } = request.server.app
    const userId = parseInt(request.params.userId, 10)
    const payload = request.payload as Partial<UserInput>

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: payload,
            select: {
                id: true,
                email: true,
                role: true,
            },
        })
        return h.response(updatedUser).code(200)
    } catch (err) {
        console.log(err)
        return Boom.badImplementation('failed to update user')
    }
}
