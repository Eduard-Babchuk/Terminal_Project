const containerStatistic = document.querySelector('.containerStatistic')
const clearDataButton = document.getElementById('clearDataButton')
const throwDataContainer = document.querySelector('.throwData')
const diceCountParagraph = document.getElementById('diceCount')
const statisticsButton = document.getElementById('statistics')
const modalCloseButton = document.querySelector('.modalClose')
const diceSelection = document.querySelector('.diceSelection')
const selectButton = document.getElementById('selectButton')
const chooseButton = document.getElementById('chooseButton')
const modalContent = document.querySelector('.modalContent')
const searchButton = document.getElementById('searchButton')
const cubesParagraph = document.querySelector('fieldset p')
const resultContainer = document.querySelector('.result')
const throwTable = document.getElementById('throwTable')

const currentTime = new Date()
let selectedDiceValues = []
let diceRollsData = {}

function generateDice() {
    diceSelection.innerHTML = ''
    for (let i = 2; i <= 32; i++) {
        const dice = document.createElement('div')
        dice.classList.add('dice')
        dice.textContent = i
        if (selectedDiceValues.includes(i)) {
            dice.classList.add('selected')
            dice.style.backgroundColor = '#00c220'
        }
        diceSelection.appendChild(dice)
    }
}

function openStatisticsModal() {
    const modalBackground = document.querySelector('.modalBackground')
    modalBackground.style.display = 'block'
    modalContent.style.display = 'none'
    containerStatistic.style.display = 'block'
    displayDiceRollsInModal()
}

function selectDice(event) {
    const selectedDice = event.target
    if (selectedDice.classList.contains('dice')) {
        if (selectedDice.classList.contains('selected')) {
            const index = selectedDiceValues.indexOf(parseInt(selectedDice.textContent))
            selectedDiceValues.splice(index, 1)
            selectedDice.classList.remove('selected')
            selectedDice.style.backgroundColor = ''
        } else {
            const selectedDiceCount = diceSelection.querySelectorAll('.selected').length
            if (selectedDiceCount < 10) {
                selectedDiceValues.push(parseInt(selectedDice.textContent))
                selectedDice.classList.add('selected')
                selectedDice.style.backgroundColor = '#00c220'
            } else {
                alert('Можна обрати максимум 10 кубиків')
            }
        }
    }
}

function openModal() {
    const modalBackground = document.querySelector('.modalBackground')
    modalBackground.style.display = 'block'
    modalContent.style.display = 'block'
    containerStatistic.style.display = 'none'
    generateDice()
}

function closeModal() {
    const modalBackground = document.querySelector('.modalBackground')
    modalBackground.style.display = 'none'
}

function createDice() {
    resultContainer.innerHTML = ''
    const selectedDiceCount = document.querySelectorAll('.selected').length
    const currentTime = new Date()

    diceRollsData = {}

    if (selectedDiceCount === 0) {
        diceCountParagraph.textContent = `Кубики - не вибрано`
        return
    }

    diceRollsData['roll_date'] = currentTime.toISOString()

    for (let i = 0; i < selectedDiceCount; i++) {
        const dice = document.createElement('div')
        dice.classList.add('dice')

        const maxDiceValue = parseInt(document.querySelectorAll('.selected')[i].textContent)
        const randomNumber = Math.floor(Math.random() * maxDiceValue) + 1

        dice.textContent = randomNumber.toLocaleString()
        resultContainer.appendChild(dice)

        diceRollsData[`dice${i + 1}`] = maxDiceValue
        diceRollsData[`res${i + 1}`] = randomNumber
    }

    for (let i = selectedDiceCount + 1; i <= 10; i++) {
        diceRollsData[`dice${i}`] = null
        diceRollsData[`res${i}`] = null
    }
    
    fetch('http://Localhost:8000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(diceRollsData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        console.log('Dice rolls data successfully sent to server')
    })
    .catch(error => {
        console.error('Error sending dice rolls data to server:', error.message)
    });
}

async function fetchDiceRollsData() {
    try {
        const response = await fetch('http://localhost:8000/dice_rolls')
        if (!response.ok) {
            throw new Error('Failed to fetch dice rolls data')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching dice rolls data:', error.message)
    }
}

async function displayDiceRollsInModal() {
    try {
        const diceRollsData = await fetchDiceRollsData()
        const tableBody = throwTable.querySelector('tbody')

        tableBody.innerHTML = ''

        diceRollsData.forEach(roll => {
            const row = document.createElement('tr')
            const rollDateCell = document.createElement('td')
            rollDateCell.textContent = new Date(roll.roll_date).toLocaleString()
            row.appendChild(rollDateCell)

            for (let i = 1; i <= 10; i++) {
                const diceCell = document.createElement('td')
                diceCell.textContent = roll[`dice${i}`] || '-'
                const resultCell = document.createElement('td')
                resultCell.textContent = roll[`res${i}`] || '-'
                row.appendChild(diceCell)
                row.appendChild(resultCell)
            }
            tableBody.insertBefore(row, tableBody.firstChild)
        })
    } catch (error) {
        console.error('Error displaying dice rolls data:', error.message)
    }
}

function searchTable() {
    const dateInput = document.getElementById('dateInput').value.toLowerCase()
    const faceOfDiceInput = document.getElementById('faceOfDiceInput').value.toLowerCase()
    const resultOfRoll = document.getElementById('resultOfRoll').value.toLowerCase()

    const rows = document.querySelectorAll('#throwTable tbody tr')
    const notFoundMessage = document.getElementById('notFoundMessage')

    let found = false

    rows.forEach(row => {
        const dateCell = row.querySelector('td:nth-child(1)').textContent.toLowerCase()
        const facesCells = Array.from(row.querySelectorAll('td:nth-child(2), td:nth-child(4), td:nth-child(6), td:nth-child(8), td:nth-child(10), td:nth-child(12), td:nth-child(14), td:nth-child(16), td:nth-child(18)')).map(cell => cell.textContent.toLowerCase())
        const resultCells = Array.from(row.querySelectorAll('td:nth-child(3), td:nth-child(5), td:nth-child(7), td:nth-child(9), td:nth-child(11), td:nth-child(13), td:nth-child(15), td:nth-child(17), td:nth-child(19)')).map(cell => cell.textContent.toLowerCase())

        const dateMatch = dateInput === '' || dateCell.includes(dateInput)
        const faceMatch = faceOfDiceInput === '' || facesCells.some(face => face === faceOfDiceInput);
        const resultMatch = resultOfRoll === '' || resultCells.some(result => result === resultOfRoll);

        
        
        if (dateMatch && faceMatch && resultMatch) {
            row.style.display = ''
            found = true
        } else {
            row.style.display = 'none'
        }
    })

    if (!found) {
        notFoundMessage.innerText = "Немає відповідних результатів пошуку"
    } else {
        notFoundMessage.innerText = ""
    }
}

chooseButton.addEventListener('click', openModal)
statisticsButton.addEventListener('click', openStatisticsModal)

diceSelection.addEventListener('click', selectDice)
selectButton.addEventListener('click', () => {
    const selectedDice = diceSelection.querySelectorAll('.selected')
    const selectedDiceValues = Array.from(selectedDice).map(dice => dice.textContent)
    if(selectedDiceValues.length > 0){
        cubesParagraph.textContent = `${selectedDiceValues.join(', ')}`
        resultContainer.innerHTML = ''
    }else {
        cubesParagraph.textContent = `Кубики - не вибрано`
    }
    closeModal()
})

modalCloseButton.addEventListener('click', () => {
    selectedDiceValues = []
    diceSelection.querySelectorAll('.selected').forEach(dice => {
        dice.classList.remove('selected')
        dice.style.backgroundColor = ''
    })
    cubesParagraph.textContent = `Кубики - не вибрано`
    resultContainer.innerHTML = ''
    closeModal()
})

searchButton.addEventListener('click', searchTable)

window.addEventListener('load', createDice)
document.getElementById('generation').addEventListener('click', async () => {
    const selectedDice = diceSelection.querySelectorAll('.selected')
    if (selectedDice.length > 0) {
        createDice()
        await sendThrowData()
    } else {
        cubesParagraph.textContent = 'Кубики - не вибрано'
    }
})