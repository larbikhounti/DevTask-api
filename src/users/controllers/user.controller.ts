import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { RegisterUserDto } from "../dtos/register.dto";
import { Public } from "src/auth/decorator/public.decorator";

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  // register user
  @Public()
  //@HttpCode(HttpStatus.CREATED)
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.create(registerUserDto);
  }



}