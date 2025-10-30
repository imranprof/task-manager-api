import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //post /auth/signup 
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      const {username, email, password} = signUpDto;
      const user = await this.authService.signup(username, email, password);
      return {message: 'User created successfully', user};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Post /auth/login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const {email, password} = loginDto;
      const token = await this.authService.login(email, password);
      return {message: 'Login successful', ...token};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

}
