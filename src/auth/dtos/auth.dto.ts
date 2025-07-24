import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInRequestDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class SignInResponseDto {
  access_token: string;
  email: string;
  name: string;
}
