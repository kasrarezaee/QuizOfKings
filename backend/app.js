import express from "express"
import userRouter from "./routs/user.route.js"
import roleRouter from "./routs/role.route.js"

const app = express();
app.use(express.json());

app.use("/api/users" , userRouter)
app.use("/api/admin/role" , roleRouter)
app.get('/' , async (req , res) =>{
    //res.send("<h1 style='text-align: center'>Hello</h1>")
});


export default app;