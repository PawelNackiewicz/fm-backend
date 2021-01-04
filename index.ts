import { getServerWithPlugins } from './server';

const start = async () => {
    //TODO config prisma and DB
    const server = await getServerWithPlugins();
    await server.start();
    console.info('Server running at:', server.info.uri);
};

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
