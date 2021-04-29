import React from 'react';
import './Board.css';
import { ALL_COLS, ALL_ROWS, rowcol2field, rowcol2index } from "./Types";

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
  const { row, col, candidates, isHuman, ascii, make_move } = props;

  const candidate_moves = candidates as Array<string>;
  const field = rowcol2field(row, col);
  const is_candidate = candidate_moves.includes(field);

  const scrutinize_candidate = () => {
    if (isHuman && is_candidate) {
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
  const human_classes = isHuman ? "human " + parent_classes : parent_classes;

  return (
    <div className={human_classes} {...handlers}>
      <div className={square_class}>
      </div>
    </div>
  )
}


const Board = (props: any) => {
  const { pos, candidates, isHuman, handleMove} = props;

  const generateSquares = () =>
    ALL_ROWS.flatMap(row =>
      ALL_COLS.map(col =>
        <Square
          key={rowcol2index(row, col)}
          row={row}
          col={col}
          candidates={candidates}
          make_move={handleMove}
          isHuman={isHuman}
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
