require('./api/config/config')
require('./api/config/db')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http')
const routes = require('./routes/index')
const passport = require('passport')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(passport.initialize())

app.get("/", (req, res) => {
    res.status(403).json({
        status: "forbidden",
        message: "Heh, mau ngapain? gaboleh masuk sini hus hus!"
    })
})

app.use("/api/v1", [routes.userRoute, routes.neatRoute])

http.createServer(app).listen(8000, console.log("server running with port 8000"))