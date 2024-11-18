import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export class JWT {
   static generateToken(userId: string) {
        return jwt.sign({ id: userId }, JWT_SECRET || 'default_secret', {
            expiresIn: process.env.JWT_EXPIRES_IN,
        })
    };
   static refreshToken(userId: string) {
        return jwt.sign({ id: userId }, JWT_SECRET || 'default_secret', {
            expiresIn: "7d",
        })
    };

   static verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET || 'default_secret');
    };

}



