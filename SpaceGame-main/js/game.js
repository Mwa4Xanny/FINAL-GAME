class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.background = new Background(this);
        this.player = new Player(this);
        this.sound = new AudioControl(this); // Sound
        this.enemys = [];
        this.numberOfEnemys = 10;
        this.gravity;
        this.speed;
        this.score;
        this.gameOver = false; // Inicializando o estado de game over
        this.timer;
        this.message1;
        this.message2;
        this.minSpeed;
        this.maxSpeed;
        this.eventTimer = 0;
        this.eventInterval = 1; // Intervalo de 1 segundo para criação de inimigos
        this.eventUpdate = false;
        this.touchStarX;
        this.swipeDistance = 50;
        this.debug = false;
        this.enemyCount = 0; // Contador de inimigos criados

        this.resize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });

        // Mouse controls
        this.canvas.addEventListener('mousedown', e => {
            this.player.flap();
        });

        this.canvas.addEventListener('mouseup', e => {
            this.player.wingsUp();
        });

        // Keyboard controls
        window.addEventListener('keydown', e => {
            if ((e.key === ' ') || (e.key === 'Enter')) {
                this.player.flap();
            }

            if ((e.key === 'Shift') || (e.key.toLowerCase() === 'c')) {
                this.player.startCharge();
            }

            if (e.key.toLowerCase() === 'r') {
                this.resize(window.innerWidth, window.innerHeight);
            }

            if (e.key.toLowerCase() === 'd') {
                this.debug = !this.debug;
            }

            if (e.key.toLowerCase() === 'e') {
                this.player.shoot();
            }

            // Controle do movimento vertical
            if (e.key === 'ArrowUp') {
                this.player.speedY = -this.player.maxSpeedY;
            } else if (e.key === 'ArrowDown') {
                this.player.speedY = this.player.maxSpeedY;
            }
        });

        window.addEventListener('keyup', e => {
            this.player.wingsUp();

            // Parar o movimento vertical ao soltar as teclas
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                this.player.speedY = 0;
            }
        });

        // Touch controls
        this.canvas.addEventListener('touchstart', e => {
            this.player.flap();
            this.touchStartX = e.changedTouches[0].pageX;
        });

        this.canvas.addEventListener('touchmove', e => {
            if (e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance) {
                this.player.startCharge();
            }
        });

        this.createEnemys();
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.font = '15px Bungee';
        this.ctx.textAlign = 'right';
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'white';
        this.ratio = this.height / this.baseHeight;

        this.gravity = 0.15 * this.ratio;
        this.speed = 3 * this.ratio;
        this.minSpeed = this.speed;
        this.maxSpeed = this.speed * 5;

        this.background.resize();
        this.player.resize();
        this.enemys.forEach(enemy => {
            enemy.resize();
        });

        this.score = 0;
        this.gameOver = false;
        this.timer = 0;
    }

    render(deltaTime) {
        if (!this.gameOver) this.timer += deltaTime;
        this.handlePeriodicEvents(deltaTime);
        this.background.update();
        this.background.draw();
        this.drawStatusText();
        this.player.update();
        this.player.draw();
        this.enemys = this.enemys.filter(enemy => !enemy.markedForDeletion);
        this.enemys.forEach(enemy => {
            enemy.update(deltaTime);
            enemy.draw();
        });

        // Verificar se o jogo terminou
        if (this.gameOver) {
            this.drawGameOver();
        }
    }

    createEnemys() {
        const firstX = this.width;
        const enemySpacing = 600 * this.ratio;

        if (this.enemyCount < this.numberOfEnemys) {
            this.enemys.push(new Enemy(this, firstX + this.enemyCount * enemySpacing));
            this.enemyCount++;
        }
    }

    formatTimer() {
        return (this.timer * 0.001).toFixed(1);
    }

    handlePeriodicEvents(deltaTime) {
        if (this.eventTimer < this.eventInterval) {
            this.eventTimer += deltaTime;
            this.eventUpdate = false;
        } else {
            this.eventTimer = this.eventTimer % this.eventInterval;
            this.eventUpdate = true;
            // Criar novos inimigos a cada 1 segundo
            this.createEnemys();
        }
    }

    drawStatusText() {
        this.ctx.save();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('Score: ' + this.score, this.width - 10, 30);
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Timer: ' + this.formatTimer(), 10, 30);

        if (this.gameOver) {
            this.drawGameOver();
        }

        if (this.player.energy <= 20) {
            this.ctx.fillStyle = '#FF1100';
        } else if (this.player.energy >= this.player.maxEnergy) {
            this.ctx.fillStyle = '#89F336';
        } else {
            this.ctx.fillStyle = '#00B4D8';
        }

        for (let i = 0; i < this.player.energy; i++) {
            this.ctx.fillRect(10, this.height - 10 - this.player.barSize * i, this.player.barSize * 5, this.player.barSize);
        }

        this.ctx.restore();
    }

    drawGameOver() {
        this.ctx.save();
        this.ctx.font = '30px Bungee';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('Game Over', this.width * 0.5, this.height * 0.5 - 40);
        this.ctx.font = '15px Bungee';
        this.ctx.fillText("Press 'R' to restart!", this.width * 0.5, this.height * 0.5);
        this.ctx.restore();
    }

    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const sumOfRadii = a.collisionRadius + b.collisionRadius;
        return distance <= sumOfRadii;
    }
}

window.addEventListener('load', function () {
    const canvas = document.getElementById('game-layout');
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});