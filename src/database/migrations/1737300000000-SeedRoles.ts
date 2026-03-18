import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedRoles1737300000000 implements MigrationInterface {
  name = 'SeedRoles1737300000000';

  // 🔹 Roles
  private readonly adminRoleId = 'a1000001-0000-4000-8000-000000000001';
  private readonly analystRoleId = 'a1000001-0000-4000-8000-000000000002';
  private readonly clientRoleId = 'a1000001-0000-4000-8000-000000000003';

  // 🔹 Users
  private readonly adminUserId = 'b2000001-0000-4000-8000-000000000001';
  private readonly analystUserId = 'b2000001-0000-4000-8000-000000000002';

  // 🔹 UserRoles
  private readonly adminUserRoleId = 'c3000001-0000-4000-8000-000000000001';
  private readonly analystUserRoleId = 'c3000001-0000-4000-8000-000000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 🔐 Variables
    const adminEmail = 'admin@email.com';
    const adminPassword = 'Admin123*';
    const adminName = 'Administrador';

    const analystEmail = 'analyst@email.com';
    const analystPassword = 'Analyst123*';
    const analystName = 'Analista';

    // 🔐 Hash
    const saltRounds = 10;
    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    const analystHash = await bcrypt.hash(analystPassword, saltRounds);

    // 🔹 Insertar roles
    await queryRunner.query(`
      INSERT INTO "roles" ("id", "name", "description", "created_at", "updated_at")
      VALUES
        ('${this.adminRoleId}', 'admin', 'Administrador del sistema', now(), now()),
        ('${this.analystRoleId}', 'analyst', 'Analista de crédito', now(), now()),
        ('${this.clientRoleId}', 'client', 'Cliente', now(), now())
      ON CONFLICT ("id") DO NOTHING
    `);

    // 🔹 Insertar users
    await queryRunner.query(`
      INSERT INTO "users"
      ("id", "email", "name", "password_hash", "is_active", "created_at", "updated_at")
      VALUES
        ('${this.adminUserId}', '${adminEmail}', '${adminName}', '${adminHash}', true, now(), now()),
        ('${this.analystUserId}', '${analystEmail}', '${analystName}', '${analystHash}', true, now(), now())
      ON CONFLICT ("email") DO NOTHING
    `);

    // 🔹 Insertar user_roles (IMPORTANTE: id + assigned_at)
    await queryRunner.query(`
      INSERT INTO "user_roles"
      ("id", "user_id", "role_id", "assigned_at")
      VALUES
        ('${this.adminUserRoleId}', '${this.adminUserId}', '${this.adminRoleId}', now()),
        ('${this.analystUserRoleId}', '${this.analystUserId}', '${this.analystRoleId}', now())
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "user_roles"
      WHERE "id" IN ('${this.adminUserRoleId}', '${this.analystUserRoleId}')
    `);

    await queryRunner.query(`
      DELETE FROM "users"
      WHERE "id" IN ('${this.adminUserId}', '${this.analystUserId}')
    `);

    await queryRunner.query(`
      DELETE FROM "roles"
      WHERE "id" IN ('${this.adminRoleId}', '${this.analystRoleId}', '${this.clientRoleId}')
    `);
  }
}