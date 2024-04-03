const diceCountParagraph = document.getElementById('diceCount')
const modalCloseButton = document.querySelector('.modalClose')
const diceSelection = document.querySelector('.diceSelection')
const selectButton = document.getElementById('selectButton')
const chooseButton = document.getElementById('chooseButton')
const modalContent = document.querySelector('.modalContent')
const cubesParagraph = document.querySelector('fieldset p')
const resultContainer = document.querySelector('.result')

chooseButton.addEventListener('click', openModal)

function generateDice() {
    diceSelection.innerHTML = ''
    for (let i = 2; i <= 32; i++) {
        const dice = document.createElement('div')
        dice.classList.add('dice')
        dice.textContent = i
        diceSelection.appendChild(dice)
    }
}

function selectDice(event) {
    const selectedDice = event.target
    if (selectedDice.classList.contains('dice')) {
        if (selectedDice.classList.contains('selected')) {
            selectedDice.classList.remove('selected')
            selectedDice.style.backgroundColor = ''
        } else {
            const selectedDiceCount = diceSelection.querySelectorAll('.selected').length
            if (selectedDiceCount < 10) {
                selectedDice.classList.add('selected')
                selectedDice.style.backgroundColor = '#00c220'
            } else {
                alert('Можна обрати максимум 10 кубиків')
            }
        }
    }
}

selectButton.addEventListener('click', () => {
    const selectedDice = diceSelection.querySelectorAll('.selected')
    const selectedDiceValues = Array.from(selectedDice).map(dice => dice.textContent)
    if(selectedDiceValues.length > 0){
        cubesParagraph.textContent = `${selectedDiceValues.join(', ')}`
    }else {cubesParagraph.textContent = `Кубики - не вибрано`}
    closeModal()
});

modalCloseButton.addEventListener('click', () => {
    closeModal()
});

diceSelection.addEventListener('click', selectDice)

function openModal() {
    const modalBackground = document.querySelector('.modalBackground')
    modalBackground.style.display = 'block'
    modalContent.style.display = 'block'
    generateDice()
}

function closeModal() {
    const modalBackground = document.querySelector('.modalBackground')
    modalBackground.style.display = 'none'
}

function createDice() {
    resultContainer.innerHTML = ''
    const selectedDiceCount = document.querySelectorAll('.selected').length
    if (selectedDiceCount === 0) {
        diceCountParagraph.textContent = `Кубики - не вибрано`
        return
    }
    for (let i = 0; i < selectedDiceCount; i++) {
        const dice = document.createElement('div')
        dice.classList.add('dice')
        const maxDiceValue = parseInt(document.querySelectorAll('.selected')[i].textContent)
        const randomNumber = Math.floor(Math.random() * maxDiceValue) + 1
        dice.textContent = randomNumber.toLocaleString()
        resultContainer.appendChild(dice)
    }
}

window.addEventListener('load', createDice)
document.getElementById('generation').addEventListener('click', createDice)