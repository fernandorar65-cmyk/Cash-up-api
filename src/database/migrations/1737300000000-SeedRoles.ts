import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Inserta los 3 roles del sistema: admin, analyst, client.
 * Las tablas deben existir (creadas por TypeORM/synchronize o por otra vía).
 */
export class SeedRoles1737300000000 implements MigrationInterface {
  name = 'SeedRoles1737300000000';

  private readonly adminId = 'a1000001-0000-4000-8000-000000000001';
  private readonly analystId = 'a1000001-0000-4000-8000-000000000002';
  private readonly clientId = 'a1000001-0000-4000-8000-000000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "roles" ("id", "name", "description", "created_at", "updated_at")
      VALUES
        ('${this.adminId}', 'admin', 'Administrador del sistema', now(), now()),
        ('${this.analystId}', 'analyst', 'Analista de crédito', now(), now()),
        ('${this.clientId}', 'client', 'Cliente / solicitante de crédito', now(), now())
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "roles" WHERE "id" IN ('${this.adminId}', '${this.analystId}', '${this.clientId}')`,
    );
  }
}
