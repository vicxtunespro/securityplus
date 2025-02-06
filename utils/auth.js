import bcrypt from 'bcryptjs';
import User from '@/models/userModel';

export async function validateCredentials(credentials) {
  try {
    const { username, password } = credentials;
    
    // Find user in database
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invaild Password")
    } 

    //return
    return {
      id: user._id,
      username: user.username,
    }

  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}
