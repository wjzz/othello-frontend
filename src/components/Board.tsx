import classNames from 'classnames';
import React from 'react';
import './Board.css';
import { ALL_COLS, ALL_ROWS, Field, Position, rowcol2field, rowcol2index, Status } from "./Types";

const scrutinize = (ascii: string): string => {
  switch (ascii) {
    case 'X': return 'square_occupied square_X';
    case 'O': return 'square_occupied square_O';
    case '.':
    default:
      return 'square_empty';
  }
}

interface SquareProps {
  row: number;
  col: number;
  status: Status | null;
  lastMove: Field | null;
  isHuman: boolean;
  ascii: string;
  handleMove: (field: Field) => void;
};

const Square: React.FC<SquareProps> = ({ row, col, status, lastMove, isHuman, ascii, handleMove }) => {
  const candidates = (status === null) ? [] : (status as Status).moves;

  const field = rowcol2field(row, col);
  const is_candidate = candidates.includes(field);

  const scrutinize_candidate = () => {
    if (isHuman && is_candidate) {
      return {
        onClick: () => handleMove(rowcol2field(row, col))
      };
    } else {
      return {};
    }
  }

  const handlers = scrutinize_candidate();

  const parent_classes = classNames("square", {
    "human": isHuman,
    "move_candidate": is_candidate,
    "last_move": lastMove === field,
  });

  const square_class = scrutinize(ascii);

  return (
    <div className={parent_classes} {...handlers}>
      <div className={square_class}>
        {/* {field}/{rowcol2index(row, col)} */}
      </div>
    </div>
  )
}

interface BoardProps {
  pos: Position;
  status: Status | null;
  lastMove: Field | null;
  isHuman: boolean;
  handleMove: (field: Field) => void;
}

const Board: React.FC<BoardProps> = ({ pos, status, lastMove, isHuman, handleMove }) => {
  const board = pos.board;

  const generateSquares = () =>
    ALL_ROWS.flatMap(row =>
      ALL_COLS.map(col =>
        <Square
          key={rowcol2index(row, col)}
          row={row}
          col={col}
          lastMove={lastMove}
          status={status}
          handleMove={handleMove}
          isHuman={isHuman}
          ascii={board[rowcol2index(row, col)]}
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
