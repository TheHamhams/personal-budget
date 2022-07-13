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

function checkName(name) {
    const result =  envelopes.filter(x => x.hasOwnProperty(name))
    return (result.length > 0)
}


const apiRouter = express.Router()
app.use('/envelopes', apiRouter)

apiRouter.param('envelopeName', (req, res, next, envelopeName) => {
    const envArr = envelopes.filter(x => x.hasOwnProperty(envelopeName))[0]
    const name = Object.keys(envArr)[0]
    if (checkName(name)) {
        req.envelope = envArr
        req.index = envelopes.indexOf(envArr)
        next()
    } else {
        res.sendStatus(400)
    }
})

apiRouter.get('/', (req, res, next) => {
    res.send(envelopes)
})

apiRouter.get('/:envelopeName', (req, res, next) => {
    res.send([req.envelope, req.index])
})

apiRouter.post('/:newName', (req, res, next) => {
    const envName = req.params.newName
    if (!checkName(envName)) {
        envelopes.push({envName: {items: [], budget: 0, idCount: 0}})
        res.send(envelopes)
    } else if (checkName) {
        res.status(400).send(`${envName} already exists.`)
    }
}) 

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))