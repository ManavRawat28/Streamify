import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute= async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decoded) return res.status(401).json({ message: 'Unauthorized' });

    const user=await User.findById(decoded.userId).select('-password'); // so that password dont get pass

    if(!user) return res.status(401).json({ message: 'Unauthorised No user found' });

    req.user=user;

    next(); // is middle ware k bad wala function will run usi function m req.user k value hai
     
    } catch (error) {
        console.error('error in protected route middleware', error);
        res.status(500).json({ message: 'Server Error' });
    }
}
