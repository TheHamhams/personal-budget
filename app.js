const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 4001

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.send('Ello Govna')
})





app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))