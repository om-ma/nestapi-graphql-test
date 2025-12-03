import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Employee } from '../entities/employee.entity';

@ObjectType()
export class EmployeePaginatedResponse {
  @Field(() => [Employee])
  employees: Employee[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
