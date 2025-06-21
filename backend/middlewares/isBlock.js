const isBlock = (req, res, next) => {

    if (!req.user.roles[0].is_blocked) {
        next()
    }
    else {
        res.status(403).json({
            status: "you are blocked"
        })
    }
};

export default isBlock