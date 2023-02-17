const whiteList = [
    "https://www.yoursite.com",
    "http://127.0.0.1",
    "http://localhost:3500"
]

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not Allowed By CORS"))
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions