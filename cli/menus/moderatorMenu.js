import { Input } from "../utils/input.js"
import { new_session } from "../controllers/sessionController.js"
import { get_sessions } from "../controllers/sessionController.js"
import { get_player_stats } from "../controllers/userController.js"
import { get_leaderboard } from "../controllers/userController.js"
import { get_questions } from "../controllers/questionController.js"
import { clear } from "console"
import { states } from "../config/settings.js"
import { exit } from "process"

export const moderator_menu = async () => {
    clear()
    console.log("1.start game\n2.sessions\n3.player state\n4.leaderboard\n5.questions\n6.exit")
    const command = await Input("")



    states.push(moderator_menu)
    switch (command) {
        case "1":
            clear()
            await new_session()
            break
        case "2":
            await get_sessions()
            break
        case "3":
            await get_player_stats()
            break
        case "4":
            await get_leaderboard()
            break
        case "5":
            await get_questions()
            break;
        case "6":
            exit()
    }

}
