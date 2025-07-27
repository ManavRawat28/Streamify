import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from '../lib/stream.js';
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const idx = Math.floor((Math.random() * 100)) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({ email, password, fullName, profilePic: randomAvatar });

    // CREATE USER IN STREAM AS WELL
try {
  await upsertStreamUser({
    id:newUser._id,
    name:newUser.fullName,
    image: newUser.profilePic || " ",

  });
  console.log(`User created in Stream: ${newUser.fullName}`);
  
} catch (error) {
  console.log('error creating user in Stream (auth.controller)', error);
  
}


    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({ success: true, user: newUser });

  } catch (error) {
    console.error('error in signup controller', error);
    res.status(500).json({ message: 'Server Error' });
  }

}


export  async function login(req, res) {
  try {
    const { email, password } = req.body;
    if(!email ||!password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user=await User.findOne({ email });
    
    if(!user) return res.status(401).json({ message: 'Invalid email or password' });
  
    const isPasswordCorrect=await user.matchPassword(password);
    if(!isPasswordCorrect) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log('Error in login controller', error);
    res.status(500).json({ message: 'Server Error' });
    
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: 'User logged out successfully' });
}

export async function onboard(req, res) {
   try {
    const userId=req.user._id;

    const {fullName, bio, nativeLanguage , learningLanguage , location} = req.body;
    
    if(!fullName ||!bio ||!nativeLanguage ||!learningLanguage ||!location) {
      return res.status(400).json({ message: 'All fields are required',
        missingFields:[
       !fullName &&'fullName',
       !bio  &&'bio',
       !nativeLanguage  && 'nativeLanguage',
       !learningLanguage && 'learningLanguage',
       !location && 'location'
      ],
    });
  }

  const updatedUser=await User.findByIdAndUpdate(userId,{
    ...req.body,
    isOnboarded:true,
  }, {new:true});

  if(!updatedUser) return res.status(404).json({ message: 'User not found' });  
 
  //TODO: UPDATE USER IN STREAM AS WELL
  try {
    
    await upsertStreamUser({
     id:updatedUser._id,
     name:updatedUser.fullName,
     image: updatedUser.profilePic || " ",
    });
    console.log(`User updated in Stream: ${updatedUser.fullName}`);
  } catch (streamError) {
    console.log('error updating user in Stream (auth.controller)', streamError.message); 
    
  }

  console.log('UserID from JWT:', req.user._id);
  res.status(200).json({ success: true, user: updatedUser });


   } catch (error) {
    console.log('Onboarding error', error);
    res.status(500).json({ message: 'Server Error' });
   }
}