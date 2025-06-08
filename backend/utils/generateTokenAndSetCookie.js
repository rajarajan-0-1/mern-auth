const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie("jwtToken", token, {
        httpOnly: true, // xss attack
        secure: process.env.NODE_ENV === "production", // bcuz localhost - http , production - https
        sameStrict: "strict", // csrf attack
        sameAge: 7 + 24 * 60 * 60 * 1000
    })

    return token;
}

module.exports = generateTokenAndSetCookie;