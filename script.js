// DOM Elements
const gameContainer = document.getElementById('gameContainer');
const gameArea = document.getElementById('gameArea');
const ermiyas = document.getElementById('ermiyas');
const rakeb = document.getElementById('rakeb');
const stageIcon = document.getElementById('stageIcon');
const stageName = document.getElementById('stageName');
const stageDecoration = document.getElementById('stageDecoration');
const memoryCount = document.getElementById('memoryCount');
const totalMemories = document.getElementById('totalMemories');
const messageOverlay = document.getElementById('messageOverlay');
const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const startBtn = document.getElementById('startBtn');
const progressFill = document.getElementById('progressFill');

// Game State
let currentStage = 0;
let collectedMemories = 0;
let stageMemories = [];
let ermiyasPos = { x: 100, y: 200 };
let rakebPos = { x: 200, y: 200 };
let gameActive = false;

// Stage Data
const stages = [
    {
        name: "School Days",
        icon: "🎒",
        decoration: "📚",
        background: "stage-school",
        ermiyasEmoji: "👦",
        rakebEmoji: "👧",
        memories: [
            { emoji: "📝", x: 300, y: 120, message: "First homework together!" },
            { emoji: "🍎", x: 450, y: 200, message: "Sharing lunch!" },
            { emoji: "🎨", x: 350, y: 280, message: "Drawing pictures!" },
            { emoji: "📚", x: 500, y: 120, message: "Studying together!" },
            { emoji: "🚌", x: 600, y: 220, message: "School bus rides!" }
        ],
        story: "Where it all began - young love in the classroom!"
    },
    {
        name: "College Years",
        icon: "🎓",
        decoration: "📖",
        background: "stage-college",
        ermiyasEmoji: "👨‍🎓",
        rakebEmoji: "👩‍🎓",
        memories: [
            { emoji: "☕", x: 350, y: 150, message: "Coffee dates!" },
            { emoji: "📚", x: 500, y: 120, message: "Library sessions!" },
            { emoji: "🎉", x: 400, y: 250, message: "Campus parties!" },
            { emoji: "🍕", x: 550, y: 200, message: "Late night pizza!" },
            { emoji: "🎓", x: 300, y: 280, message: "Graduation day!" }
        ],
        story: "Growing together, learning about life and love!"
    },
    {
        name: "Working Life",
        icon: "💼",
        decoration: "🏢",
        background: "stage-work",
        ermiyasEmoji: "👨‍💼",
        rakebEmoji: "👩‍💼",
        memories: [
            { emoji: "💻", x: 320, y: 150, message: "First jobs!" },
            { emoji: "🏠", x: 480, y: 200, message: "Moving in together!" },
            { emoji: "💰", x: 380, y: 280, message: "Saving for dreams!" },
            { emoji: "🚗", x: 530, y: 150, message: "Road trips!" },
            { emoji: "💍", x: 600, y: 220, message: "The proposal!" }
        ],
        story: "Building careers and a future together!"
    },
    {
        name: "Marriage",
        icon: "💒",
        decoration: "💕",
        background: "stage-marriage",
        ermiyasEmoji: "🤵",
        rakebEmoji: "👰",
        memories: [
            { emoji: "💒", x: 400, y: 120, message: "Wedding day!" },
            { emoji: "🌴", x: 320, y: 250, message: "Honeymoon!" },
            { emoji: "🏡", x: 480, y: 200, message: "First home!" },
            { emoji: "🍳", x: 530, y: 280, message: "Cooking together!" },
            { emoji: "🌹", x: 250, y: 180, message: "Anniversary dates!" }
        ],
        story: "The beginning of forever!"
    },
    {
        name: "Golden Years",
        icon: "👴",
        decoration: "🌅",
        background: "stage-old",
        ermiyasEmoji: "👴",
        rakebEmoji: "👵",
        memories: [
            { emoji: "👨‍👩‍👧‍👦", x: 380, y: 150, message: "Grandchildren!" },
            { emoji: "🌺", x: 450, y: 250, message: "Garden together!" },
            { emoji: "☕", x: 320, y: 280, message: "Morning coffee!" },
            { emoji: "📷", x: 500, y: 120, message: "Looking at photos!" },
            { emoji: "💕", x: 250, y: 200, message: "Still in love!" }
        ],
        story: "Growing old together, love never fades!"
    }
];

// Initialize Stage
function initStage() {
    const stage = stages[currentStage];
    
    // Update visuals
    gameContainer.className = `game-container ${stage.background}`;
    stageIcon.textContent = stage.icon;
    stageName.textContent = stage.name;
    stageDecoration.textContent = stage.decoration;
    ermiyas.textContent = stage.ermiyasEmoji;
    rakeb.textContent = stage.rakebEmoji;
    
    // Reset positions
    ermiyasPos = { x: 100, y: 200 };
    rakebPos = { x: 200, y: 200 };
    updatePlayerPositions();
    
    // Clear existing items
    clearStage();
    
    // Create memories
    stageMemories = [];
    stage.memories.forEach((memory, index) => {
        const memoryElement = document.createElement('div');
        memoryElement.className = 'memory-item';
        memoryElement.innerHTML = memory.emoji;
        memoryElement.style.left = memory.x + 'px';
        memoryElement.style.top = memory.y + 'px';
        memoryElement.dataset.index = index;
        gameArea.appendChild(memoryElement);
        stageMemories.push({
            element: memoryElement,
            collected: false,
            ...memory
        });
    });
    
    // Update UI
    collectedMemories = 0;
    memoryCount.textContent = collectedMemories;
    totalMemories.textContent = stage.memories.length;
    updateProgress();
    
    // Show message
    messageTitle.textContent = "Welcome to " + stage.name + "!";
    messageText.textContent = stage.story;
    startBtn.textContent = "Start Chapter";
    startBtn.onclick = startStage;
    messageOverlay.style.display = 'flex';
    gameActive = false;
}

// Clear Stage
function clearStage() {
    const memories = gameArea.querySelectorAll('.memory-item');
    memories.forEach(m => m.remove());
}

// Start Stage
function startStage() {
    messageOverlay.style.display = 'none';
    gameActive = true;
}

// Update Player Positions
function updatePlayerPositions() {
    ermiyas.style.left = ermiyasPos.x + 'px';
    ermiyas.style.top = ermiyasPos.y + 'px';
    rakeb.style.left = rakebPos.x + 'px';
    rakeb.style.top = rakebPos.y + 'px';
}

// Collect Memory
function collectMemory(memory) {
    if (memory.collected) return;
    
    memory.collected = true;
    memory.element.classList.add('memory-collected');
    
    collectedMemories++;
    memoryCount.textContent = collectedMemories;
    updateProgress();
    
    // Create heart particles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createHeartParticle(memory.x + 22, memory.y + 22);
        }, i * 100);
    }
    
    // Show floating text
    showFloatingText(memory.x, memory.y, memory.message);
    
    // Remove memory element
    setTimeout(() => {
        memory.element.remove();
    }, 600);
    
    // Check if stage complete
    if (collectedMemories === stages[currentStage].memories.length) {
        setTimeout(() => {
            completeStage();
        }, 1000);
    }
}

// Create Heart Particle
function createHeartParticle(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    gameArea.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Show Floating Text
function showFloatingText(x, y, text) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';
    gameArea.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 2000);
}

// Update Progress
function updateProgress() {
    const progress = (collectedMemories / stages[currentStage].memories.length) * 100;
    progressFill.style.width = progress + '%';
}

// Complete Stage
function completeStage() {
    gameActive = false;
    
    if (currentStage < stages.length - 1) {
        messageTitle.textContent = "Chapter Complete! 💕";
        messageText.textContent = "Amazing! Ready for next chapter of your love story?";
        startBtn.textContent = "Next Chapter";
        startBtn.onclick = nextStage;
        messageOverlay.style.display = 'flex';
    } else {
        messageTitle.textContent = "Forever Together! 💑";
        messageText.textContent = "You've completed entire journey of Ermiyas and Rakeb's love story! From school to golden years, your love has stood the test of time!";
        startBtn.textContent = "Start Over";
        startBtn.onclick = restartGame;
        messageOverlay.style.display = 'flex';
        
        // Celebration
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createHeartParticle(
                    Math.random() * (gameArea.offsetWidth - 50) + 25,
                    Math.random() * (gameArea.offsetHeight - 100) + 50
                );
            }, i * 100);
        }
    }
}

// Next Stage
function nextStage() {
    currentStage++;
    initStage();
}

// Restart Game
function restartGame() {
    currentStage = 0;
    initStage();
}

// Move Player
function movePlayer(player, direction) {
    if (!gameActive) return;
    
    const speed = 20;
    const gameAreaRect = gameArea.getBoundingClientRect();
    const playerSize = 50;
    const headerHeight = 80;
    const progressBarHeight = 50;
    
    const pos = player === 'ermiyas' ? ermiyasPos : rakebPos;
    
    switch(direction) {
        case 'up':
            pos.y = Math.max(headerHeight, pos.y - speed);
            break;
        case 'down':
            pos.y = Math.min(gameAreaRect.height - playerSize - progressBarHeight, pos.y + speed);
            break;
        case 'left':
            pos.x = Math.max(0, pos.x - speed);
            break;
        case 'right':
            pos.x = Math.min(gameAreaRect.width - playerSize, pos.x + speed);
            break;
    }
    
    updatePlayerPositions();
    checkMemoryCollection();
}

// Check Memory Collection
function checkMemoryCollection() {
    stageMemories.forEach(memory => {
        if (!memory.collected) {
            const distE = Math.sqrt(
                Math.pow(ermiyasPos.x - memory.x, 2) + 
                Math.pow(ermiyasPos.y - memory.y, 2)
            );
            const distR = Math.sqrt(
                Math.pow(rakebPos.x - memory.x, 2) + 
                Math.pow(rakebPos.y - memory.y, 2)
            );
            
            if (distE < 40 || distR < 40) {
                collectMemory(memory);
            }
        }
    });
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    switch(e.key.toLowerCase()) {
        case 'w':
            movePlayer('ermiyas', 'up');
            break;
        case 's':
            movePlayer('ermiyas', 'down');
            break;
        case 'a':
            movePlayer('ermiyas', 'left');
            break;
        case 'd':
            movePlayer('ermiyas', 'right');
            break;
        case 'arrowup':
            movePlayer('rakeb', 'up');
            break;
        case 'arrowdown':
            movePlayer('rakeb', 'down');
            break;
        case 'arrowleft':
            movePlayer('rakeb', 'left');
            break;
        case 'arrowright':
            movePlayer('rakeb', 'right');
            break;
    }
});

// Mobile D-Pad Controls
document.getElementById('ermiyasPad').addEventListener('click', (e) => {
    if (e.target.dataset.direction) {
        movePlayer('ermiyas', e.target.dataset.direction);
    }
});

document.getElementById('rakebPad').addEventListener('click', (e) => {
    if (e.target.dataset.direction) {
        movePlayer('rakeb', e.target.dataset.direction);
    }
});

// Touch Controls for Players
let touchStartX = null;
let touchStartY = null;
let touchedPlayer = null;

ermiyas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchedPlayer = 'ermiyas';
});

rakeb.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchedPlayer = 'rakeb';
});

document.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY || !touchedPlayer) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
            movePlayer(touchedPlayer, 'right');
            touchStartX = touchEndX;
        } else if (dx < -30) {
            movePlayer(touchedPlayer, 'left');
            touchStartX = touchEndX;
        }
    } else {
        if (dy > 30) {
            movePlayer(touchedPlayer, 'down');
            touchStartY = touchEndY;
        } else if (dy < -30) {
            movePlayer(touchedPlayer, 'up');
            touchStartY = touchEndY;
        }
    }
});

document.addEventListener('touchend', () => {
    touchStartX = null;
    touchStartY = null;
    touchedPlayer = null;
});

// Initialize Game
initStage();