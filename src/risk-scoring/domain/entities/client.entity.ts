/**
 * Entidad de dominio: Cliente (solicitante de préstamos).
 * Risk & Scoring. Mapeo TypeORM → tabla `clients`.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Usuario que completó este perfil (rol client). Uno a uno. */
  @Column({ type: 'uuid', name: 'user_id', unique: true, nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 50, name: 'document_type' })
  documentType: string;

  @Column({ type: 'varchar', length: 50, name: 'document_number' })
  documentNumber: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'monthly_income' })
  monthlyIncome: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
