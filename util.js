let totalBudget = 1000
let amountBudgeted = 0
let envelopes = [
    {food: {items: [], budget: 0, remainingBudget: 0}},
    {fun: {items: [], budget: 100, remainingBudget: 100}},
    {savings: {items: [], budget: 0, remainingBudget: 0}},
    {upkeep: {items: [], budget: 0, remainingBudget: 0}}
]

const invalidAmount = 'This item puts this envelope over budget'
const duplicateItem = 'This item already exists'

function checkName(name) {
    const result =  envelopes.filter(x => x.hasOwnProperty(name))
    return (result.length > 0)
}

function checkItemName(envelope, itemName) {
    console.log(envelope.items)
    for (let item of envelope.items) {
        if (item.name === itemName) {
            return false
        }
    }
    return true
}

function updateItem(index, dict) {
    const envelope = envelopes[index]
    const name = Object.keys(envelope)[0]
    if (!checkItemName(envelope[name], dict.name))
        return duplicateItem
    if (checkBudget(envelope[name].remainingBudget, dict.amount)) {
        envelope[name].remainingBudget -= dict.amount
        totalBudget -= dict.amount
        envelope[name].items.push(dict)
        return envelopes[index]
    } else {
        return false
    }
}

function checkBudget(envBudget, amount) {
    return (totalBudget - amount >= 0 && envBudget - amount >= 0)
}

module.exports = {
    checkName,
    updateItem,
    invalidAmount,
    duplicateItem,
    totalBudget,
    amountBudgeted,
    envelopes
}