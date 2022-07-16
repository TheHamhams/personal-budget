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
    updateEnvBudget,
    deleteEnvelope,
    deleteItem,
    transferFunds,
    duplicateItem,
    envelopes,
} = require('./util.js')

const PORT = process.env.PORT || 4001

app.use(cors())
app.use(bodyParser.json())


const apiRouter = express.Router()
app.use('/', apiRouter)

apiRouter.param('envelopeName', (req, res, next, envelopeName) => {
    const envelope = envelopes.filter(x => x.hasOwnProperty(envelopeName))[0]
    const name = Object.keys(envelope)[0]
    if (checkName(name)) {
        req.envelope = envelope
        req.index = envelopes.indexOf(envelope)
        next()
    } else {
        res.sendStatus(400)
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
    res.send(req.envelope)
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
apiRouter.post('/envelopes/items/:envelopeName/', (req, res, next) => {
    const updates = {name: req.query.itemName,
                    amount:  req.query.amount}
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

apiRouter.put('/envelopes/transfer', (req, res, next) => {
    let from = {
        fromName: req.query.fromName,
        toName: req.query.toName,
        amount: Number(req.query.amount)
    }
    const resultArr = transferFunds(from)
    if (resultArr) {
        res.send({
            from: resultArr[0],
            to: resultArr[1]
        })
    } else {
        res.sendStatus(400)
    }
})

// PUT item from specific envelope
apiRouter.put('/envelopes/:envelopeName/', (req, res, next) => {
    const itemUpdates = {name: req.query.itemName,
                    amount:  Number(req.query.amount),
                    newName: req.query.newName,
                }
    const newBudget = Number(req.query.budget)
    let budgetResult
    let itemsResult
    if (newBudget) {
        budgetResult = updateEnvBudget(req.index, newBudget)
    }
    if (itemUpdates.newName || itemUpdates.amount) {
        itemsResult = updateItem(req.index, itemUpdates)
    }
    if (budgetResult || itemsResult) {
        budgetResult = displayBudget()
        res.send({ 
            envelope: envelopes[req.index],
            'Total Budget':budgetResult['Total Budget'],
            'Remaining Budget':budgetResult['Remaining Budget'] 
        })
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


// DELETE item from an envelope
apiRouter.delete('/envelopes/:envelopeName/:itemName', (req, res, next) => {
    let result = deleteItem(req.index, req.itemName)
    if (result) {
        res.status(204).send(result)
    } else {
        res.status(400).send('Item not found')
    }
})

// DELETE envelope
apiRouter.delete('/envelopes/:envelopeName', (req, res, next) => {
    deleteEnvelope(req.index)
    res.sendStatus(204)
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))