import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/models/userModel';

export async function POST(Request) {
  await dbConnect();

  const { username, email, password } = await Request.json();

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully', user }, {status: 201});
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
