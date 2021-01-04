import type * as Hapi from '@hapi/hapi';

type PlayerPluginOptions = {
    readonly message: string;
};

export const PlayerPlugin: Hapi.Plugin<PlayerPluginOptions> = {
    multiple: false,
    name: 'player',
    version: '1.0.0',
    async register (server, options) {

        server.route({
            method: 'GET',
            path: '/test',
            handler: function (request, h) {

                return `hello, ${options.message}`;
            }
        });
    }
};
