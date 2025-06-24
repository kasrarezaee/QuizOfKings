import express from "express";
import userRouter from "./routs/user.route.js";
import roleRouter from "./routs/role.route.js";
import categoryRouter from "./routs/category.route.js";
import questionRouter from "./routs/question.route.js";
import authRouter from "./routs/auth.route.js"
import sessionRouter from "./routs/session.route.js"
import roundRoute from "./routs/round.route.js"
import moderationRoute from "./routs/moderation.route.js"
import messageRoute from "./routs/message.route.js"
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json());
app.use(cookieParser())

app.use("/api/users", userRouter);
app.use("/api/role", roleRouter);
app.use("/api/category", categoryRouter);
app.use("/api/question", questionRouter);
app.use("/api/auth", authRouter)
app.use("/api/session", sessionRouter)
app.use("/api/round", roundRoute)
app.use("/api/moderation", moderationRoute)
app.use("/api/message", messageRoute)

app.get("/", async (req, res) => {
  res.send("<h1 style='text-align: center'>Hello</h1>")
});


export default app;
