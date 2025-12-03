import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity('employees')
export class Employee {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('int')
  age: number;

  @Field()
  @Column()
  class: string;

  @Field(() => [String])
  @Column('text', { array: true })
  subjects: string[];

  @Field(() => [Boolean])
  @Column('boolean', { array: true, default: [] })
  attendance: boolean[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
