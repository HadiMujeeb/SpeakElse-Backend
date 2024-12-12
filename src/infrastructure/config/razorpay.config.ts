import dotenv from 'dotenv';


dotenv.config();

export const config = {
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',  
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '' 
};