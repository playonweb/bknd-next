import { em, entity, text, boolean, systemEntity } from "bknd";
import type { NextjsBkndConfig } from "bknd/adapter/nextjs";
import { secureRandomString } from "bknd/utils";

const schema = em({
    todos: entity("todos", {
        title: text().required(),
        completed: boolean().required()
    }),
    users: systemEntity("users", {})
}, ({ relation }, { todos, users }) => {
    relation(todos).manyToOne(users);
});

type Database = (typeof schema)["DB"];
declare module "bknd" {
    interface DB extends Database { }
}

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
                        { permission: "system.access.api" },
                        {
                            permission: "data.entity.read",
                            policies: [
                                { effect: "filter", filter: { users: { $eq: "{{user.id}}" } } }
                            ]
                        },
                        {
                            permission: "data.entity.create",
                            policies: [
                                { effect: "allow", condition: { users: { $eq: "{{user.id}}" } } }
                            ]
                        },
                        {
                            permission: "data.entity.update",
                            policies: [
                                { effect: "filter", filter: { users: { $eq: "{{user.id}}" } } }
                            ]
                        },
                        {
                            permission: "data.entity.delete",
                            policies: [
                                { effect: "filter", filter: { users: { $eq: "{{user.id}}" } } }
                            ]
                        },
                    ],
                }
            },
            guard: { enabled: true }
        },
        data: schema.toJSON()
    },
    connection: { url: "data.db" },
} satisfies NextjsBkndConfig;
