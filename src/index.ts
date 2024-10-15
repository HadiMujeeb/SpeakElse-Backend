import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParse from "cookie-parser";
import passport from "passport";

// Routes
import UserAuthRoutes from "./infrastructure/routes/user.AuthRoutes";
import adminRouter from "./infrastructure/routes/adminRoute";

// middlewire
import { errorHandler } from "./infrastructure/middlewares/errorResponder";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));



app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);


app.use(passport.initialize());
app.use(passport.session())



app.use(cookieParse());

app.use("/api/user/auth", UserAuthRoutes);
app.use("/api/admin", adminRouter);

// Use error handler middleware
app.use(errorHandler)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
