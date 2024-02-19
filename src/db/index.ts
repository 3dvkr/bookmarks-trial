import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

dotenv.config()

const connectionString = process.env.DATABASE_URL!
// if transaction mode
const client = postgres(connectionString, { prepare: false })
// const client = postgres(connectionString)

export const db = drizzle(client);

// export { users } from './schema';