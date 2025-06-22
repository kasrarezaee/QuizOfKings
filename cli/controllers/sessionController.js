import { apiCall } from "../services/apiClient.js"
import { API_CONFIG, ROUTES, states } from "../config/settings.js"
import { Input } from "../utils/input.js"
import { userInfo } from "./authController.js"
import { clear } from "console"
import { get_turn, new_round, get_round_question } from "./roundController.js"

export const new_session = async () => {
    const session = {}

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.SESSIONS + "user/" + userInfo.data[0].user_id, 'POST', userInfo.token)
    const result = await response.json()
    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        states.pop()()
    } else {
        session.data = result[0]
        await new_round(session)
    }
}

export const get_session = async (session_id, admin_option) => {

    clear()

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.SESSIONS + "session/" + session_id, 'GET', userInfo.token)
    const result = await response.json()


    let allRoundsCompleted = true
    result.forEach(e => {
        if (e.round_status == 'ACTIVE') {
            allRoundsCompleted = false
        }
    })
    const your_turn = await get_turn(session_id)



    if ((userInfo.roles.length !== 0 && userInfo.roles[0].role_name == "admin") && admin_option == "2") {
        for (let i = 0; i < result.length; i++) {
            console.log((i + 1) + "." + result[i].round_status + "   " + (result[i].winner_id != null ? result[i].winner_id : ""))
            console.log("-------------------------------------------------")
        }
        await Input("")
        states.pop()()
    }
    else if (allRoundsCompleted && your_turn && result.length != 3) {

        console.log("your turn to create new round...")
        await Input("")
        const session = {}
        session.data = {
            session_id: session_id
        }

        await new_round(session)
    }

    else if ((allRoundsCompleted && result.length == 3) || (allRoundsCompleted && !your_turn) || !allRoundsCompleted) {

        for (let i = 0; i < result.length; i++) {
            let roundResult = ""
            if ((userInfo.roles.length !== 0 && userInfo.roles[0].role_name == "admin") && admin_option == "2") {
                roundResult = result[i].winner_id !== null ? result[i].winner_id : ""
            }
            else {
                if (result[i].winner_id === null) {
                    if (result[i].round_status == 'COMPLETED') {
                        roundResult = "DRAW"
                    } else {
                        roundResult = "PENDING"
                    }
                } else {
                    roundResult = result[i].winner_id == userInfo.data[0].user_id ? "WIN" : "LOSE"
                }
            }
            console.log((i + 1) + "." + result[i].round_status + "   " + roundResult)
            console.log("-------------------------------------------------")
        }
        const selectedround = await Input("enter round number: ")
        if (selectedround === "") {
            states.pop()()
        }
        else {
            const index = parseInt(selectedround) - 1
            await get_round_question(result[index].round_id)
        }

    }

    else if (allRoundsCompleted && result.length == 3) {
        const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.SESSIONS + "finish/" + session_id, 'POST', userInfo.token)
        if (response.status == 200) {
            clear()
            console.log("session is finished")
            states.pop()()
        }
    }

}

export const get_sessions = async () => {
    clear()

    let url = ""
    let option = ""
    if ((userInfo.roles.length !== 0 && userInfo.roles[0].role_name == "admin")) {

        console.log("1.your sessions        2.other's sessions")

        option = await Input("")

        if (option == "1") {
            url = `${API_CONFIG.BASE_URL}${ROUTES.SESSIONS}user/${userInfo.data[0].user_id}`

        } else if (option == "2") {
            url = `${API_CONFIG.BASE_URL}${ROUTES.SESSIONS}`
        } else {
            states.pop()()
            return;
        }
    }
    else {
        url = `${API_CONFIG.BASE_URL}${ROUTES.SESSIONS}user/${userInfo.data[0].user_id}`
    }

    const response = await apiCall(url, 'GET', userInfo.token)
    const result = await response.json()

    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        states.pop()()
    } else {
        clear()
        for (let i = 0; i < result.length; i++) {
            let sessionResult = ""
            if ((userInfo.roles.length !== 0 && userInfo.roles[0].role_name == "admin") && option == "2") {
                sessionResult = result[i].winner_id !== null ? result[i].winner_id : ""
            }
            else {
                if (result[i].winner_id === null) {
                    if (result[i].session_status == 'COMPLETED') {
                        sessionResult = "DRAW"
                    } else {
                        sessionResult = "PENDING"
                    }
                } else {
                    sessionResult = result[i].winner_id == userInfo.data[0].user_id ? "WIN" : "LOSE"
                }
            }
            console.log((i + 1) + "." + result[i].session_status + "   " + result[i].session_id + "   " + sessionResult)
            console.log("-------------------------------------------------")
        }

        const selectedSession = await Input("enter session number: ")

        if (selectedSession === "") {
            states.pop()()
        }
        else {
            states.push(get_sessions)
            const index = parseInt(selectedSession) - 1
            get_session(result[index].session_id, option)
        }
    }

}
