import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './infrastructure/routes/userRoutes'; 

// configure .env file
dotenv.config();
// Initialize Express app
const app = express();

// app.use(cors());    
app.use(express.json());
// log all requests
app.use(morgan('dev'));

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
  // Middleware to parse JSON bodies

app.use('/api/user',userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
