import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateEmployeeInput } from './create-employee.input';

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {
  @Field()
  id: string;

  @Field(() => [Boolean], { nullable: true })
  attendance?: boolean[];
}
