import { apiCall } from "../services/apiClient.js"
import { API_CONFIG, ROUTES, states } from "../config/settings.js"
import { menu } from "../menus/regularMenu.js"
import { admin_menu } from "../menus/adminMenu.js"
import { q_designer_menu } from "../menus/designerMenu.js"
import { moderator_menu } from "../menus/moderatorMenu.js"
import { Input } from "../utils/input.js"
import { clear } from "console"

export const userInfo = {}
export const login = async () => {
    clear()
    let email = ""
    let password = ""

    console.log("don't have an account?")
    const haveAccount = await Input("")

    if (haveAccount == "yes") {

        const email = await Input("email: ")


        const password = await Input("password: ")

        const postData = {
            "email": email,
            "password": password
        }

        const result = await apiCall(API_CONFIG.BASE_URL + ROUTES.LOGIN, 'POST', '', postData)
        const { user, userRoles, token } = await result.json()
        result.headers.forEach(e => {
            if (e.startsWith("refresh-token")) {
                userInfo.refreshToken = e.replace("refresh-token", "refreshToken")
            }
        })

        userInfo.data = user
        userInfo.roles = userRoles
        userInfo.token = token

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
        }

    } else {
        await signup()
    }

}

export const signup = async () => {
    clear()

    const email = ""
    const password = ""
    const username = ""


    username = await Input("username: ")

    email = await Input("email: ")

    password = await Input("password: ")

    const postData = JSON.stringify({
        "username": username,
        "email": email,
        "password": password
    })

    const result = await apiCall(API_CONFIG.BASE_URL + ROUTES.SIGNUP, 'POST', '', postData)
    const { newUser, token } = await result.json()
    result.headers.forEach(e => {
        if (e.startsWith("refresh-token")) {
            userInfo.refreshToken = e.replace("refresh-token", "refreshToken")
        }
    })

    userInfo.data = newUser
    userInfo.auth_token = token
    menu()
}