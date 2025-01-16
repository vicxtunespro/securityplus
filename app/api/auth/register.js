import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const users = [];

export async function POST(request) {
    const {username, password } = await request.json();

        // Check if user already exists
    const existingUser  = users.find(user => user.username === username);
    if (existingUser ) {
        return NextResponse.json({ message: 'User  already exists' }, { status: 400 });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 
    users.push({ username, password: hashedPassword });
}