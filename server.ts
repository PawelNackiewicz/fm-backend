import * as Hapi from '@hapi/hapi';
import { PlayerPlugin } from './plugins/player';

const getServer = () => {
    return new Hapi.Server({
        host: 'localhost',
        port: 3000
    });
};

export const getServerWithPlugins = async () => {
    const server = getServer();

    await server.register(
        {
            plugin: PlayerPlugin,
            options: {
                message: 'PLAYER'
            },
        },
        {
            routes: {
                prefix: '/players',
            },
        },
    );


    server.events.on({ name: 'request', channels: 'error' }, (_request, event, _tags) => {
        // const baseUrl = `${server.info.protocol}://${request.info.host}`;
        console.error(event.error);
    });

    return server;
};

export async function createServer(): Promise<Hapi.Server> {
    const server = await getServerWithPlugins()
    await server.initialize()
    return server
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
    await server.start()
    console.log(`Server running on ${server.info.uri}`)
    return server
}
