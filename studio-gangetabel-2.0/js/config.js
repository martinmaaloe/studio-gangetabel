const CONFIG = {
    // Game settings
    MAX_STEPS: 10,
    START_STEP: 2,
    OPTIONS_PER_QUESTION: 4,
    
    // Scoring
    POINTS_PER_CORRECT: 10,
    STREAK_BONUS: 5,
    
    // Storage keys
    STORAGE_KEY: 'gangetabel_game_state',
    
    // Animation settings
    CONFETTI: {
        count: { min: 50, max: 80 },
        spread: 70,
        size: { min: 0.4, max: 0.8 },
        speed: { min: 300, max: 400 }
    },
    
    // Available numbers for practice
    AVAILABLE_NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}; 