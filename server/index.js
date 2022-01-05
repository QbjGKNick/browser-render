const express = require('express')
const app = express()

app.use(express.static('public'))
app.listen(8002, () => {
    console.log('server started at 8002');
})