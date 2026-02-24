import { em, entity, text, boolean } from "bknd";
import type { NextjsBkndConfig } from "bknd/adapter/nextjs";
import { secureRandomString } from "bknd/utils";

export default {
    options: {
        mode: "code",
    },
    config: {
        auth: {
            enabled: true,
            jwt: { secret: process.env.JWT_SECRET || secureRandomString(64) },
            default_role_register: "public",
            roles: {
                admin: {
                    implicit_allow: true,
                },
                public: {
                    permissions: [
                        "data.entity.read",
                        "data.entity.create",
                        "data.entity.update",
                        "data.entity.delete",
                    ],
                }
            },
            guard: { enabled: true }
        },
        data: em({
            todos: entity("todos", {
                title: text(),
                completed: boolean()
            })
        })
    },
    connection: { url: "data.db" },
} satisfies NextjsBkndConfig;
