import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterUserDto { 
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}