import { InputType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true })
  @Min(1)
  limit?: number = 10;

  @Field({ nullable: true })
  sortBy?: string = 'createdAt';

  @Field({ nullable: true })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
