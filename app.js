const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const {
    checkName,
    addItem,
    displayBudget,
    updateTotalBudget,
    updateItem,
    invalidAmount,
    duplicateItem,
    envelopes
} = require('./util.js')

const PORT = process.env.PORT || 4001

app.use(cors())
app.use(bodyParser.json())



const apiRouter = express.Router()
app.use('/', apiRouter)

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


// GET all envelopes
apiRouter.get('/envelopes', (req, res, next) => {
    res.send(envelopes)
})


// GET envelope by it's name
apiRouter.get('/envelopes/:envelopeName', (req, res, next) => {
    res.send([req.envelope, req.index])
})

// GET total budget
apiRouter.get('/budget', (req, res, next) => {
    res.send(displayBudget())
})

// POST a new blank envelope
apiRouter.post('/envelopes/new/:newEnv', (req, res, next) => {
    const envName = req.params.newEnv
    if (!checkName(envName)) {
        envelopes.push({envName: {items: [], budget: 0, remainingBudget: 0}})
        res.send(envelopes)
    } else if (checkName) {
        res.status(400).send(`${envName} already exists.`)
    }
})

// POST a new item into an existing envelope
apiRouter.post('/envelopes/items/:envelopeName/:itemName/:amount', (req, res, next) => {
    const updates = {name: req.itemName,
                    amount:  req.amount}
    const updatedEnvelope = addItem(req.index, updates)
    if (updatedEnvelope === duplicateItem) {
        res.status(400).send(duplicateItem)
    }
    else if (updatedEnvelope) {
        res.send(updatedEnvelope)
    } else {
        res.sendStatus(400)
    }
})

// PUT item from specific envelope
apiRouter.put('/envelopes/items/:envelopeName/:itemName/:amount', (req, res, next) => {
    const updates = {name: req.itemName,
                    amount:  req.amount}
    result = updateItem(req.index, updates)
    if (result) {
        res.send(result)
    } else {
        res.sendStatus(400)
    }
})

// PUT total budget
apiRouter.put('/budget/:amount', (req, res, next) => {
    const result = updateTotalBudget(req.amount)
    if (result) {
        res.send(displayBudget())
    } else {
        res.status(400).send('New total is less than the remaining budget.')
    }
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))