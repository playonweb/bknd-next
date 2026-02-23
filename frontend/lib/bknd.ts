import { Api } from 'bknd/client';

export const bknd = new Api({
    host: process.env.NEXT_PUBLIC_BKND_API_URL || 'http://localhost:3000',
});
