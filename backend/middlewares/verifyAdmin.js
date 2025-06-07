

const verifyAdmin = async (req, res, next) => {
    const { roles } = req.user
    if (roles && roles.includes("admin")) {
        next()
    }
    else {
        throw new Error("requierd admin role")
    }
}

export default verifyAdmin