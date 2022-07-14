let totalBudget = 1000
let remainingBudget = 900
let envelopes = [
    {food: {items: [], budget: 0, remainingBudget: 0}},
    {fun: {items: [], budget: 100, remainingBudget: 100}},
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
function updateItem(index, dict) {
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

const displayBudget = () => {
    return {
        'Total Budget': totalBudget,
        'Remaining Budget': remainingBudget
    }
}

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

module.exports = {
    checkName,
    updateItem,
    displayBudget,
    updateTotalBudget,
    invalidAmount,
    duplicateItem,
    envelopes
}