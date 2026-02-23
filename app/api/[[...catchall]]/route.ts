import { serve } from 'bknd/adapter/nextjs';
import type { App } from 'bknd';
import { secureRandomString } from "bknd/utils";

const config: any = {
    // Runtime hook to create initial admin if missing
    options: {
        mode: process.env.NODE_ENV === "development" ? "db" : "code",
        plugins: [
            (app: App) => ({
                name: "setup-admin",
                onFirstBoot: async () => {
                    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
                    const adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';

                    try {
                        await app.createUser({
                            email: adminEmail,
                            password: adminPassword,
                            role: 'admin',
                            verified: true
                        });
                        console.log(`[Init] Admin user ${adminEmail} created successfully.`);
                    } catch (err: any) {
                        // Usually fails if user already exists
                        if (err.message && (err.message.includes('exists') || err.message.includes('unique'))) {
                            console.log(`[Init] Admin user ${adminEmail} already exists.`);
                        } else {
                            console.warn('[Init] Admin creation ignored/failed:', err.message);
                        }
                    }
                }
            })
        ]
    }
};

const handler = serve(config);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
