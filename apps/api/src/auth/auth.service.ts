
import { Injectable, UnauthorizedException,BadRequestException, HttpStatus, } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {compare, hash} from 'bcrypt'
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AuthService {
  constructor(private usersService: UserService,  private jwtService: JwtService,private prisma:PrismaService,
   private emailService:EmailService
  ) {}

  async signIn(email: string, password: string): Promise<{access_token:string}> {

    const user = await this.usersService.findByEmail(email)

    if (!user) {

              throw new BadRequestException('Invalid login credentials');

      }

    const passwordCorrect = await compare(password,user.password);


    if (!passwordCorrect) {
            console.log(email,password,"password")

      throw new BadRequestException('Invalid login credentials');
    }

 
    const payload = { id: user.id,email:user.email,firstname: user.firstname,lastname: user.lastname,role:user.role,isUserVerified:user.isUserVerified };
    
    const  access_token = await this.jwtService.signAsync(payload)

    return {
      access_token
    };
}


async signUp(email: string,firstname: string,lastname: string, pass: string):  Promise<{message:string}> {
    const user = await this.usersService.findOne(email);

    if (user) {
      throw new BadRequestException('User already exists')
    }

    const passwordHash = await hash(pass,10)


   const newUser = await this.usersService.create({email,password:passwordHash,lastname,firstname,role:'user'})

 
    const payload = { id: newUser.id,email:newUser.email, firstname: newUser.firstname,role:'user'};

    const  access_token = await this.jwtService.signAsync(payload,{expiresIn:"360d"})
    
    await this.emailService.sendVerificationEmail(newUser.email,newUser.firstname as string,access_token)

    return {
      message:"Registration successful, check email for verification link"
    }
}

async signUpPropertyOwner(data:any):  Promise<{message:string}> {
    const user = await this.usersService.findOne(data.email);

    if (user) {
      throw new BadRequestException('User already exists')
    }

    const passwordHash = await hash(data.password,10)

    await this.prisma.user.create({data:{...data,password:passwordHash,role:"owner"}})

 
    // const payload = { id: newUser.id,email:newUser.email, firstname: newUser.firstname,role:'user'};

    // await this.emailService.sendEmail(newUser.email,
    //   'Welcome to Our App!',
    //   'signup',
    //   {
    //     name: newUser.firstname,
    //     appName:process.env.APPNAME
    //   })

    // const  access_token = await this.jwtService.signAsync(payload)


    return {
      message:"Signup is successful, check email for verification link"
    }
}

async forgotPassword(email: string): Promise<{message:string}> {
  const user = await this.usersService.findOne(email);

  if (!user) {
    throw new BadRequestException('User does not exist')
  }

  const token = await this.jwtService.signAsync({email}, {
    secret: process.env.JWT_SIGNING_SECRET,
    expiresIn:"1hr"
  })


  //  await this.emailService.sendEmail(email,
  //   'Reset Your Password',
  //   'reset-password',
  //   {name:user.firstname,
  //   resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  //   appName:process.env.APPNAME

  //   });

    return { message: 'Check your email for password reset link' }

}


async resetPassword(
 token: string,
newPassword: string,
) {

  try {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SIGNING_SECRET,
    });

    const email = payload.email;

    const password = await hash(newPassword,10);

    
    // await this.usersService.updatePassword({email,password})
    return { message: 'Password successfully reset' };

  } catch (error) {
    console.log(error)
    throw new UnauthorizedException('Invalid or expired reset token');
  }
}

async verifyEmail( token: string) {

    const  payload = await this.jwtService.verifyAsync(token)

    const user = await this.prisma.user.findFirst({
      where: {
        email:payload.email
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isUserVerified: true,
      },
    });

    return { message: 'Email verified successfully!' };
  }

}