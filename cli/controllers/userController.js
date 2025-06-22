import { apiCall } from "../services/apiClient.js"
import { API_CONFIG, ROUTES, states } from "../config/settings.js"
import { Input } from "../utils/input.js"
import { userInfo } from "./authController.js"
import { clear } from "console"

export const get_users = async () => {

    clear()

    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.USERS, 'GET', userInfo.token)
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

export const block_user = async (user_id) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.BLOCK + user_id, 'POST', userInfo.token)
    if (response.status == 200) return "user blocked successfully"
}

export const unblock_user = async (user_id) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.BLOCK + user_id, 'DELETE', userInfo.token)
    if (response.status == 200) return "user unblocked successfully"
}

export const delete_role = async (user_id, role_id) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.USER_ROLE + user_id + "/" + role_id, 'DELETE', userInfo.token)
    if (response.status == 200) return "role deleted successfully"
}

export const assign_role = async (user_id, role_id) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.USER_ROLE + user_id + "/" + role_id, 'POST', userInfo.token)
    if (response.status == 200) return "role assigned successfully"
}

export const get_roles = async () => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROLES, 'GET', userInfo.token)
    const result = await response.json()
    return result
}

export const get_user_roles = async (user_id) => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.USER_ROLE + user_id, 'GET', userInfo.token)
    const result = await response.json()
    return result
}


export const get_leaderboard = async () => {

    clear()

    console.log("want to see top 5 in which period of time:")
    console.log("1.weekly   2.monthly")
    const period = await Input("")
    let url = ``
    switch (period) {
        case "1":
            url = `${API_CONFIG.BASE_URL}${ROUTES.LEADERBOARD}weekly`
            break;

        case "2":
            url = `${API_CONFIG.BASE_URL}${ROUTES.LEADERBOARD}monthly`
            break;
    }

    const response = await apiCall(url, 'GET', userInfo.token)
    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        states.pop()()
        return;
    }
    const result = await response.json()

    console.log(`| ${'Username'.padEnd(15)} | ${'XP Level'.padEnd(8)} | ${'Score'.padEnd(6)} | ${'Rank'.padEnd(5)} |`);
    console.log('-'.repeat(50));

    for (let i = 0; i < result.length; i++) {
        const { username, xp_level, score, rank } = result[i];
        console.log(`| ${username.padEnd(15)} | ${String(xp_level).padEnd(8)} | ${String(score).padEnd(6)} | ${String(rank).padEnd(5)} |`);
    }


    await Input("")
    states.pop()()
}


export const get_player_stats = async () => {
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.PLAYER_STATS + userInfo.data[0].user_id, 'GET', userInfo.token)
    const result = await response.json()

    if (response.status == 403) {
        clear()
        console.log("you are blocked")
        await Input("")
        states.pop()()
        return;
    }

    clear()
    console.log(`total games : ${result[0].total_games}`)
    console.log(`games won : ${result[0].games_won}`)
    console.log(`average accuracy (won / total) : ${result[0].average_accuracy}`)
    console.log(`xp level : ${result[0].xp_level}`)


    await Input("")
    states.pop()()
}
