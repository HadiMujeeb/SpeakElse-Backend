import express from "express";
import { createServer } from 'http';
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParse from "cookie-parser";
import { SocketService } from "./domain/services/socket.service";
// Routes
import UserAuthRoutes from "./infrastructure/routes/user.auth.route";
import adminRouter from "./infrastructure/routes/admin.route";
import profileRoute from "./infrastructure/routes/userProfile.route";
import MentorAuthRoute from "./infrastructure/routes/mentor.auth.route";
import userRoomRoute from "./infrastructure/routes/userRoom.route";
import FriendChatRoute from "./infrastructure/routes/user.chat.route";
import languageTestRoute from "./infrastructure/routes/admin.languageTest.route";
import adminMentorFormRouter from "./infrastructure/routes/admin.mentorform.route";
import adminReportsRoute from "./infrastructure/routes/admin.reports.route";
import mentorRoomRoute from "./infrastructure/routes/mentor.room.route";
// middlewire
import { errorHandler } from "./infrastructure/middlewares/error.middleware";
import MentorProfileRoute from "./infrastructure/routes/mentor.profile.route";
import { SocketioRepository } from "./infrastructure/repository/socketio.repository";
import { socketioUseCase } from "./usecase/socketio.usecase";
import { SocketioController } from "./adapters/controllers/socketio.controller";
import prisma from "./infrastructure/config/prismaCient.config";


dotenv.config();
const app = express();
const server = createServer(app);
// const socketService = new SocketService(server);
const SocketioControllerInstance = new SocketioController(server);


app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:60359"],
    credentials: true,
  })
);

// app.use(passport.initialize());
// app.use(passport.session())

app.use(cookieParse());

app.use("/api/user/auth", UserAuthRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/user", profileRoute);
app.use("/api/mentor", MentorProfileRoute);
app.use("/api/mentor/auth", MentorAuthRoute);
app.use("/api/user",userRoomRoute)
app.use("/api/user",FriendChatRoute)
app.use("/api/admin/languageTest",languageTestRoute)
app.use("/api/admin/mentorform",adminMentorFormRouter)
app.use("/api/admin/reports",adminReportsRoute);
app.use("/api/mentor",mentorRoomRoute)
// Use error handler middleware
app.use(errorHandler);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
