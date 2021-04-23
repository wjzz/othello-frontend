import React from 'react';
import './Board.css';

const ROWS = 8;
const COLS = 8;

const ALL_ROWS = [0,1,2,3,4,5,6,7];
const ALL_COLS = [0,1,2,3,4,5,6,7];

const INIT_POS = "...........................OX......XO...........................";

const Square = (props: any) => {
  const { row, col, ascii } = props;

  const scrutinize = (): [string, string] => {
    switch(ascii) {
      case 'X': return ['X', 'square_X'];
      case 'O': return ['O', 'square_O'];
      case '.':
      default:
        return ['',  'square_empty'];
    }
  }

  const [value, square_class] = scrutinize();

  const classes = `square ${square_class}`;

  return (
    <div className={classes}>
      {value}
    </div>
  )
}

const Board = () => {
  const ascii = INIT_POS;

  const generateSquares = () =>
    ALL_ROWS.flatMap(row =>
      ALL_COLS.map(col =>
        <Square row={row} col={col} ascii={ascii[8*row+col]}/>
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
