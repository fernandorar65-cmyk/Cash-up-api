import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración de datos de prueba para desarrollo/testing.
 * Inserta usuarios, roles, clientes, préstamos, pagos, etc.
 * Ejecutar después de InitialSchema.
 */
export class SeedTestData1737200000000 implements MigrationInterface {
  name = 'SeedTestData1737200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const user1 = 'a0000001-0000-4000-8000-000000000001';
    const user2 = 'a0000001-0000-4000-8000-000000000002';
    const role1 = 'b0000001-0000-4000-8000-000000000001';
    const role2 = 'b0000001-0000-4000-8000-000000000002';
    const userRole1 = 'b1000001-0000-4000-8000-000000000001';
    const userRole2 = 'b1000001-0000-4000-8000-000000000002';
    const client1 = 'c0000001-0000-4000-8000-000000000001';
    const client2 = 'c0000001-0000-4000-8000-000000000002';
    const penalty1 = 'd0000001-0000-4000-8000-000000000001';
    const loan1 = 'e0000001-0000-4000-8000-000000000001';
    const loan2 = 'e0000001-0000-4000-8000-000000000002';
    const inst1 = 'f0000001-0000-4000-8000-000000000001';
    const inst2 = 'f0000001-0000-4000-8000-000000000002';
    const inst3 = 'f0000001-0000-4000-8000-000000000003';
    const charge1 = '10000001-0000-4000-8000-000000000001';
    const eval1 = '11000001-0000-4000-8000-000000000001';
    const scoreHist1 = '12000001-0000-4000-8000-000000000001';
    const bgCheck1 = '13000001-0000-4000-8000-000000000001';
    const extDebt1 = '14000001-0000-4000-8000-000000000001';
    const profile1 = '15000001-0000-4000-8000-000000000001';
    const lateFee1 = '16000001-0000-4000-8000-000000000001';
    const loanHist1 = '17000001-0000-4000-8000-000000000001';
    const payment1 = '18000001-0000-4000-8000-000000000001';
    const payApp1 = '19000001-0000-4000-8000-000000000001';
    const coll1 = '1a000001-0000-4000-8000-000000000001';
    const audit1 = '1b000001-0000-4000-8000-000000000001';

    await queryRunner.query(`
      INSERT INTO "users" ("id", "email", "name", "password_hash", "is_active")
      VALUES
        ('${user1}', 'admin@cashup.local', 'Admin Demo', '$2b$10$dummy.hash.for.demo.only', true),
        ('${user2}', 'analyst@cashup.local', 'Analista Demo', '$2b$10$dummy.hash.for.demo.only', true)
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "roles" ("id", "name", "description")
      VALUES
        ('${role1}', 'admin', 'Administrador del sistema'),
        ('${role2}', 'analyst', 'Analista de crédito')
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "user_roles" ("id", "user_id", "role_id", "assigned_at")
      VALUES
        ('${userRole1}', '${user1}', '${role1}', now()),
        ('${userRole2}', '${user2}', '${role2}', now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "clients" ("id", "document_type", "document_number", "name", "email", "phone", "monthly_income")
      VALUES
        ('${client1}', 'DNI', '12345678', 'Juan Pérez', 'juan.perez@mail.com', '+51987654321', 3500.00),
        ('${client2}', 'CE', '987654321', 'María García', 'maria.garcia@mail.com', '+51912345678', 4200.50)
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "penalty_policies" ("id", "name", "penalty_percentage", "grace_days", "calculation_type", "is_active")
      VALUES
        ('${penalty1}', 'Mora estándar', 2.00, 3, 'percentage', true)
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "loans" ("id", "client_id", "amount", "interest_rate", "term_months", "interest_type", "status")
      VALUES
        ('${loan1}', '${client1}', 5000.00, 12.50, 12, 'fixed', 'active'),
        ('${loan2}', '${client2}', 8000.00, 10.00, 24, 'fixed', 'active')
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "installments" ("id", "loan_id", "number", "due_date", "principal_amount", "interest_amount", "total_amount", "status")
      VALUES
        ('${inst1}', '${loan1}', 1, current_date + interval '1 month', 400.00, 52.08, 452.08, 'pending'),
        ('${inst2}', '${loan1}', 2, current_date + interval '2 months', 404.00, 48.00, 452.00, 'pending'),
        ('${inst3}', '${loan2}', 1, current_date + interval '1 month', 333.33, 66.67, 400.00, 'pending')
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "loan_charges" ("id", "loan_id", "type", "amount", "description", "created_at")
      VALUES
        ('${charge1}', '${loan1}', 'commission', 50.00, 'Comisión de desembolso', now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "credit_evaluations" ("id", "client_id", "score", "approved", "factors", "evaluated_at", "evaluated_by_user_id")
      VALUES
        ('${eval1}', '${client1}', 72.50, true, '{"income": "ok", "history": "good"}'::jsonb, now(), '${user1}')
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "credit_score_history" ("id", "client_id", "score", "recorded_at")
      VALUES
        ('${scoreHist1}', '${client1}', 72.50, now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "client_background_checks" ("id", "client_id", "type", "result", "details", "checked_at")
      VALUES
        ('${bgCheck1}', '${client1}', 'judicial', 'clean', 'Sin registros', now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "external_debts" ("id", "client_id", "creditor_name", "amount", "monthly_payment", "recorded_at")
      VALUES
        ('${extDebt1}', '${client1}', 'Tarjeta XYZ', 1200.00, 150.00, now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "client_credit_profiles" ("id", "client_id", "current_score", "risk_level", "total_debt", "on_time_payments_count", "late_payments_count")
      VALUES
        ('${profile1}', '${client1}', 72.50, 'medium', 6200.00, 0, 0)
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "late_fees" ("id", "installment_id", "amount", "applied_at", "penalty_policy_id")
      VALUES
        ('${lateFee1}', '${inst1}', 10.00, now(), '${penalty1}')
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "loan_history" ("id", "loan_id", "action", "previous_state", "new_state", "user_id", "created_at")
      VALUES
        ('${loanHist1}', '${loan1}', 'created', null, '{"status":"active"}'::jsonb, '${user1}', now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "payments" ("id", "client_id", "loan_id", "amount", "method", "reference", "paid_at", "created_at")
      VALUES
        ('${payment1}', '${client1}', '${loan1}', 452.08, 'transfer', 'REF-001', now(), now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "payment_applications" ("id", "payment_id", "installment_id", "principal_amount", "interest_amount", "late_fee_amount", "applied_at")
      VALUES
        ('${payApp1}', '${payment1}', '${inst1}', 400.00, 52.08, 0.00, now())
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "collection_actions" ("id", "client_id", "loan_id", "action_type", "result", "notes", "performed_at", "performed_by_user_id")
      VALUES
        ('${coll1}', '${client1}', '${loan1}', 'call', 'contacted', 'Cliente confirmó pago', now(), '${user2}')
      ON CONFLICT ("id") DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO "audit_logs" ("id", "action", "entity_type", "entity_id", "old_values", "new_values", "user_id", "ip", "created_at")
      VALUES
        ('${audit1}', 'loan.created', 'Loan', '${loan1}', null, '{"amount":5000}'::jsonb, '${user1}', '127.0.0.1', now())
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "audit_logs"`);
    await queryRunner.query(`DELETE FROM "collection_actions"`);
    await queryRunner.query(`DELETE FROM "payment_applications"`);
    await queryRunner.query(`DELETE FROM "payments"`);
    await queryRunner.query(`DELETE FROM "loan_history"`);
    await queryRunner.query(`DELETE FROM "late_fees"`);
    await queryRunner.query(`DELETE FROM "client_credit_profiles"`);
    await queryRunner.query(`DELETE FROM "external_debts"`);
    await queryRunner.query(`DELETE FROM "client_background_checks"`);
    await queryRunner.query(`DELETE FROM "credit_score_history"`);
    await queryRunner.query(`DELETE FROM "credit_evaluations"`);
    await queryRunner.query(`DELETE FROM "loan_charges"`);
    await queryRunner.query(`DELETE FROM "installments"`);
    await queryRunner.query(`DELETE FROM "loan_refinances"`);
    await queryRunner.query(`DELETE FROM "loans"`);
    await queryRunner.query(`DELETE FROM "penalty_policies"`);
    await queryRunner.query(`DELETE FROM "clients"`);
    await queryRunner.query(`DELETE FROM "user_roles"`);
    await queryRunner.query(`DELETE FROM "roles"`);
    await queryRunner.query(`DELETE FROM "users"`);
  }
}
