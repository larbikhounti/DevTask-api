import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { RegisterUserDto } from "../dtos/register.dto";

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  // register user
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
    }
}