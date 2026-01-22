document.addEventListener('DOMContentLoaded', function() {
    // Interaktīvās spēles simulācijas mainīgie
    let score = 0;
    let lives = 3;
    let level = 1;
    let gameActive = false;
    let coinInserted = false;
    
    // DOM elementi
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const pacmanElement = document.querySelector('.pacman');
    const dots = document.querySelectorAll('.dot');
    const ghosts = document.querySelectorAll('.ghost');
    
    // Kontrolpogu elementi
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const insertCoinBtn = document.getElementById('insert-coin');
    const startGameBtn = document.getElementById('start-game');
    const resetGameBtn = document.getElementById('reset-game');
    
    // Pac-Man pozīcija
    let pacmanRow = 4;
    let pacmanCol = 2;
    
    // Inicializēšana
    function init() {
        updateDisplay();
        setupEventListeners();
    }
    
    // Atjaunina spēles displeju
    function updateDisplay() {
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        levelElement.textContent = level;
    }
    
    // Iestata notikumu klausītājus
    function setupEventListeners() {
        // Kontrolpogu notikumi
        upBtn.addEventListener('click', () => movePacman(-1, 0));
        downBtn.addEventListener('click', () => movePacman(1, 0));
        leftBtn.addEventListener('click', () => movePacman(0, -1));
        rightBtn.addEventListener('click', () => movePacman(0, 1));
        
        // Taustiņu vadība
        document.addEventListener('keydown', function(event) {
            if (!gameActive) return;
            
            switch(event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    movePacman(-1, 0);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    movePacman(1, 0);
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    movePacman(0, -1);
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    movePacman(0, 1);
                    break;
            }
        });
        
        // Spēles darbību pogas
        insertCoinBtn.addEventListener('click', insertCoin);
        startGameBtn.addEventListener('click', startGame);
        resetGameBtn.addEventListener('click', resetGame);
    }
    
    // Iemest monētu
    function insertCoin() {
        if (!coinInserted) {
            coinInserted = true;
            insertCoinBtn.innerHTML = '<i class="fas fa-check"></i> Monēta iemesta';
            insertCoinBtn.style.backgroundColor = '#27ae60';
            
            // Spēlē monētas skaņu
            playSound('coin');
            
            // Paziņojums
            showMessage('Monēta iemesta! Nospiediet "Sākt spēli"');
        }
    }
    
    // Sākt spēli
    function startGame() {
        if (!coinInserted) {
            showMessage('Vispirms iemetiet monētu!');
            return;
        }
        
        if (!gameActive) {
            gameActive = true;
            startGameBtn.innerHTML = '<i class="fas fa-pause"></i> Pauzēt spēli';
            startGameBtn.style.backgroundColor = '#f39c12';
            
            // Spēlē starta skaņu
            playSound('start');
            
            // Atiestata Pac-Man pozīciju
            resetPacmanPosition();
            
            showMessage('Spēle sākta! Izmantojiet bulttaustiņus, lai vadītu Pac-Man');
        } else {
            // Pauzē spēli
            gameActive = false;
            startGameBtn.innerHTML = '<i class="fas fa-play"></i> Turpināt spēli';
            startGameBtn.style.backgroundColor = '#4ecdc4';
            showMessage('Spēle pauzēta');
        }
    }
    
    // Atiestatīt spēli
    function resetGame() {
        score = 0;
        lives = 3;
        level = 1;
        gameActive = false;
        coinInserted = false;
        
        insertCoinBtn.innerHTML = '<i class="fas fa-coins"></i> Iemest monētu';
        insertCoinBtn.style.backgroundColor = '#4ecdc4';
        
        startGameBtn.innerHTML = '<i class="fas fa-play"></i> Sākt spēli';
        startGameBtn.style.backgroundColor = '#4ecdc4';
        
        // Atjauno punktus
        dots.forEach(dot => {
            dot.style.display = 'block';
        });
        
        // Atjauno spoku pozīcijas
        ghosts.forEach(ghost => {
            ghost.style.display = 'block';
        });
        
        resetPacmanPosition();
        updateDisplay();
        showMessage('Spēle atiestatīta. Iemetiet monētu, lai sāktu');
    }
    
    // Pārvietot Pac-Man
    function movePacman(rowChange, colChange) {
        if (!gameActive) {
            showMessage('Vispirms sāciet spēli!');
            return;
        }
        
        // Jauna pozīcija
        const newRow = pacmanRow + rowChange;
        const newCol = pacmanCol + colChange;
        
        // Pārbauda, vai jauna pozīcija ir iekšā laukumā
        if (newRow >= 1 && newRow <= 8 && newCol >= 1 && newCol <= 10) {
            pacmanRow = newRow;
            pacmanCol = newCol;
            
            // Atjauno Pac-Man pozīciju CSS grid
            pacmanElement.style.gridRow = pacmanRow;
            pacmanElement.style.gridColumn = pacmanCol;
            
            // Pārbauda, vai apēsts punkts
            checkDotCollision();
            
            // Pārbauda, vai sadursme ar spoku
            checkGhostCollision();
            
            // Spēlē kustības skaņu
            playSound('move');
            
            // Maina Pac-Man virzienu
            updatePacmanDirection(rowChange, colChange);
        }
    }
    
    // Pārbauda, vai Pac-Man apēdis punktu
    function checkDotCollision() {
        dots.forEach((dot, index) => {
            const dotRow = parseInt(getComputedStyle(dot).gridRow);
            const dotCol = parseInt(getComputedStyle(dot).gridColumn);
            
            if (pacmanRow === dotRow && pacmanCol === dotCol && dot.style.display !== 'none') {
                // Punkts apēsts
                dot.style.display = 'none';
                score += 10;
                updateDisplay();
                playSound('eat');
                
                // Pārbauda, vai visi punkti apēsti
                const allDotsEaten = Array.from(dots).every(dot => dot.style.display === 'none');
                if (allDotsEaten) {
                    levelUp();
                }
            }
        });
    }
    
    // Pārbauda, vai sadursme ar spoku
    function checkGhostCollision() {
        ghosts.forEach(ghost => {
            const ghostRow = parseInt(getComputedStyle(ghost).gridRow);
            const ghostCol = parseInt(getComputedStyle(ghost).gridColumn);
            
            if (pacmanRow === ghostRow && pacmanCol === ghostCol && ghost.style.display !== 'none') {
                // Sadursme ar spoku
                lives--;
                updateDisplay();
                playSound('death');
                
                if (lives <= 0) {
                    gameOver();
                } else {
                    showMessage(`Sadursme ar spoku! Atlikušās dzīvības: ${lives}`);
                    resetPacmanPosition();
                }
            }
        });
    }
    
    // Pac-Man līmenis paaugstinās
    function levelUp() {
        level++;
        score += 100; // Bonusa punkti par līmeni
        updateDisplay();
        
        // Atjauno punktus
        dots.forEach(dot => {
            dot.style.display = 'block';
        });
        
        showMessage(`Līmenis ${level} sasniegts! +100 punkti`);
        playSound('level');
    }
    
    // Spēle beigusies
    function gameOver() {
        gameActive = false;
        startGameBtn.innerHTML = '<i class="fas fa-play"></i> Sākt spēli';
        startGameBtn.style.backgroundColor = '#4ecdc4';
        
        showMessage(`Spēle beigusies! Jūsu rezultāts: ${score} punkti`);
        playSound('gameover');
    }
    
    // Atjauno Pac-Man pozīciju
    function resetPacmanPosition() {
        pacmanRow = 4;
        pacmanCol = 2;
        pacmanElement.style.gridRow = pacmanRow;
        pacmanElement.style.gridColumn = pacmanCol;
    }
    
    // Atjauno Pac-Man virzienu
    function updatePacmanDirection(rowChange, colChange) {
        // Noņem vecās klases
        pacmanElement.classList.remove('face-up', 'face-down', 'face-left', 'face-right');
        
        // Pievieno jauno virziena klasi
        if (rowChange === -1) pacmanElement.classList.add('face-up');
        if (rowChange === 1) pacmanElement.classList.add('face-down');
        if (colChange === -1) pacmanElement.classList.add('face-left');
        if (colChange === 1) pacmanElement.classList.add('face-right');
    }
    
    // Parāda ziņojumu
    function showMessage(message) {
        // Izveido vai atjauno ziņojumu elementu
        let messageElement = document.querySelector('.game-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'game-message';
            document.querySelector('.simulator-controls').prepend(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        messageElement.style.backgroundColor = '#2c3e50';
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.marginBottom = '15px';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontWeight = 'bold';
        
        // Paslēp ziņojumu pēc 3 sekundēm
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
    
    // Spēlē skaņas (simulē ar tekstu)
    function playSound(soundType) {
        const soundMessages = {
            'coin': '🪙 Monētas skaņa',
            'start': '▶️ Spēles sākuma skaņa',
            'move': '👣 Kustības skaņa',
            'eat': '🍒 Ēšanas skaņa',
            'death': '💀 Nāves skaņa',
            'level': '🎉 Līmeņa skaņa',
            'gameover': '😞 Spēles beigu skaņa'
        };
        
        // Konsolē parādam, kāda skaņa tiktu atskaņota
        console.log(`Spēlē skaņu: ${soundMessages[soundType]}`);
        
        // Reālā implementācijā šeit būtu audio failu atskaņošana
        // new Audio(`sounds/${soundType}.mp3`).play();
    }
    
    // Sākuma inicializācija
    init();
    
    // Pievieno CSS stilus Pac-Man virzieniem
    const style = document.createElement('style');
    style.textContent = `
        .pacman.face-up::after {
            top: 12px;
            left: 5px;
            border-top: 8px solid #000;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: none;
        }
        
        .pacman.face-down::after {
            top: 0;
            left: 5px;
            border-bottom: 8px solid #000;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: none;
        }
        
        .pacman.face-left::after {
            top: 5px;
            left: 12px;
            border-left: 8px solid #000;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: none;
        }
        
        .pacman.face-right::after {
            top: 5px;
            left: 0;
            border-right: 8px solid #000;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: none;
        }
    `;
    document.head.appendChild(style);
});
