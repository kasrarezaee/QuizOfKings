import express from "express"

const app = express();
app.use(express.json());
app.get('/' , async (req , res) =>{
    res.send("<h1 style='text-align: center'>Hello</h1>")
});


export default app;