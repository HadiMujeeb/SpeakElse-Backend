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
import userWalletRoute from "./infrastructure/routes/user.Wallet.route";
// middlewire
import { errorHandler } from "./infrastructure/middlewares/error.middleware";
import MentorProfileRoute from "./infrastructure/routes/mentor.profile.route";
import { socketioRepository } from "./infrastructure/repository/socketio.repository";
import socketioUseCase from "./usecase/socketio.usecase";
import { socketioController } from "./adapters/controllers/socketio.controller";
import prisma from "./infrastructure/config/prismaCient.config";


dotenv.config();
const app = express();
const server = createServer(app);
// const socketService = new SocketService(server);
const SocketioControllerInstance = new socketioController(server);


app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// app.use(passport.initialize());
// app.use(passport.session())

app.use(cookieParse());

app.use("/api/user/auth", UserAuthRoutes);
app.use("/api/mentor/auth", MentorAuthRoute);
app.use("/api/admin", adminRouter);

app.use("/api/user/profile", profileRoute);
app.use("/api/mentor/profile", MentorProfileRoute);

app.use("/api/user/room", userRoomRoute);
app.use("/api/mentor/room", mentorRoomRoute);
app.use("/api/user/chat", FriendChatRoute);
app.use("/api/user/wallet", userWalletRoute);

app.use("/api/admin/languageTest", languageTestRoute);
app.use("/api/admin/mentorform", adminMentorFormRouter);
app.use("/api/admin/reports", adminReportsRoute);

// Use error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
