import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export class JWT {
   static generateToken(userId: string) {
        return jwt.sign({ id: userId }, JWT_SECRET || 'default_secret', {
            expiresIn: '1h',
        })
    };
   static verifyToken(token: string) {
        return jwt.verify(token, JWT_SECRET || 'default_secret');
    };

}



