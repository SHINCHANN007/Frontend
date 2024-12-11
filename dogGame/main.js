import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './backgroung.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemy.js';
import { UI } from './UI.js';

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = 1800;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = true;
            this.score = 0;
            this.fontColor = 'black';
            this.currentLevel = 1;
            this.requiredScore = 10; // Set a reasonable base score requirement
            this.gameFinished = false;
            this.isTransitioning = false; // Flag to prevent multiple transitions
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime) {
            if (this.gameFinished) return;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });

            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            });

            if (this.score >= this.requiredScore) {
                this.finishLevel();
            }
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.UI.draw(context);

            if (this.gameFinished) {
                context.fillStyle = 'rgba(0, 0, 0, 0.5)';
                context.fillRect(0, 0, this.width, this.height);
                context.fillStyle = 'white';
                context.font = '40px Helvetica';
                context.textAlign = 'center';
                context.fillText('Level Complete!', this.width / 2, this.height / 2 - 60);

                // Draw buttons
                context.font = '30px Helvetica';
                context.fillStyle = 'white';
                context.fillRect(this.width / 2 - 150, this.height / 2 + 50, 100, 50); // Home button
                context.fillRect(this.width / 2 + 50, this.height / 2 + 50, 100, 50); // Next Level button

                context.fillStyle = 'black';
                context.fillText('Home', this.width / 2 - 100, this.height / 2 + 85);
                context.fillText('Next', this.width / 2 + 100, this.height / 2 + 85);
            }
        }

        sendScoreToHtml() {
            // Dispatch a custom event with the score
            const event = new CustomEvent('levelFinished', { detail: { score: this.score } });
            window.dispatchEvent(event);
        }

        finishLevel() {
            if (!this.isTransitioning) {
                this.sendScoreToHtml(); // Send the score when the level is finished
                this.gameFinished = true;
                this.isTransitioning = true; // Set flag to prevent multiple transitions
                window.addEventListener('click', this.handleButtonClick.bind(this));
            }
        }

        handleButtonClick(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Check if click is within Home button
            if (x >= this.width / 2 - 150 && x <= this.width / 2 - 50 &&
                y >= this.height / 2 + 50 && y <= this.height / 2 + 100) {
                this.goHome();
            }

            // Check if click is within Next Level button
            else if (x >= this.width / 2 + 50 && x <= this.width / 2 + 150 &&
                y >= this.height / 2 + 50 && y <= this.height / 2 + 100) {
                this.startNextLevel();
            }

            // Remove event listener after handling
            window.removeEventListener('click', this.handleButtonClick.bind(this));
            this.isTransitioning = false; // Reset flag after handling
        }

        goHome() {
            // Implement navigation to home screen
            window.location.href = '../home/home.html'; // Change this to your home screen URL or implementation
        }

        startNextLevel() {
            if (this.isTransitioning) return; // Ensure only one transition

            this.currentLevel++;
            this.requiredScore = Math.round(this.requiredScore * 1.2); // Increase required score by 20% for each level
            this.gameFinished = false;
            this.score = 0;
            this.enemies = [];
            this.particles = [];
            this.speed = 0; // Reset speed or adjust as necessary for the new level
        }

        addEnemy() {
            if (this.speed > 0) {
                if (Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
                else this.enemies.push(new ClimbingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});
