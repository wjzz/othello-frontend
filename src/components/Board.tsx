import React, { useEffect, useState } from 'react';
import { fetchMoves, fetchPositionAfterMove } from '../api/Api';
import './Board.css';

const ROWS = 8;
const COLS = 8;

const ALL_ROWS = [0,1,2,3,4,5,6,7];
const ALL_COLS = [0,1,2,3,4,5,6,7];

const INIT_POS = "...........................OX......XO...........................";

type Index = number;

const rowcol2index = (row: number, col: number): Index =>
  8*row+col;

const rowcol2field = (row: number, col: number): string => {
  const first = "ABCDEFGH"[col];
  const second = row + 1;
  return `${first}${second}`;
}

const opposite_player = (to_move:string) => to_move === "X" ? "O" : 'X';

const scrutinize = (ascii: string): string => {
  switch(ascii) {
    case 'X': return 'square_occupied square_X';
    case 'O': return 'square_occupied square_O';
    case '.':
    default:
      return 'square_empty';
  }
}

const Square = (props: any) => {
  const { row, col, candidates, ascii, make_move } = props;

  const candidate_moves = candidates as Array<string>;
  const field = rowcol2field(row, col);
  const is_candidate = candidate_moves.includes(field);

  const scrutinize_candidate = () => {
    if (is_candidate) {
      return {
        onClick: () => make_move(rowcol2field(row, col))
      };
    } else {
      return {};
    }
  }

  const handlers = scrutinize_candidate();

  const square_class = scrutinize(ascii);

  const parent_classes = is_candidate ? `square move_candidate` : "square";

  return (
    <div className={parent_classes} {...handlers}>
      <div className={square_class}>
      </div>
    </div>
  )
}


const Board = () => {
  const [pos, setPos] = useState<string>(INIT_POS);
  const [to_move, setToMove] = useState<string>("X");
  const [candidates, setCandidates] = useState<Array<string>>([]);

  useEffect(() => {
    fetchMoves(pos, to_move).then(moves => setCandidates(moves));
  }, []); // we only want useEffect to run once

  const handleMove = (field: string) => {
    fetchPositionAfterMove(pos, to_move, field).then(({ pos: newPos, moves }) => {
      setPos(newPos);
      setToMove(opposite_player(to_move));
      setCandidates(moves);
    });
  }

  const generateSquares = () =>
    ALL_ROWS.flatMap(row =>
      ALL_COLS.map(col =>
        <Square
          key={rowcol2index(row, col)}
          row={row}
          col={col}
          candidates={candidates}
          make_move={handleMove}
          ascii={pos[rowcol2index(row, col)]}
        />
      )
    );

  return (
    <div>
      <div className='square-container'>
        {generateSquares()}
      </div>
    </div>
  )
}

export default Board;
