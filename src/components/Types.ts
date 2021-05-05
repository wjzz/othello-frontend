export const ALL_ROWS = [0,1,2,3,4,5,6,7];
export const ALL_COLS = [0,1,2,3,4,5,6,7];

export type Color = "X" | "O";
export type Field = string;
export type Index = number;
export type StrBoard = string;

export const INIT_BOARD: StrBoard = "...........................OX......XO...........................";

// O pass example
// export const INIT_BOARD: StrBoard = "OOOOOOO.XXXOO...XXOXOO..OOXXXOOOXXXXXXXXXOOOXXXXXXXXXXXXXXXXXXXX";

// Game over example: OOOOOOOXXXXXXXXXXXOXXXXXOOXXOXXXXXXOOXXXXOOOXXXXXXXXXXXXXXXXXXXX
// export const INIT_BOARD: StrBoard = "OOOOOOOXXXXXXXXXXXOXXXXXOOXXOXXXXXXOOXXXXOOOXXXXXXXXXXXXXXXXXXXX";

// Game over example: OOOOOOOXXXXXXXXXXXOXXXXXOOXXOXXXXXXOOXXXXOOOXXXXXXXXXXXXXXXXXXXX
// export const INIT_BOARD: StrBoard = "OOOOOOOXXXXXXXXXXXOXXXXXOOXXOXXXXXXOOXXXXOOOOOOOOOOOOOOOOOOXOOXX";

export const rowcol2index = (row: number, col: number): Index =>
  8*row+col;

export const rowcol2field = (row: number, col: number): Field => {
  const first = "ABCDEFGH"[col];
  const second = row + 1;
  return `${first}${second}`;
}

export const opposite_color = (toMove: Color): Color => toMove === "X" ? "O" : 'X';

export interface Position {
    board: StrBoard;
    toMove: Color;
}

export const initialPosition = (): Position => ({
    board: INIT_BOARD,
    toMove: "X",
});

export interface Status {
    difference: number;
    gameFinished: boolean;
    moves: Array<Field>;
    passForced: boolean;
    winner: Color | null;
}

//----------------------------------------------------------------------

export type GameState = "Finished" | "WaitingHuman" | "WaitingBot";

//----------------------------------------------------------------------

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
