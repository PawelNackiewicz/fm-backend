import type Hapi from '@hapi/hapi';

type PlayerPluginOptions = {
    readonly message: string;
};

export const PlayerPlugin: Hapi.Plugin<PlayerPluginOptions> = {
    multiple: false,
    name: 'player',
    version: '1.0.0',
    async register (server, options) {

        // Create a route for example

        server.route({
            method: 'GET',
            path: '/test',
            handler: function (request, h) {

                return `hello, ${options.message}`;
            }
        });

        // etc ...
        await someAsyncMethods();
    }
};
