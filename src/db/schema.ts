import { pgTable, serial,  integer, text } from 'drizzle-orm/pg-core'
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
  githubId: integer('github_id').unique(),
  userName: text("user")
})
