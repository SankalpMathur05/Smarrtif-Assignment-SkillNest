import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string): string => {
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: userId }, secret as jwt.Secret, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    } as jwt.SignOptions);

    return token;
};

export default generateToken;
