let totalBudget = 1000
let remainingBudget = 900
let envelopes = [
    {food: {items: [{name: 'test', amount: 50}], budget: 100, remainingBudget: 50}},
    {fun: {items: [{name: 'test', amount: 40}], budget: 100, remainingBudget: 60}},
    {savings: {items: [], budget: 0, remainingBudget: 0}},
    {upkeep: {items: [], budget: 0, remainingBudget: 0}}
]

// Error messages
const invalidAmount = 'This item puts this envelope over budget'
const duplicateItem = 'This item already exists'

// Check to see if an envelope name already exists
function checkName(name) {
    const result =  envelopes.filter(x => x.hasOwnProperty(name))
    return (result.length > 0)
}

// Check to see if an item name within a specific envelope exists
function checkItemName(envelope, itemName) {
    for (let item of envelope.items) {
        if (item.name === itemName) {
            return false
        }
    }
    return true
}


// Check to see if a new item will go over budget
function checkBudget(envBudget, amount) {
    return (remainingBudget - amount >= 0 && envBudget - amount >= 0)
}

// Returns total and remaining budgets
function displayBudget() {
    return {
        'Total Budget': totalBudget,
        'Remaining Budget': remainingBudget
    }
}

// Adds a new item to a specific envelope
function addItem(index, dict) {
    const envelope = envelopes[index]
    const name = Object.keys(envelope)[0]
    if (!checkItemName(envelope[name], dict.name))
        return duplicateItem
    if (checkBudget(envelope[name].remainingBudget, dict.amount)) {
        envelope[name].remainingBudget -= dict.amount
        remainingBudget -= dict.amount
        envelope[name].items.push(dict)
        return envelopes[index]
    } else {
        return false
    }
}

// Updates total and remaining budgets
function updateTotalBudget(amount) {
    if (amount >= remainingBudget) {
        const diff = totalBudget - remainingBudget
        totalBudget = amount
        remainingBudget = totalBudget - diff
        return true
    } else {
        return false
    }
}

// Updates item in envelope items array
function updateItem(envIndex, dict) {
    const envelope = envelopes[envIndex]
    const name = Object.keys(envelope)[0]
    for (let item of envelope[name].items) {
        if (item.name === dict.name) {
            diff = item.amount - dict.amount
            if (dict.newName) {
                item.name = dict.newName
            }
            if (checkBudget(envelope[name].remainingBudget, diff) && dict.amount) {
                const diff = item.amount - dict.amount
                item.amount = dict.amount
                envelope[name].remainingBudget += diff
            }
            return true
        }
    }
    return false
}

// Updates item name and/or amount so long as it does not go over budget
function updateEnvBudget(envIndex, amount) {
    const envelope = envelopes[envIndex]
    const name = Object.keys(envelope)[0]
    const diff = amount - envelope[name].budget
    console.log(diff)
    if (envelope[name].remainingBudget + diff >= 0 && remainingBudget + diff >= 0) {
        envelope[name].budget = amount 
        envelope[name].remainingBudget += diff
        remainingBudget -= diff
        return true
    } else {
        return false
    }
}

// Deletes entire envelope
function deleteEnvelope(envIndex) {
    envelopes.splice(envIndex, 1)
}

// Deletes item from envelope
function deleteItem(envIndex, itemName) {
    const envelope = envelopes[envIndex]
    const name = Object.keys(envelope)[0]
    for (let item of envelope[name].items) {
        if (item.name === itemName) {
            const index = envelope[name].items.indexOf(item)
            envelope[name].remainingBudget += item.amount
            envelope[name].items.pop(index)
            return envelope
        }
    }
    return false
}

// Transfers an a budget amount from one envelope to another
function transferFunds(dict) {
    let fromDict = envelopes.filter(x => x.hasOwnProperty(dict.fromName))[0]
    let toDict = envelopes.filter(x => x.hasOwnProperty(dict.toName))[0]
    if (fromDict[dict.fromName].remainingBudget - dict.amount >= 0) {
        fromDict[dict.fromName].remainingBudget -= dict.amount 
        fromDict[dict.fromName].budget -= dict.amount
        toDict[dict.toName].remainingBudget += dict.amount
        toDict[dict.toName].budget += dict.amount
        return [fromDict, toDict]
    }
}

module.exports = {
    checkName,
    addItem,
    displayBudget,
    updateTotalBudget,
    updateItem,
    updateEnvBudget,
    deleteEnvelope,
    deleteItem,
    transferFunds,
    invalidAmount,
    duplicateItem,
    envelopes
}