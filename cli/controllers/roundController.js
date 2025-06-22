import { API_CONFIG, ROUTES, states } from "../config/settings.js"
import { apiCall } from "../services/apiClient.js"
import { userInfo } from "./authController.js"
import { clear } from "console"
import { Input } from "../utils/input.js"

export const get_round_question = async (round_id) => {

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROUNDS + "round_id/" + round_id, 'GET', userInfo.token)
    const result = await response.json()
    const round = {
        data: result[0],
        questions: result
    }

    await answer_question(round)
}

export const get_turn = async (session_id) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROUNDS + "turn/" + "session_id/" + session_id, 'GET', userInfo.token)
    const result = await response.json()
    if (result == userInfo.data[0].user_id) {
        return true
    }
    return false
}



export const new_round = async (createdSession) => {
    const session = createdSession.data
    const round = {}

    const response_1 = await apiCall(API_CONFIG.BASE_URL + ROUTES.CATEGORY + "random/random", 'GET', userInfo.token)
    const result_1 = await response_1.json()
    console.log("choose a category: ")
    console.log(`1.${result_1[0].name}  2.${result_1[1].name}   3.${result_1[2].name}`)

    const answer = await Input("")
    const index = parseInt(answer) - 1

    const response_2 = await apiCall(API_CONFIG.BASE_URL + ROUTES.QUESTIONS + "random/" + result_1[index].category_id, 'GET', userInfo.token)
    const result_2 = await response_2.json()
    round.questions = result_2


    const response_3 = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROUNDS, 'POST', userInfo.token
        , {
            session_id: session.session_id,
            category_id: result_1[index].category_id,
            round_questions: result_2
        })

    const result_3 = await response_3.json()

    round.data = result_3[0]

    await get_round_question(result_3[0].round_id)
}


export const answer_question = async (round) => {

    let whoami = userInfo.data[0].user_id === round.data.player1_id ? "player1" : "player2"
    let roundHasBeenAnswered = false
    if (whoami === "player1") {
        if (round.questions[0].player1_answer !== null) {
            roundHasBeenAnswered = true
        }
    } else {
        if (round.questions[0].player2_answer !== null) {
            roundHasBeenAnswered = true
        }
    }

    for (let i = 0; i < 3; i++) {
        clear()
        const question = round.questions[i]
        console.log(question.question_text + "\n")
        console.log("A." + question.option_a + "\n")
        console.log("B." + question.option_b + "\n")
        console.log("C." + question.option_c + "\n")
        console.log("D." + question.option_d + "\n")
        if (roundHasBeenAnswered) {
            console.log("your answer was : " + (whoami === "player1" ? question.player1_answer : question.player2_answer))
        } else {
            const submitedAnswer = await Input("your answer: ")

            const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROUNDS + "submit", 'POST', userInfo.token
                , {
                    session_id: round.data.session_id,
                    round_id: round.data.round_id,
                    question_id: question.question_id,
                    user_id: userInfo.data[0].user_id,
                    answer: submitedAnswer
                })

            const result = await response.json()
            console.log("correct answer: " + result[0].correct_answer)

        }
        await Input("")
    }
    states.pop()()
}
