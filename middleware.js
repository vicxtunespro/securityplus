import { NextResponse } from "next/server";

//Protected routes
const protectedRoutes = ['/dashboard', '/profile'];

//auth routes
const authRoutes = ['/signup', '/login']

export function middleware(req){
    const token = req.cookies.get('token')?.value
    console.log(token);
    const url = req.nextUrl.pathname
    
    if(!token && protectedRoutes.includes(url)){
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if(token && authRoutes.includes(url)){
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: protectedRoutes,
}
