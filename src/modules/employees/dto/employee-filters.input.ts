import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EmployeeFiltersInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field({ nullable: true })
  class?: string;

  @Field(() => [String], { nullable: true })
  subjects?: string[];
}
