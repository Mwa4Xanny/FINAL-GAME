class Enemy {
    constructor(game, x) {
        this.game = game;
        this.x = x;
        this.y = Math.random() * (this.game.height - 100);
        this.spriteWidth = 192;
        this.spriteHeight = 192;
        this.width = this.spriteWidth * this.game.ratio * 0.5;
        this.height = this.spriteHeight * this.game.ratio * 0.5;
        this.speedX = Math.random() * -1.5 - 0.5;
        this.markedForDeletion = false;
        this.image = document.getElementById('enemy-idle');
    }

    update() {
        this.x += this.speedX;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw() {
        this.game.ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

    resize() {
        this.width = this.spriteWidth * this.game.ratio * 0.5;
        this.height = this.spriteHeight * this.game.ratio * 0.5;
    }
}