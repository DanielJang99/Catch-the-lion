import { Board, Deadzone } from "./board";
import { Player, PlayerType } from "./Player";

export class Game {
    readonly upperPlayer = new Player(PlayerType.UPPER);
    readonly lowerPlayer = new Player(PlayerType.LOWER);
    readonly board = new Board(this.upperPlayer, this.lowerPlayer);

    readonly upperDeadZone = new Deadzone("upper");
    readonly lowerDeadZone = new Deadzone("lower");

    constructor() {
        const boardContainer = document.querySelector(".board-container");
        if (boardContainer.firstChild) {
            boardContainer.firstChild.remove();
        }
        // boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._el);
        this.board.render();
    }
}
