import { serve } from 'bknd/adapter/nextjs';

const handler = serve({
    config: {
        media: {
            enabled: false
        }
    },
    connection: { url: 'file:data.db' }
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
