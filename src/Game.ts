import { Board, Cell, Deadzone } from "./board";
import { Lion } from "./Piece";
import { Player, PlayerType } from "./Player";

export class Game {
    private selectedCell: Cell;
    private turn = 0;
    private currentPlayer: Player;
    private gameInfoEl = document.querySelector(".alert");
    private state: "STARTED" | "ENDED" = "STARTED";
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
        this.currentPlayer = this.upperPlayer;

        this.renderInfo();
        this.board._el.addEventListener("click", (e) => {
            if (this.state === "ENDED") {
                return false;
            }
            if (e.target instanceof HTMLElement) {
                let cellEl: HTMLElement;
                if (e.target.classList.contains("cell")) {
                    cellEl = e.target;
                } else if (e.target.classList.contains("piece")) {
                    cellEl = e.target.parentElement;
                } else {
                    return false;
                }
                const cell = this.board.map.get(cellEl);
                if (this.isCurrentUserPiece(cell)) {
                    this.select(cell);
                    return false;
                }
                if (this.selectedCell) {
                    this.move(cell);
                    this.changeTurn();
                }
            }
        });
    }
    isCurrentUserPiece(cell: Cell) {
        return (
            cell != null &&
            cell.getPiece() != null &&
            cell.getPiece().ownerType === this.currentPlayer.type
        );
    }
    select(cell: Cell) {
        if (cell.getPiece() == null) {
            return;
        }
        if (cell.getPiece().ownerType !== this.currentPlayer.type) {
            return;
        }
        if (this.selectedCell) {
            this.selectedCell.deactivate();
            this.selectedCell.render();
        }
        this.selectedCell = cell;
        cell.activate();
        cell.render();
    }
    move(cell: Cell) {
        this.selectedCell.deactivate();
        const killed = this.selectedCell
            .getPiece()
            .move(this.selectedCell, cell)
            .getKilled();
        this.selectedCell = cell;
        if (killed) {
            if (killed.ownerType === PlayerType.UPPER) {
                this.lowerDeadZone.put(killed);
            } else {
                this.upperDeadZone.put(killed);
            }

            if (killed instanceof Lion) {
                this.state = "ENDED";
            }
        }
    }
    renderInfo(extraMessage?: string) {
        this.gameInfoEl.innerHTML = `#${this.turn}턴 ${
            this.currentPlayer.type
        } 차례 ${extraMessage ? "| " + extraMessage : ""}`;
    }
    changeTurn() {
        this.selectedCell.deactivate();
        this.selectedCell = null;
        if (this.state === "ENDED") {
            this.renderInfo("END!");
        } else {
            this.turn += 1;
            this.currentPlayer =
                this.currentPlayer === this.lowerPlayer
                    ? this.upperPlayer
                    : this.lowerPlayer;
            this.renderInfo();
        }
        this.board.render();
    }
}
