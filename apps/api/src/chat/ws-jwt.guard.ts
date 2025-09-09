import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    // console.log(client.handshake)
    // || client.handshake.headers?.authorization?.replace(/^Bearer /, '');
    const token = client.handshake.auth.token;
    // console.log(token,"15..........")
    if (!token) throw new UnauthorizedException('Missing token');

    try {
    //   const payload = this.jwt.verify(token);
       const payload = await this.jwt.verifyAsync(
              token,
              {
                secret: jwtConstants.secret
              }
            );
      // attach user to socket
    //   console.log(payload,"27.......");
      client['user'] = payload; 
      return false;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }3
  }
}
