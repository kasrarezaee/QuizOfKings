import express from "express"
import userRouter from "./routs/user.route.js"


const app = express();
app.use(express.json());

app.use("/api/users" , userRouter)
app.get('/' , async (req , res) =>{
    //res.send("<h1 style='text-align: center'>Hello</h1>")
});


export default app;