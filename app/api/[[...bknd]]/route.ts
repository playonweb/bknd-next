import { config } from "@/lib/bknd";
import { serve } from "bknd/adapter/nextjs";
import type { App } from "bknd";

// optionally, you can set the runtime to edge for better performance
// export const runtime = "edge";

const handler = serve({
    ...config,
    options: {
        ...config.options,
        plugins: [
            (app: App) => ({
                name: "setup-admin",
                onBoot: async () => {
                    // Hot reload triggered 
                    console.log('[Init] Running setup-admin plugin onBoot...');
                    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
                    const adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';

                    try {
                        if (typeof app.createUser === 'function') {
                            console.log(`[Init] Attempting to create admin user ${adminEmail}...`);
                            await app.createUser({
                                email: adminEmail,
                                password: adminPassword,
                                role: 'admin',
                                verified: true
                            });
                            console.log(`[Init] Admin user ${adminEmail} created successfully.`);
                        } else {
                            console.warn('[Init] app.createUser is not a function');
                        }
                    } catch (err: any) {
                        // creation fails if user already exists
                    }
                }
            })
        ]
    },
    cleanRequest: {
        // depending on what name you used for the catch-all route,
        // you need to change this to clean it from the request.
        searchParams: ["bknd"],
    },
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
