class Obstacle  {
    constructor(game, x)   {
        this.game = game;
        this.spriteWidth = 110;
        this.spriteHeight = 150;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaledHeight);
        this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
        this.markedForDeletion = false;
        this.collisionX;
        this.collisionY;
        this.collisionRadius = this.scaledWidth * 0.5;
    }

    update()    {
        this.x -= this.game.speed;
        this.y += this.speedY;

        if(!this.game.gameOver)  { //Obstacles Off Screen
            if(this.y <= 0 || this.y >= this.game.height - this.scaledHeight)   { //Obstacles Off Screen
                this.speedY *= -1; //Obstacles Off Screen
            } //Obstacles Off Screen
        } else  { //Obstacles Off Screen
            this.speedY += 0.1; //Obstacles Off Screen
        } //Obstacles Off Screen

        if(this.isOffScreen())  {
            this.markedForDeletion = true;
            this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markedForDeletion);
            this.game.score++;
            if(this.game.obstacles.length <= 0) this.game.gameOver = true;
        }

        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY= this.y + this.scaledHeight * 0.5;

        if(this.game.checkCollision(this, this.game.player))    {
            this.game.gameOver = true;
            this.game.player.collided = true;
            this.game.player.stopCharge(); // Stop charge (quando deteta um obstáculo)
        }
    }

    draw()  {
        this.game.ctx.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        this.game.ctx.stroke();
    }

    resize()    {
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
    }

    isOffScreen()   {
        return this.x < -this.scaledWidth || this.y > this.game.height; //Obstacles Off Screen (Para eliminar os obstáculos do Array)
    }
}