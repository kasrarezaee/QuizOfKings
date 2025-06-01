import app from "./app.js"
import http from "http"
import dotenv from "dotenv"
dotenv.config()

const server = http.createServer((req , res)=>{
    app(req , res)
})

server.listen(process.env.PORT)