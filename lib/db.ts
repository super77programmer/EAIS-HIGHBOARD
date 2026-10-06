import {env} from 'cloudflare:workers';
export function db(){const d=(env as unknown as {DB:D1Database}).DB;if(!d)throw new Error('Database unavailable');return d}
export function settings(){return env as unknown as {ADMIN_PIN?:string;SESSION_SECRET?:string}}

export function files(){return (env as unknown as {FILES:R2Bucket}).FILES}
