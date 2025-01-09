const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const restartButton = document.getElementById('restartButton');
const gameOverMessage = document.getElementById('gameOverMessage');

let shipX = 50; // Позиция корабля по оси X
let shipY = canvas.height / 2; // Начальная позиция корабля по оси Y
const shipWidth = 30; // Ширина корабля
const shipHeight = 50; // Высота корабля
let obstacles = []; // Массив для хранения препятствий
let score = 0; // Начальный счет
let gameOver = false; // Флаг окончания игры
let obstacleFrequency = 1000; // Интервал появления препятствий (в миллисекундах)

// Загрузка изображений
const shipImage = new Image();
shipImage.src = './img/spaceship.png'; // Укажите путь к изображению корабля
const obstacleImage = new Image();
obstacleImage.src = './img/asteroid.png'; // Укажите путь к изображению препятствия


document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

let keyStates = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

function handleKeyDown(event) {
    if (gameOver) return; // Если игра окончена, игнорируем нажатия клавиш
    if (keyStates.hasOwnProperty(event.key)) {
        keyStates[event.key] = true; // Устанавливаем состояние клавиши
    }
}

function handleKeyUp(event) {
    if (keyStates.hasOwnProperty(event.key)) {
        keyStates[event.key] = false; // Сбрасываем состояние клавиши
    }
}

function updateShipPosition() {
    if (keyStates.ArrowUp && shipY > 0) {
        shipY -= 2; // Плавное движение вверх
    }
    if (keyStates.ArrowDown && shipY < canvas.height - shipHeight) {
        shipY += 2; // Плавное движение вниз
    }
    if (keyStates.ArrowLeft && shipX > 0) {
        shipX -= 2; // Плавное движение влево
    }
    if (keyStates.ArrowRight && shipX < canvas.width - shipWidth) {
        shipX += 2; // Плавное движение вправо
    }   
}

function drawShip() {
    ctx.drawImage(shipImage, shipX, shipY, shipWidth, shipHeight); // Отрисовка изображения корабля
    //ctx.fillStyle = 'blue'; // Цвет корабля
    //ctx.fillRect(shipX, shipY, shipWidth, shipHeight); // Рисуем корабль
}

function drawObstacles() {
    //ctx.fillStyle = 'red'; // Цвет препятствий
    obstacles.forEach(obstacle => {
        //ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, shipWidth, shipHeight); // Отрисовка изображения препятствий
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed; // Передвигаем препятствие вниз по экрану
    });

    // Убираем препятствия, вышедшие за экран
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            shipX < obstacle.x + obstacle.width &&
            shipX + shipWidth > obstacle.x &&
            shipY < obstacle.y + obstacle.height &&
            shipY + shipHeight > obstacle.y
        ) {
            gameOver = true; // Если произошло столкновение, игра окончена
            gameOverMessage.style.display = 'block'; // Показываем сообщение об окончании
            restartButton.style.display = 'block'; // Показываем кнопку перезапуска
        }
    });
}

function updateScore() {
    score += 1; // Увеличиваем счет
    scoreDiv.textContent = `Счет: ${score}`; // Отображаем счет
}

function spawnObstacle() {
    if (gameOver) return; // Если игра окончена, не создаем новые препятствия
    
    const obstacleWidth = 40; // Ширина препятствия
    const obstacleHeight = 30; // Высота препятствия
    const obstacleX = Math.random() * (canvas.width - obstacleWidth);
    const obstacleSpeed = Math.random() * 3 + 2; // Скорость препятствий (случайное значение)

    obstacles.push({ x: obstacleX, y: 0, width: obstacleWidth, height: obstacleHeight, speed: obstacleSpeed });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем экран

    if (!gameOver) {
        updateShipPosition();
        drawShip(); // Рисуем корабль
        drawObstacles(); // Рисуем препятствия
        updateObstacles(); // Обновляем позиции препятствий
        detectCollision(); // Проверяем столкновения
        updateScore(); // Обновляем счет
    }

    requestAnimationFrame(gameLoop); // Запрашиваем следующий кадр
}

// Спавним препятствия через заданный интервал
setInterval(spawnObstacle, obstacleFrequency); 

// Запускаем игровой цикл
gameLoop();

function restartGame() {
    shipX = 50;
    shipY = canvas.height / 2;
    obstacles = [];
    score = 0;
    gameOver = false;
    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'none';
    scoreDiv.textContent = `Счет: 0`; // Сбрасываем счет
    
    gameLoop(); // Запускаем новый игровой цикл
}