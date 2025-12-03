import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class CreateEmployeeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Int)
  @IsNumber()
  @Min(18, { message: 'Employee must be at least 18 years old' })
  age: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  class: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @Field(() => [Boolean], { nullable: true })
  @IsArray()
  attendance?: boolean[];
}
