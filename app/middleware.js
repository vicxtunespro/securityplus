import jwt, { decode } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server';



export async function middleware(req){
    const token = req.cookies.get('token')?.value;

    if(!token){
        return NextResponse.json({message: "Unauthorized user"}, {status: 401})
    }

    try {
        decode = jwt.verify('token', 'Hackme')
        req.user = decode

    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 401})
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/protected-route',
};