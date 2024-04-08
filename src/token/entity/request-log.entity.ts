import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessKey: string;

  @Column('timestamp')
  requestedAt: Date;
}
