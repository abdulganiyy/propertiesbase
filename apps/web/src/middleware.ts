import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export default async function middleware(req: NextRequest) {

  const token =  req.cookies.get('token')?.value || ''

       if (!token) {

        return NextResponse.redirect(new URL('/signin', req.url));
      }

  let isAuthenticated = false;

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: {
        Authorization:`Bearer ${token}`
      }
    });

    // Assuming a successful response means the user is authenticated and `response.data` contains user info
    isAuthenticated = !!response.data;

      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }

      // If authenticated, continue to the requested page
      return NextResponse.next();

  } catch (error:any) {
        console.log(JSON.stringify(error?.response))

      return NextResponse.redirect(new URL('/signin', req.url));

  }

}

export const config = {
      matcher: ['/dashboard/:path*'], // Apply this middleware to /dashboard routes
};