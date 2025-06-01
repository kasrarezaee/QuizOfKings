import express from "express"
import cors from "cors"

const app = express();
app.use(express.json());
app.get('/' , (req , res) =>{
    res.send("<h1 style='text-align: center'>Hello</h1>")
});

export default app;