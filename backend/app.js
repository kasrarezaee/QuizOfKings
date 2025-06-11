import express from "express";
import userRouter from "./routs/user.route.js";
import roleRouter from "./routs/role.route.js";
import categoryRouter from "./routs/category.route.js";
import questionRouter from "./routs/question.route.js";
import authRouter from "./routs/auth.route.js"
const app = express();
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/admin/role", roleRouter);
app.use("/api/admin/category", categoryRouter);
app.use("/api/question", questionRouter);
app.use("/api/auth", authRouter)
app.get("/", async (req, res) => {
  //res.send("<h1 style='text-align: center'>Hello</h1>")
});

export default app;
