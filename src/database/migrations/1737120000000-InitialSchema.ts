import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración inicial: crea todas las tablas del diseño.
 * Ejecutar después de crear la base de datos "cash-up".
 */
export class InitialSchema1737120000000 implements MigrationInterface {
  name = 'InitialSchema1737120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar(255) NOT NULL UNIQUE,
        "name" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "description" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "role_id" uuid NOT NULL REFERENCES "roles"("id"),
        "assigned_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "document_type" varchar(50) NOT NULL,
        "document_number" varchar(50) NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255),
        "phone" varchar(50),
        "monthly_income" decimal(15,2) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "credit_evaluations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "score" decimal(5,2) NOT NULL,
        "approved" boolean NOT NULL,
        "factors" jsonb NOT NULL,
        "evaluated_at" timestamp NOT NULL,
        "evaluated_by_user_id" uuid REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "credit_score_history" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "score" decimal(5,2) NOT NULL,
        "recorded_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "client_background_checks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "type" varchar(100) NOT NULL,
        "result" varchar(100) NOT NULL,
        "details" text,
        "checked_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "external_debts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "creditor_name" varchar(255) NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "monthly_payment" decimal(15,2) NOT NULL,
        "recorded_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "client_credit_profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL UNIQUE REFERENCES "clients"("id"),
        "current_score" decimal(5,2) NOT NULL,
        "risk_level" varchar(50) NOT NULL,
        "total_debt" decimal(15,2) NOT NULL,
        "on_time_payments_count" int NOT NULL,
        "late_payments_count" int NOT NULL,
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "penalty_policies" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "penalty_percentage" decimal(5,2) NOT NULL,
        "grace_days" int NOT NULL,
        "calculation_type" varchar(50) NOT NULL,
        "is_active" boolean NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "loans" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "amount" decimal(15,2) NOT NULL,
        "interest_rate" decimal(5,2) NOT NULL,
        "term_months" int NOT NULL,
        "interest_type" varchar(50) NOT NULL,
        "status" varchar(30) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "loan_refinances" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "original_loan_id" uuid NOT NULL REFERENCES "loans"("id"),
        "new_loan_id" uuid NOT NULL REFERENCES "loans"("id"),
        "refinanced_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "installments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "loan_id" uuid NOT NULL REFERENCES "loans"("id"),
        "number" int NOT NULL,
        "due_date" date NOT NULL,
        "principal_amount" decimal(15,2) NOT NULL,
        "interest_amount" decimal(15,2) NOT NULL,
        "total_amount" decimal(15,2) NOT NULL,
        "status" varchar(20) NOT NULL,
        "paid_at" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "loan_charges" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "loan_id" uuid NOT NULL REFERENCES "loans"("id"),
        "type" varchar(50) NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "description" text,
        "created_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "late_fees" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "installment_id" uuid NOT NULL REFERENCES "installments"("id"),
        "amount" decimal(15,2) NOT NULL,
        "applied_at" timestamp NOT NULL,
        "penalty_policy_id" uuid NOT NULL REFERENCES "penalty_policies"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "loan_history" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "loan_id" uuid NOT NULL REFERENCES "loans"("id"),
        "action" varchar(100) NOT NULL,
        "previous_state" jsonb,
        "new_state" jsonb,
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "created_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "loan_id" uuid NOT NULL REFERENCES "loans"("id"),
        "amount" decimal(15,2) NOT NULL,
        "method" varchar(50) NOT NULL,
        "reference" varchar(255),
        "paid_at" timestamp NOT NULL,
        "created_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "payment_applications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "payment_id" uuid NOT NULL REFERENCES "payments"("id"),
        "installment_id" uuid NOT NULL REFERENCES "installments"("id"),
        "principal_amount" decimal(15,2) NOT NULL,
        "interest_amount" decimal(15,2) NOT NULL,
        "late_fee_amount" decimal(15,2) NOT NULL,
        "applied_at" timestamp NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "collection_actions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_id" uuid NOT NULL REFERENCES "clients"("id"),
        "loan_id" uuid REFERENCES "loans"("id"),
        "action_type" varchar(50) NOT NULL,
        "result" varchar(100) NOT NULL,
        "notes" text,
        "performed_at" timestamp NOT NULL,
        "performed_by_user_id" uuid NOT NULL REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "action" varchar(100) NOT NULL,
        "entity_type" varchar(100) NOT NULL,
        "entity_id" uuid NOT NULL,
        "old_values" jsonb,
        "new_values" jsonb,
        "user_id" uuid REFERENCES "users"("id"),
        "ip" varchar(45),
        "user_agent" text,
        "created_at" timestamp NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "collection_actions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payment_applications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "loan_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "late_fees"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "loan_charges"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "installments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "loan_refinances"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "loans"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "penalty_policies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "client_credit_profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "external_debts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "client_background_checks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "credit_score_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "credit_evaluations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clients"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
