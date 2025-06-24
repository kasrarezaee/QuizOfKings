import { io } from "socket.io-client";
import { API_CONFIG, ROUTES, states } from "../config/settings.js";
import { apiCall } from "../services/apiClient.js";
import { userInfo } from "./authController.js";
import chalk from 'chalk';
import { Input } from "../utils/input.js";
import { clear } from "console"


let messages = []

export const chat = async (session_id) => {

    clear()

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.SESSIONS + "session/" + session_id, 'GET', userInfo.token)
    const session = await response.json()

    const player1 = session[0].player1_id
    const player2 = session[0].player2_id

    const receiver_id = userInfo.data[0].user_id === player1 ? player2 : player1;
    const sender_id = userInfo.data[0].user_id

    const socket = io('http://localhost:9000')
    socket.emit("join", session_id)


    await showMessages(sender_id, receiver_id)

    socket.on('message', async (message) => {
        messages.push(message)
        //await showMessages(sender_id, receiver_id)
        await chat(session_id)
    })

    socket.on('update message', async (message_id, message_body) => {
        messages.forEach(mes => {
            if (mes.message_id === message_id) {
                mes.message_body = message_body
            }
        })
        //await showMessages(sender_id, receiver_id)
        await chat(session_id)
    })

    socket.on('delete message', async (message_id) => {
        messages.filter(mes => {
            return (mes.message_id !== message_id)
        })
        //await showMessages(sender_id, receiver_id)
        await chat(session_id)
    })

    console.log(chalk.blue("options"))
    console.log("1.send message")
    if (messages.length != 0) console.log("2.update message\n3.delete message")

    const option = await Input("")

    if (option === "") states.pop()()

    switch (option) {
        case "1":
            states.push(async () => {
                await chat(session_id)
            })
            const message_body = await Input("")
            socket.emit("send message", { message_body, receiver_id, sender_id })
            states.pop()()
            break;

        case "2":
            states.push(async () => {
                await chat(session_id)
            })
            console.log(chalk.blue("which message you want to update? "))
            let message_number = await Input("")
            clear()
            let message_id = messages[parseInt(message_number) - 1].message_id

            if (messages[parseInt(message_number) - 1].sender_id === userInfo.data[0].user_id) {
                console.log("your new message: ")
                const new_message = await Input("")

                socket.emit('update message', message_id, new_message)
                states.pop()()
            } else {
                console.log(chalk.red("this message is not yours"))
                await Input("")
                states.pop()()
            }
            break;

        case "3":
            states.push(async () => {
                await chat(session_id)
            })
            console.log("which message you want to delete? ")
            let mes_number = await Input("")
            clear()
            let mes_id = messages[parseInt(mes_number) - 1].message_id
            if (messages[parseInt(mes_number) - 1].sender_id === userInfo.data[0].user_id) {
                socket.emit('delete message', (mes_id))
                states.pop()()
            } else {
                console.log(chalk.red("this message is not yours"))
                await Input("")
                states.pop()()
            }
            break;

    }


}

const showMessages = async (sender_id, receiver_id) => {

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.MESSAGE + sender_id + "/" + receiver_id, 'GET', userInfo.token)
    messages = await response.json()

    console.log(chalk.blue("messages: "))
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].sender_id === userInfo.data[0].user_id) {
            console.log(chalk.green(`${i + 1}.${messages[i].message_body}`))
        } else {
            console.log(`${i + 1}.${messages[i].message_body}`)
        }
    }

}
