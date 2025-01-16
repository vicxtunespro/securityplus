import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import jwt from 'jsonwebtoken'


export async function POST(req) {
  try {
    // Parse request body
    await dbConnect();

    const { username, password } = await req.json();
    console.log("Password:", password);
    console.log("Username:", username);
    
    // Check for missing data
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Find user in database
    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    // Check if password exists in database
    if (!user.password) {
      return NextResponse.json(
        { message: "User's password is missing in the database" },
        { status: 500 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create jwt
      const token = jwt.sign({id: user._id}, "Hackme", {expiresIn: '1h'})

      const response = NextResponse.json(
        { message: `${user.username} logged in successfully` },
        { status: 200 }
      );

      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: false
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
