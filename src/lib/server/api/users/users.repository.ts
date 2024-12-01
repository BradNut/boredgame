import { DrizzleService } from '$lib/server/api/databases/postgres/drizzle.service';
import { usersTable } from '$lib/server/api/databases/postgres/tables/users.table';
import { inject, injectable } from '@needle-di/core';
import { type InferInsertModel, eq } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { takeFirst } from '../common/utils/drizzle';

export type Create = InferInsertModel<typeof usersTable>;
export type Update = Partial<Create>;

@injectable()
export class UsersRepository {
  constructor(private drizzle = inject(DrizzleService)) {}

  async findOneById(id: string, db = this.drizzle.db) {
    return db.select().from(usersTable).where(eq(usersTable.id, id)).then(takeFirst);
  }

  async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
    const user = await this.findOneById(id);
    if (!user) throw Error('User not found');
    return user;
  }

  async findOneByUsername(username: string, db = this.drizzle.db) {
    return db.select().from(usersTable).where(eq(usersTable.username, username)).then(takeFirst);
  }

  async findOneByEmail(email: string, db = this.drizzle.db) {
    return db.select().from(usersTable).where(eq(usersTable.email, email)).then(takeFirst);
  }

  async create(data: Create, db = this.drizzle.db) {
    return db.insert(usersTable).values(data).returning().then(takeFirstOrThrow);
  }

  async update(id: string, data: Update, db = this.drizzle.db) {
    return db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning().then(takeFirstOrThrow);
  }

  async delete(id: string, db = this.drizzle.db) {
    return db.delete(usersTable).where(eq(usersTable.id, id)).returning().then(takeFirstOrThrow);
  }
}
