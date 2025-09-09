import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,HttpStatus,HttpCode,Request,Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email,signUpDto.firstname,signUpDto.lastname, signUpDto.password,)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup/owner')
  signUpPropertyOwner(@Body() signUpPropertyOwnerDto: any) {
    return this.authService.signUpPropertyOwner(signUpPropertyOwnerDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string ){
    return this.authService.forgotPassword(email)
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body('token') token: string,@Body('newPassword') newPassword:string ){
    return this.authService.resetPassword(token,newPassword)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req:any) {
    return req.user
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }


}
