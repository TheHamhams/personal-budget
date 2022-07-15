let totalBudget = 1000
let remainingBudget = 900
let envelopes = [
    {food: {items: [], budget: 0, remainingBudget: 0}},
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

// Returns total and remaining budget
function displayBudget() {
    return {
        'Total Budget': totalBudget,
        'Remaining Budget': remainingBudget
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

module.exports = {
    checkName,
    addItem,
    displayBudget,
    updateTotalBudget,
    updateItem,
    updateEnvBudget,
    invalidAmount,
    duplicateItem,
    totalBudget,
    remainingBudget,
    envelopes
}