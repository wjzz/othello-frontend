// const ROWS = 8;
// const COLS = 8;

export const ALL_ROWS = [0,1,2,3,4,5,6,7];
export const ALL_COLS = [0,1,2,3,4,5,6,7];

export const INIT_POS = "...........................OX......XO...........................";

export type Index = number;
export type Color = "X" | "O";
export type Field = string;

export type GameState = "Finished" | "WaitingHuman" | "WaitingBot";

export type Player =
    | { kind: "Human" }
    | { kind: "Bot", name: string }

export const is_human = (player: Player) => player.kind === "Human";

export type PlayerConfig = {
    [K in Color]: Player;
}

export const playerOfString = (value: string): Player => {
    if (value.toLowerCase() === "human") {
        return { kind: "Human" };
    } else {
        return { kind: "Bot", name: value };
    }
}

export const defaultPlayerConfig: PlayerConfig = {
    "X": { kind: "Human" },
    "O": { kind: "Bot", name: "Random" }
};

export const rowcol2index = (row: number, col: number): Index =>
  8*row+col;

export const rowcol2field = (row: number, col: number): Field => {
  const first = "ABCDEFGH"[col];
  const second = row + 1;
  return `${first}${second}`;
}

export const opposite_player = (to_move: Color): Color => to_move === "X" ? "O" : 'X';
