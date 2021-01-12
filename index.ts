import { getServerWithPlugins } from './server';
import type { PrismaClient } from '@prisma/client';
import * as Dotenv from 'dotenv';
import {initDb, prisma} from "./db";

Dotenv.config();

declare module '@hapi/hapi' {
    export interface ServerApplicationState {
        readonly db: PrismaClient;
    }
}

const start = async () => {
    console.log(await initDb());
    const server = await getServerWithPlugins();

    // @ts-expect-error
    server.app.db = prisma;

    await server.start();
    console.info('Server running at:', server.info.uri);
};

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
