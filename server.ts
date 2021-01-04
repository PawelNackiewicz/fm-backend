import Hapi from '@hapi/hapi';
import { PlayerPlugin } from './plugins/player';

const getServer = () => {
    return new Hapi.Server({
        port: 3000,
        host: 'localhost'
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
