document.addEventListener('DOMContentLoaded', () => {
    const playersDiv = document.getElementById('players');
    const addPlayerButton = document.getElementById('addPlayer');
    const resetAllButton = document.getElementById('resetAll');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const timerDiv = document.getElementById('timer');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const startStopTimerButton = document.getElementById('startStopTimer');
    const playerEditCard = document.getElementById('playerEditCard');
    const editPlayerNameInput = document.getElementById('editPlayerName');
    const editIncrementValueInput = document.getElementById('editIncrementValue');
    const editResetValueInput = document.getElementById('editResetValue');
    const savePlayerEditButton = document.getElementById('savePlayerEdit');
    const cancelPlayerEditButton = document.getElementById('cancelPlayerEdit');

    let players = JSON.parse(localStorage.getItem('players')) || [];
    let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    let timerInterval;
    let timeInSeconds = 0;
    let timerRunning = false;
    let editingIndex = -1;

    function createPlayerElement(player, index) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const nameSpan = document.createElement('h2');
        nameSpan.textContent = `${player.name}: `;
        const scoreSpan = document.createElement('span');
        scoreSpan.id = `score-${index}`;
        scoreSpan.textContent = player.score;
        nameSpan.appendChild(scoreSpan);

        const incrementButton = document.createElement('button');
        incrementButton.textContent = '+';
        incrementButton.addEventListener('click', () => incrementScore(index));

        const decrementButton = document.createElement('button');
        decrementButton.textContent = '-';
        decrementButton.addEventListener('click', () => decrementScore(index));

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.addEventListener('click', () => resetScore(index));

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removePlayer(index));

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editPlayer(index));

        playerDiv.appendChild(nameSpan);
        playerDiv.appendChild(incrementButton);
        playerDiv.appendChild(decrementButton);
        playerDiv.appendChild(resetButton);
        playerDiv.appendChild(removeButton);
        playerDiv.appendChild(editButton);

        return playerDiv;
    }

    function renderPlayers() {
        playersDiv.innerHTML = '';
        players.forEach((player, index) => {
            playersDiv.appendChild(createPlayerElement(player, index));
        });
    }

    function incrementScore(index) {
        const incrementValue = players[index].incrementValue || 1;
        players[index].score += incrementValue;
        updateLocalStorage();
        renderPlayers();
    }

    function decrementScore(index) {
        const incrementValue = players[index].incrementValue || 1;
        players[index].score -= incrementValue;
        updateLocalStorage();
        renderPlayers();
    }

    function resetScore(index) {
        const resetValue = players[index].resetValue || 0;
        players[index].score = resetValue;
        updateLocalStorage();
        renderPlayers();
    }

    function removePlayer(index) {
        players.splice(index, 1);
        updateLocalStorage();
        renderPlayers();
    }

    function editPlayer(index) {
        editingIndex = index;
        editPlayerNameInput.value = players[index].name;
        editIncrementValueInput.value = players[index].incrementValue || 1;
        editResetValueInput.value = players[index].resetValue || 0;
        playerEditCard.style.display = 'block';
    }

    addPlayerButton.addEventListener('click', () => {
        editingIndex = -1;
        editPlayerNameInput.value = `Player ${players.length + 1}`;
        editIncrementValueInput.value = 1;
        editResetValueInput.value = 0;
        playerEditCard.style.display = 'block';
    });

    savePlayerEditButton.addEventListener('click', () => {
        const playerName = editPlayerNameInput.value;
        const incrementValue = parseInt(editIncrementValueInput.value) || 1;
        const resetValue = parseInt(editResetValueInput.value) || 0;

        if (editingIndex === -1) {
            players.push({ name: playerName, score: 0, incrementValue, resetValue });
        } else {
            players[editingIndex].name = playerName;
            players[editingIndex].incrementValue = incrementValue;
            players[editingIndex].resetValue = resetValue;
        }

        updateLocalStorage();
        renderPlayers();
        playerEditCard.style.display = 'none';
    });

    cancelPlayerEditButton.addEventListener('click', () => {
        playerEditCard.style.display = 'none';
    });

    resetAllButton.addEventListener('click', () => {
        players.forEach(player => player.score = 0);
        updateLocalStorage();
        renderPlayers();
    });

    function updateLocalStorage() {
        localStorage.setItem('players', JSON.stringify(players));
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        minutesSpan.textContent = String(minutes).padStart(2, '0');
        secondsSpan.textContent = String(seconds).padStart(2, '0');
    }

    function startStopTimer() {
        if (timerRunning) {
            clearInterval(timerInterval);
            startStopTimerButton.textContent = 'Start';
        } else {
            timerInterval = setInterval(() => {
                timeInSeconds++;
                updateTimerDisplay();
            }, 1000);
            startStopTimerButton.textContent = 'Stop';
        }
        timerRunning = !timerRunning;
    }

    startStopTimerButton.addEventListener('click', startStopTimer);

    renderPlayers();
});