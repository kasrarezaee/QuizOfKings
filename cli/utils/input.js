import readline from "readline"
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

export const Input = (query) => {
    return new Promise(resolve => {
        rl.question(query, resolve)
    })
}