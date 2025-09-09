import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie'


let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ['websocket'],
      auth: { token: `${Cookies.get('token')}` }, // Bearer-like token, server guard expects it
    });
  }
  return socket;
}
