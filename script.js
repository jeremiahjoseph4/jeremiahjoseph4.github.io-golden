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
let ermiyasPos = { x: 50, y: 150 };
let rakebPos = { x: 100, y: 150 };
let gameActive = false;

// Responsive positions based on screen size
function getResponsivePositions() {
    const isMobile = window.innerWidth < 768;
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    if (isMobile) {
        return {
            ermiyas: { x: 50, y: 150 },
            rakeb: { x: 100, y: 150 },
            memories: [
                { x: Math.min(200, gameAreaRect.width - 100), y: 80 },
                { x: Math.min(300, gameAreaRect.width - 100), y: 150 },
                { x: Math.min(250, gameAreaRect.width - 100), y: 200 },
                { x: Math.min(350, gameAreaRect.width - 100), y: 80 },
                { x: Math.min(400, gameAreaRect.width - 100), y: 180 }
            ]
        };
    } else {
        return {
            ermiyas: { x: 100, y: 200 },
            rakeb: { x: 200, y: 200 },
            memories: [
                { x: 300, y: 120 },
                { x: 450, y: 200 },
                { x: 350, y: 280 },
                { x: 500, y: 120 },
                { x: 600, y: 220 }
            ]
        };
    }
}

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
            { emoji: "📝", message: "First homework together!" },
            { emoji: "🍎", message: "Sharing lunch!" },
            { emoji: "🎨", message: "Drawing pictures!" },
            { emoji: "📚", message: "Studying together!" },
            { emoji: "🚌", message: "School bus rides!" }
        ],
        story: "Where it all began - young love in classroom!"
    },
    {
        name: "College Years",
        icon: "🎓",
        decoration: "📖",
        background: "stage-college",
        ermiyasEmoji: "👨‍🎓",
        rakebEmoji: "👩‍🎓",
        memories: [
            { emoji: "☕", message: "Coffee dates!" },
            { emoji: "📚", message: "Library sessions!" },
            { emoji: "🎉", message: "Campus parties!" },
            { emoji: "🍕", message: "Late night pizza!" },
            { emoji: "🎓", message: "Graduation day!" }
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
            { emoji: "💻", message: "First jobs!" },
            { emoji: "🏠", message: "Moving in together!" },
            { emoji: "💰", message: "Saving for dreams!" },
            { emoji: "🚗", message: "Road trips!" },
            { emoji: "💍", message: "The proposal!" }
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
            { emoji: "💒", message: "Wedding day!" },
            { emoji: "🌴", message: "Honeymoon!" },
            { emoji: "🏡", message: "First home!" },
            { emoji: "🍳", message: "Cooking together!" },
            { emoji: "🌹", message: "Anniversary dates!" }
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
            { emoji: "👨‍👩‍👧‍👦", message: "Grandchildren!" },
            { emoji: "🌺", message: "Garden together!" },
            { emoji: "☕", message: "Morning coffee!" },
            { emoji: "📷", message: "Looking at photos!" },
            { emoji: "💕", message: "Still in love!" }
        ],
        story: "Growing old together, love never fades!"
    }
];

// Initialize Stage
function initStage() {
    const stage = stages[currentStage];
    const positions = getResponsivePositions();
    
    gameContainer.className = `game-container ${stage.background}`;
    stageIcon.textContent = stage.icon;
    stageName.textContent = stage.name;
    stageDecoration.textContent = stage.decoration;
    ermiyas.textContent = stage.ermiyasEmoji;
    rakeb.textContent = stage.rakebEmoji;
    
    ermiyasPos = positions.ermiyas;
    rakebPos = positions.rakeb;
    updatePlayerPositions();
    
    clearStage();
    
    stageMemories = [];
    stage.memories.forEach((memory, index) => {
        const memoryElement = document.createElement('div');
        memoryElement.className = 'memory-item';
        memoryElement.innerHTML = memory.emoji;
        const pos = positions.memories[index];
        memoryElement.style.left = pos.x + 'px';
        memoryElement.style.top = pos.y + 'px';
        memoryElement.dataset.index = index;
        gameArea.appendChild(memoryElement);
        stageMemories.push({
            element: memoryElement,
            collected: false,
            x: pos.x,
            y: pos.y,
            ...memory
        });
    });
    
    collectedMemories = 0;
    memoryCount.textContent = collectedMemories;
    totalMemories.textContent = stage.memories.length;
    updateProgress();
    
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
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createHeartParticle(memory.x + 17, memory.y + 17);
        }, i * 100);
    }
    
    showFloatingText(memory.x, memory.y, memory.message);
    
    setTimeout(() => {
        memory.element.remove();
    }, 600);
    
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
    
    const speed = window.innerWidth < 768 ? 15 : 20;
    const gameAreaRect = gameArea.getBoundingClientRect();
    const playerSize = window.innerWidth < 768 ? 40 : 50;
    const headerHeight = 60;
    const progressBarHeight = 40;
    
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
            
            if (distE < 35 || distR < 35) {
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
    e.preventDefault();
});

rakeb.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchedPlayer = 'rakeb';
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY || !touchedPlayer) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const threshold = window.innerWidth < 768 ? 20 : 30;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) {
            movePlayer(touchedPlayer, 'right');
            touchStartX = touchEndX;
        } else if (dx < -threshold) {
            movePlayer(touchedPlayer, 'left');
            touchStartX = touchEndX;
        }
    } else {
        if (dy > threshold) {
            movePlayer(touchedPlayer, 'down');
            touchStartY = touchEndY;
        } else if (dy < -threshold) {
            movePlayer(touchedPlayer, 'up');
            touchStartY = touchEndY;
        }
    }
    e.preventDefault();
});

document.addEventListener('touchend', () => {
    touchStartX = null;
    touchStartY = null;
    touchedPlayer = null;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (gameActive && stageMemories.length > 0) {
        const positions = getResponsivePositions();
        stageMemories.forEach((memory, index) => {
            const pos = positions.memories[index];
            memory.x = pos.x;
            memory.y = pos.y;
            if (memory.element) {
                memory.element.style.left = pos.x + 'px';
                memory.element.style.top = pos.y + 'px';
            }
        });
    }
});

// Initialize Game
initStage();
