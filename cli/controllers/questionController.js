import { API_CONFIG, ROUTES, states } from "../config/settings.js"
import { apiCall } from "../services/apiClient.js"
import { userInfo } from "./authController.js"
import { clear } from "console"
import { Input } from "../utils/input.js"

export const get_questions = async () => {
    //states.push(menu)
    clear()
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.QUESTIONS, 'GET', userInfo.token)
    const result = await response.json()


    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        states.pop()()
    } else {
        for (let i = 0; i < result.length; i++) {
            console.log((i + 1) + "." + result[i].question_text)
            console.log("---------------------------------------")
        }
        console.log("select the question you want to see: ")
        const question = await Input("")
        if (question === "") {
            states.pop()()
        } else {
            clear()
            console.log(result[question - 1].question_text)
            console.log("A." + result[question - 1].option_a)
            console.log("B." + result[question - 1].option_b)
            console.log("C." + result[question - 1].option_c)
            console.log("D." + result[question - 1].option_d)

            console.log("write confirm for confirming the question otherwise write reject: ")
            const action = await Input("")
            clear()
            console.log("any notes?")
            const notes = await Input("")
            const target_question_id = result[question - 1].question_id
            const target_user_id = null
            const action_type = action.toUpperCase()
            const moderator_id = userInfo.data[0].user_id

            result[question - 1].approval_status = action.toUpperCase() === 'CONFIRM' ? 'ACCEPTED' : 'REJECTED'
            result[question - 1].moderator_id = moderator_id

            await review_question(result[question - 1])

            const report_result = await report_action(moderator_id, target_user_id, target_question_id, action_type, notes)

            clear()

            console.log(report_result)
            await Input("")
            states.pop()()
        }
    }
}

export const review_question = async (question) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.QUESTIONS + question.question_id, 'POST', userInfo.token, question)
    const result = await response.json()
}

export const report_action = async (moderator_id, target_user_id, target_question_id, action_type, notes) => {

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.MODERATION, 'POST', userInfo.token
        , {
            moderator_id: moderator_id,
            target_question_id: target_question_id,
            target_user_id: target_user_id,
            action_type: action_type,
            notes: notes
        })
    if (response.status == 200) return "action reported successfully"

}

export const get_categories = async () => {

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.CATEGORY, 'GET', userInfo.token)
    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        console.log(states.pop)
        states.pop()()
        return;
    }
    const result = await response.json()
    return result



}

export const design_question = async () => {
    const categories = await get_categories()
    if (!categories) return
    clear()
    console.log("in which category your question will be?")
    for (let i = 0; i < categories.length; i++) {
        console.log((i + 1) + "." + categories[i].name)
    }
    const category = await Input("")
    clear()
    console.log("question text: ")
    const question_text = await Input("")

    console.log("option A")
    const option_a = await Input("")
    console.log("option B")
    const option_b = await Input("")
    console.log("option C")
    const option_c = await Input("")
    console.log("option D")
    const option_d = await Input("")

    console.log("difficulty: ")
    const difficulty = await Input("")

    console.log("correct answer: ")
    const correct_answer = await Input("")

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.QUESTIONS, 'POST', userInfo.token
        , {
            question_text: question_text,
            option_a: option_a,
            option_b: option_b,
            option_c: option_c,
            option_d: option_d,
            correct_answer: correct_answer,
            category_id: categories[category - 1].category_id,
            difficulty: difficulty,
            author_id: userInfo.data[0].user_id
        })

    if (response.status == 200) console.log("question created successfully")

    states.pop()()

}

