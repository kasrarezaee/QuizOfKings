import { clear, Console, error } from "console"
import { Stats } from "fs"
import readline from "readline"
import util from "util"

let userInfo = {}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const Input = (query) => {
    return new Promise(resolve => {
        rl.question(query, resolve)
    })
}

const request_settings = {
    hostname: 'localhost',
    port: 9000
}

const states = []


const login_page = async () => {
    clear()
    let email = ""
    let password = ""


    const answer_0 = await Input("email: ")
    email = answer_0

    const answer_1 = await Input("password: ")
    password = answer_1
    const postData = JSON.stringify({
        "email": email,
        "password": password
    })
    //const { token, user, userRoles }
    const result = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: postData
    })
    const { user, userRoles, token } = await result.json()
    result.headers.forEach(e => {
        if (e.startsWith("refresh-token")) {
            userInfo.refreshToken = e.replace("refresh-token", "refreshToken")
        }
    })

    userInfo.data = user
    userInfo.roles = userRoles
    userInfo.token = token
    console.log("login:")
    console.log(userInfo)
    console.log("---------------------------------------")
    if (userRoles.length != 0) {
        if (userRoles[0].role_name === 'admin') {
            admin_menu()
        } else if (userRoles[0].role_name === 'moderator') {
            moderator_menu()
        } else if (userRoles[0].role_name === 'question_designer') {
            q_designer_menu()
        }
    }
    else {
        menu()
        //setInterval(() => {
        //    refresh_token()
        //}, 1000)
    }
}

const signup_page = async () => {
    clear()
    let email = ""
    let password = ""
    let username = ""


    const answer_0 = await Input("username: ")
    username = answer_0

    const answer_1 = await Input("email: ")
    email = answer_1

    const answer_2 = await Input("password: ")
    password = answer_2
    const postData = JSON.stringify({
        "username": username,
        "email": email,
        "password": password
    })

    const result = await fetch('http://localhost:9000/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: postData
    })
    const { newUser, token } = await result.json()
    result.headers.forEach(e => {
        if (e.startsWith("refresh-token")) {
            userInfo.refreshToken = e.replace("refresh-token", "refreshToken")
        }
    })
    userInfo.data = newUser
    userInfo.auth_token = token
    menu()
    //rl.close()
}

const answer_question = async (round) => {

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
            const response = await fetch('http://localhost:9000/api/round/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': userInfo.token
                },
                body: JSON.stringify({
                    session_id: round.data.session_id,
                    round_id: round.data.round_id,
                    question_id: question.question_id,
                    user_id: userInfo.data[0].user_id,
                    answer: submitedAnswer
                })
            })

            const result = await response.json()
            console.log("correct answer: " + result[0].correct_answer)
        }
        await Input("")
    }
    states.pop()()

}

const refresh_token = async () => {
    const response = await fetch('http://localhost:9000/api/auth/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: userInfo.refreshToken.substring(13, 166)
        })
    })
    const result = await response.json()
    response.headers.forEach(e => {
        if (e.startsWith("refresh-token")) {
            userInfo.refreshToken = e.replace("refresh-token", "refreshToken")
        }
    })
    userInfo.token = result.token

}

const new_session = async () => {
    //states.push(menu)
    const session = {}
    const response = await fetch(`http://localhost:9000/api/session/user/${userInfo.data[0].user_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })
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
    //return session
}

const get_round_question = async (round_id) => {
    const response = await fetch(`http://localhost:9000/api/round/round_id/${round_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })
    const result = await response.json()
    const round = {
        data: result[0],
        questions: result
    }

    await answer_question(round)
}

const get_turn = async (session_id) => {
    const response = await fetch(`http://localhost:9000/api/round/turn/session_id/${session_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })
    const result = await response.json()
    if (result == userInfo.data[0].user_id) {
        return true
    }
    return false
}

const get_session = async (session_id) => {
    clear()

    const response = await fetch(`http://localhost:9000/api/session/session/${session_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })
    const result = await response.json()


    let allRoundsCompleted = true
    result.forEach(e => {
        if (e.round_status == 'ACTIVE') {
            allRoundsCompleted = false
        }
    })
    const your_turn = await get_turn(session_id)

    if (allRoundsCompleted && your_turn && result.length != 3) {

        console.log("your turn to create new round...")
        await Input("")
        const session = {}
        session.data = {
            session_id: session_id
        }

        await new_round(session)
    }

    if ((allRoundsCompleted && result.length == 3) || !allRoundsCompleted) {

        for (let i = 0; i < result.length; i++) {
            console.log((i + 1) + "." + result[i].round_status + "   " + result[i].round_id)
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

}

const get_sessions = async () => {
    //   states.push(menu)
    clear()
    const response = await fetch(`http://localhost:9000/api/session/user/${userInfo.data[0].user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })
    const result = await response.json()
    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        states.pop()()
    } else {
        for (let i = 0; i < result.length; i++) {
            console.log(i + "." + result[i].session_status + "   " + result[i].session_id)
            console.log("-------------------------------------------------")
        }
        const selectedSession = await Input("enter session number: ")
        if (selectedSession === "") {
            states.pop()()
        }
        else {
            states.push(get_sessions)
            const index = parseInt(selectedSession)
            get_session(result[index].session_id)
        }
    }

}


const new_round = async (createdSession) => {
    const session = createdSession.data
    const round = {}



    const response_1 = await fetch(`http://localhost:9000/api/category/random/random`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })

    const result_1 = await response_1.json()
    console.log("choose a category: ")
    console.log(`1.${result_1[0].name}  2.${result_1[1].name}   3.${result_1[2].name}`)

    const answer = await Input("")
    const index = parseInt(answer) - 1
    const response_2 = await fetch(`http://localhost:9000/api/question/random/${result_1[index].category_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        }
    })

    const result_2 = await response_2.json()
    round.questions = result_2
    const response_3 = await fetch(`http://localhost:9000/api/round/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
        body: JSON.stringify({
            session_id: session.session_id,
            category_id: result_1[index].category_id,
            round_questions: result_2
        })
    })
    const result_3 = await response_3.json()

    round.data = result_3[0]

    await get_round_question(result_3[0].round_id)
}

const get_users = async () => {
    //states.push(admin_menu)
    clear()
    const response = await fetch(`http://localhost:9000/api/users/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })
    const result = await response.json()

    for (let i = 0; i < result.length; i++) {
        if (result[i].user_id != userInfo.data[0].user_id) {
            console.log((i + 1) + "." + result[i].username)
            console.log("---------------------------------------")
        }
    }

    console.log("select the user you want to see: ")
    const user = await Input("")

    if (user === "") {
        states.pop()()
    } else {
        clear()
        states.push(get_users)
        console.log("username: " + result[user - 1].username)
        console.log("email: " + result[user - 1].email)
        console.log("registration date: " + result[user - 1].registration_date)
        console.log("is blocked: " + result[user - 1].is_blocked)
        console.log("xp level: " + result[user - 1].xp_level + "\n")

        console.log("1.assign role      2.delete role      3.block      4.unblock")
        const operation = await Input("")

        if (operation == "1") {

            const roles = await get_roles()
            console.log("enter the role you want to assign: ")
            for (let i = 0; i < roles.length; i++) {
                console.log((i + 1) + "." + roles[i].role_name)
            }
            const role = await Input("")
            const role_assign_result = await assign_role(result[user - 1].user_id, roles[role - 1].role_id)

            clear()
            console.log(role_assign_result)
            await Input("")
            states.pop()()

        } else if (operation == "2") {
            const roles = await get_user_roles(result[user - 1].user_id)
            console.log("enter the role you want to delete: ")
            for (let i = 0; i < roles.length; i++) {
                console.log((i + 1) + "." + roles[i].role_name)
            }
            const role = await Input("")

            const role_delete_result = await delete_role(result[user - 1].user_id, roles[role - 1].role_id)

            clear()
            console.log(role_delete_result)
            await Input("")
            states.pop()()

        } else if (operation == "3") {
            const block_result = await block_user(result[user - 1].user_id)
            clear()
            console.log(block_result)
            await Input("")
            states.pop()()

        } else if (operation == "4") {
            const unblock_result = await unblock_user(result[user - 1].user_id)
            clear()
            console.log(unblock_result)
            await Input("")
            states.pop()()

        } else {
            states.pop()()
        }
    }
}

const block_user = async (user_id) => {
    const response = await fetch(`http://localhost:9000/api/users/block/${user_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })

    if (response.status == 200) return "user blocked successfully"
}

const unblock_user = async (user_id) => {
    const response = await fetch(`http://localhost:9000/api/users/block/${user_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })

    if (response.status == 200) return "user unblocked successfully"
}

const delete_role = async (user_id, role_id) => {
    const response = await fetch(`http://localhost:9000/api/users/role/${user_id}/${role_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })

    if (response.status == 200) return "role deleted successfully"
}

const assign_role = async (user_id, role_id) => {
    const response = await fetch(`http://localhost:9000/api/users/role/${user_id}/${role_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })

    if (response.status == 200) return "role assigned successfully"
}

const get_roles = async () => {
    const response = await fetch(`http://localhost:9000/api/role/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })

    const result = await response.json()

    return result
}

const get_user_roles = async (user_id) => {
    const response = await fetch(`http://localhost:9000/api/users/role/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })

    const result = await response.json()
    return result
}

const get_questions = async () => {
    //states.push(menu)
    clear()
    const response = await fetch(`http://localhost:9000/api/question/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })
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

const review_question = async (question) => {

    const response = await fetch(`http://localhost:9000/api/question/${question.question_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
        body: JSON.stringify(question)
    })

    const result = await response.json()
}

const report_action = async (moderator_id, target_user_id, target_question_id, action_type, notes) => {
    const response = await fetch(`http://localhost:9000/api/moderation/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
        body: JSON.stringify({
            moderator_id: moderator_id,
            target_question_id: target_question_id,
            target_user_id: target_user_id,
            action_type: action_type,
            notes: notes
        })
    })



    if (response.status == 200) return "action reported successfully"

}

const get_categories = async () => {
    const response = await fetch(`http://localhost:9000/api/category/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
    })
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

const design_question = async () => {
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



    const response = await fetch(`http://localhost:9000/api/question/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': userInfo.token
        },
        body: JSON.stringify({
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
    })

    if (response.status == 200) console.log("question created successfully")

    states.pop()()

}

const menu = () => {
    clear()
    console.log("1.start game\n2.sessions\n3.player state\n4.leaderboard\n5.exit")
    let command = ""

    rl.question("", async (answer_0) => {
        command = answer_0
        switch (answer_0) {
            case "1":
                clear()
                await new_session()
                //states.push(menu)
                break
            case "2":
                await get_sessions()
                //states.push(menu)
                break
            case "3":
                console.log("getting player state")
                states.push(menu)
                break
            case "4":
                console.log("getting leaderboard...")
                states.push(menu)
                break
            case "5":
                rl.close()
                break
        }
    })
}


const moderator_menu = () => {
    clear()
    console.log("1.start game\n2.sessions\n3.player state\n4.leaderboard\n5.questions\n6.exit")
    let command = ""

    rl.question("", async (answer_0) => {
        command = answer_0
        states.push(moderator_menu)
        switch (answer_0) {
            case "1":
                clear()
                await new_session()
                //states.push(menu)
                break
            case "2":
                await get_sessions()
                //states.push(menu)
                break
            case "3":
                console.log("getting player state")
                //states.push(menu)
                break
            case "4":
                console.log("getting leaderboard...")
                // states.push(menu)
                break
            case "5":
                await get_questions()
                break;
            case "6":
                rl.close()
                break
        }
    })
}

const q_designer_menu = () => {
    clear()
    console.log("1.start game\n2.sessions\n3.player state\n4.leaderboard\n5.design question\n6.exit")
    let command = ""

    rl.question("", async (answer_0) => {
        command = answer_0
        states.push(q_designer_menu)
        switch (answer_0) {
            case "1":
                clear()
                await new_session()
                //states.push(menu)
                break
            case "2":
                await get_sessions()
                //states.push(menu)
                break
            case "3":
                console.log("getting player state")
                //states.push(menu)
                break
            case "4":
                console.log("getting leaderboard...")
                //states.push(menu)
                break
            case "5":
                await design_question()
                break;
            case "6":
                rl.close()
                break
        }
    })
}

const admin_menu = () => {
    clear()
    console.log("1.start game\n2.sessions\n3.player state\n4.leaderboard\n5.design question\n6.questions\n7.users\n8.exit")
    let command = ""

    rl.question("", async (answer_0) => {
        command = answer_0
        states.push(admin_menu)
        switch (answer_0) {
            case "1":
                clear()
                await new_session()
                //states.push(menu)
                break
            case "2":
                await get_sessions()
                //states.push(menu)
                break
            case "3":
                console.log("getting player state")
                //states.push(menu)
                break
            case "4":
                console.log("getting leaderboard...")
                //states.push(menu)
                break
            case "5":
                await design_question()
                break;
            case "6":
                //states.push(admin_menu)
                await get_questions()
                break;
            case "7":
                await get_users()
                break;
            case "8":
                rl.close()
                break
        }
    })
}

//menu()
//signup_page()
login_page()
