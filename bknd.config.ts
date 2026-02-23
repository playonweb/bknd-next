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
            jwt: { secret: process.env.JWT_SECRET || secureRandomString(64) }
        },
        data: em({
            todos: entity("todos", {
                title: text(),
                completed: boolean()
            })
        })
    },
    connection: { url: "file:data.db" },
} satisfies NextjsBkndConfig;
