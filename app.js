const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const {
    checkName,
    updateItem,
    invalidAmount,
    duplicateItem,
    totalBudget,
    amountBudgeted,
    envelopes
} = require('./util.js');


const PORT = process.env.PORT || 4001

app.use(cors())
app.use(bodyParser.json())





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

apiRouter.param('amount', (req, res, next, amount) => {
    amount = Number(amount)
    if (amount > 0) {
        req.amount = amount
        next()
    } else {
        res.status(404).send('Invalid amount')
    }
})

apiRouter.param('itemName', (req, res, next, name) => {
    name = String(name)
    if (name) {
        req.itemName = name
        next()
    } else {
        res.status(400).send('Invalid item name')
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

apiRouter.post('/:envelopeName/:itemName/:amount', (req, res, next) => {
    const updates = {name: req.itemName,
                    amount:  req.amount}
    const updatedEnvelope = updateItem(req.index, updates)
    if (updatedEnvelope === duplicateItem) {
        res.status(400).send(duplicateItem)
    }
    else if (updatedEnvelope) {
        res.send(updatedEnvelope)
    } else {
        res.sendStatus(400)
    }
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))