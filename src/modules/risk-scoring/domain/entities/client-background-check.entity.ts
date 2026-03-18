/**
 * Entidad de dominio: Verificación externa (judicial, listas de riesgo).
 * Risk & Scoring. Mapeo TypeORM → tabla `client_background_checks`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('client_background_checks')
export class ClientBackgroundCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 100 })
  result: string;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @Column({ type: 'timestamp', name: 'checked_at' })
  checkedAt: Date;
}

