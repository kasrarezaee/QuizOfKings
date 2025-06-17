import app from "./app.js"
import http from "http"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
dotenv.config()
/*const pass = "1234"
const hash = await bcrypt.hash(pass, 13)
const isMatch = await bcrypt.compare(pass, hash).then(result => {
    console.log(result)
})
*/
const server = http.createServer((req, res) => {
    app(req, res)
})

server.listen(process.env.PORT)
