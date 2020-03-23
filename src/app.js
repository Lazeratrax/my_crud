const express = require('express');
const router = require('./routers/export-routers');

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use('/users', router.userRouter)
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
    console.log('сервер грузится на localhost:' + port)
})
