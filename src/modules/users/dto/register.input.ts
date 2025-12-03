import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../enums/role.enum';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field(() => [UserRole], { defaultValue: [UserRole.USER] })
  roles: UserRole[] = [UserRole.USER];
}
