class Game {
    constructor() {
        this.playerName = "";
        this.chosenNumber = null;
        this.currentStep = null;
        this.score = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        const savedState = this.loadGameState();
        if (savedState) {
            this.playerName = savedState.playerName;
            this.chosenNumber = savedState.chosenNumber;
            this.currentStep = savedState.currentStep;
            this.score = savedState.score || 0;
            this.currentStreak = savedState.currentStreak || 0;
            this.bestStreak = savedState.bestStreak || 0;
            
            if (this.chosenNumber && this.currentStep) {
                this.showScreen('game-screen');
                this.generateQuestion();
            } else {
                this.showScreen('start-screen');
                this.updateWelcomeMessage();
            }
        } else {
            this.showScreen('name-screen');
        }
    }
    
    setupEventListeners() {
        // Handle Enter key in name input
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveName();
            }
        });
        
        // Setup number options
        const numberOptions = document.getElementById('number-options');
        CONFIG.AVAILABLE_NUMBERS.forEach(num => {
            const button = document.createElement('button');
            button.textContent = num;
            button.onclick = () => this.startGame(num);
            numberOptions.appendChild(button);
        });
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    updateWelcomeMessage() {
        document.getElementById('welcome-message').textContent = 
            MESSAGES.welcome.replace('{name}', this.playerName);
    }
    
    saveName() {
        const nameInput = document.getElementById('player-name');
        const name = nameInput.value.trim();
        
        if (name) {
            this.playerName = name;
            this.saveGameState();
            this.showScreen('start-screen');
            this.updateWelcomeMessage();
        } else {
            nameInput.focus();
        }
    }
    
    startGame(number) {
        this.chosenNumber = number;
        this.currentStep = CONFIG.START_STEP;
        this.score = 0;
        this.currentStreak = 0;
        this.saveGameState();
        this.showScreen('game-screen');
        this.generateQuestion();
        this.updateProgress();
    }
    
    generateQuestion() {
        const correctAnswer = this.chosenNumber * this.currentStep;
        const options = [correctAnswer];
        
        // Generate wrong options
        while (options.length < CONFIG.OPTIONS_PER_QUESTION) {
            const randomOption = Math.floor(Math.random() * (correctAnswer + 10)) + 1;
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }
        
        // Shuffle options
        options.sort(() => Math.random() - 0.5);
        
        // Update UI
        document.getElementById('question').textContent = 
            `Hvad er ${this.chosenNumber} x ${this.currentStep}?`;
        
        const optionsDiv = document.getElementById('answer-options');
        optionsDiv.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = (event) => this.checkAnswer(option, correctAnswer, event);
            optionsDiv.appendChild(button);
        });
        
        this.updateStats();
    }
    
    checkAnswer(selected, correct, event) {
        const feedback = document.getElementById('feedback');
        
        if (selected === correct) {
            // Correct answer
            this.score += CONFIG.POINTS_PER_CORRECT;
            this.currentStreak++;
            this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
            
            feedback.textContent = this.getRandomMessage(MESSAGES.correct);
            feedback.style.color = 'var(--success-color)';
            
            // Confetti animation
            party.confetti(event, {
                count: party.variation.range(
                    CONFIG.CONFETTI.count.min,
                    CONFIG.CONFETTI.count.max
                ),
                spread: CONFIG.CONFETTI.spread,
                size: party.variation.range(
                    CONFIG.CONFETTI.size.min,
                    CONFIG.CONFETTI.size.max
                ),
                speed: party.variation.range(
                    CONFIG.CONFETTI.speed.min,
                    CONFIG.CONFETTI.speed.max
                )
            });
            
            this.currentStep++;
            this.saveGameState();
            
            if (this.currentStep > CONFIG.MAX_STEPS) {
                this.endGame();
            } else {
                this.generateQuestion();
                this.updateProgress();
            }
        } else {
            // Wrong answer
            this.currentStreak = 0;
            feedback.textContent = this.getRandomMessage(MESSAGES.wrong);
            feedback.style.color = 'var(--error-color)';
        }
        
        this.updateStats();
    }
    
    updateProgress() {
        const progress = ((this.currentStep - CONFIG.START_STEP) / 
            (CONFIG.MAX_STEPS - CONFIG.START_STEP + 1)) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
    }
    
    updateStats() {
        document.getElementById('score').textContent = 
            MESSAGES.stats.score.replace('{score}', this.score);
        document.getElementById('streak').textContent = 
            MESSAGES.stats.streak.replace('{streak}', this.currentStreak);
    }
    
    endGame() {
        this.showScreen('end-screen');
        document.getElementById('end-message').textContent = 
            MESSAGES.endGame
                .replace('{name}', this.playerName)
                .replace('{number}', this.chosenNumber);
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-streak').textContent = this.bestStreak;
        
        localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    
    restartGame() {
        this.showScreen('start-screen');
        this.chosenNumber = null;
        this.currentStep = null;
        this.score = 0;
        this.currentStreak = 0;
        this.saveGameState();
    }
    
    getRandomMessage(messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex].replace('{name}', this.playerName);
    }
    
    saveGameState() {
        const gameState = {
            playerName: this.playerName,
            chosenNumber: this.chosenNumber,
            currentStep: this.currentStep,
            score: this.score,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(gameState));
    }
    
    loadGameState() {
        const savedState = localStorage.getItem(CONFIG.STORAGE_KEY);
        return savedState ? JSON.parse(savedState) : null;
    }
}

// Initialize the game when the page loads
const game = new Game(); 