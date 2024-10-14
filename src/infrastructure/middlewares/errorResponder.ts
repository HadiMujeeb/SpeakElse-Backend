import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
    status: number;      
    message: string;     
}

export const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const status = err.status
    const message = err.message || 'An unexpected error occurred. Please try again later.';

    console.error("Error handled by middleware:", err);

    res.status(status).json({ status, message });
};