export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30; // Default font size for other texts
        this.fontFamily = 'Helvetica';
    }

    draw(context) {
        // Draw the score
        context.font = `bold 40px ${this.fontFamily}`; // Increase font size and make it bold for emphasis
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        context.fillText('Score: ' + this.game.score, 20, 50);

        // Draw the current level
        context.font = `bold 30px ${this.fontFamily}`; // Slightly smaller font for the level
        context.fillText('Level: ' + this.game.currentLevel, 20, 90);
    }
}
