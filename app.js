const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

module.exports = app

const PORT = process.env.PORT || 4001

app.use(cors())
app.use(bodyParser.json())

let totalBudget = 0
let ammountBudgeted = 0
let envelopes = [
    {food: {items: [], budget: 0, idCount: 0}},
    {fun: {items: [], budget: 0, idCount: 0}},
    {savings: {items: [], budget: 0, idCount: 0}},
    {upkeep: {items: [], budget: 0, idCount: 0}}
]

const apiRouter = express.Router()
app.use('/envelopes', apiRouter)


apiRouter.get('/', (req, res, next) => {
    res.send(envelopes)
})


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))