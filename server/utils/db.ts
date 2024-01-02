import { createClient as createLibSQLClient } from '@libsql/client/http'
import Database from 'better-sqlite3'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql'
import { join } from 'pathe'

export * as tables from '~/server/database/schema'
export type DBComponent = typeof tables.components.$inferSelect & {
  user: typeof tables.users.$inferSelect
}

let _db: BetterSQLite3Database | LibSQLDatabase | null = null

export function useDB() {
  if (!_db) {
    if (process.env.TURSO_DB_URL && process.env.TURSO_DB_TOKEN) {
      // Turso in production
      _db = drizzleLibSQL(createLibSQLClient({
        url: process.env.TURSO_DB_URL,
        authToken: process.env.TURSO_DB_TOKEN,
      }))
    }
    else if (process.dev) {
      // local sqlite in development
      const sqlite = new Database(join(process.cwd(), './db.sqlite'))
      _db = drizzle(sqlite)
    }
    else {
      throw new Error('No database configured for production')
    }
  }
  return _db
}
