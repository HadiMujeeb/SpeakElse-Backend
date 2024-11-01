import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParse from "cookie-parser";
import passport from "passport";

// Routes
import UserAuthRoutes from "./infrastructure/routes/user.auth.route";
import adminRouter from "./infrastructure/routes/admin.route";
import profileRoute from "./infrastructure/routes/userProfile.route";
import MentorAuthRoute from "./infrastructure/routes/mentor.auth.route";

// middlewire
import { errorHandler } from "./infrastructure/middlewares/error.middleware";
import MentorProfileRoute from "./infrastructure/routes/mentor.profile.route";

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


// app.use(passport.initialize());
// app.use(passport.session())



app.use(cookieParse());

app.use("/api/user/auth", UserAuthRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/user",profileRoute)
app.use("/api/mentor",MentorProfileRoute);
app.use("/api/mentor/auth",MentorAuthRoute);
// Use error handler middleware
app.use(errorHandler)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
