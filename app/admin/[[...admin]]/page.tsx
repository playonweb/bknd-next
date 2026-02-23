'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import "bknd/dist/styles.css";

const Admin = dynamic(
    () => import('bknd/ui').then((mod) => mod.Admin),
    { ssr: false }
);

export default function AdminPage() {
    return (
        <Admin
            config={{
                basepath: "/admin",
                logo_return_path: "/",
                theme: "system",
            }}
        />
    );
}
