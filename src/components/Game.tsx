import React, { useEffect, useState } from 'react';
import { AfterMoveResult, fetchBotMove, fetchMoves, fetchPositionAfterMove } from '../api/Api';
import { Color, INIT_POS, opposite_player, Field, PlayerConfig, defaultPlayerConfig, playerOfString, GameState, is_human } from "./Types";
import Board from "./Board";
import './Game.css';

interface ControlPanelProps {
    handleReset: () => void;
    handlePlayerChange: (player: Color) => (value: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ handleReset, handlePlayerChange }) => {
    const players = ["human", "bot"];
    const options = players.map( player => <option value={player}>{player}</option>);

    return (
        <div className="control-panel">
            <div className="control-panel-top">
                <p>
                    <button onClick={handleReset}>Reset</button>
                </p>
            </div>
            <div>
                <hr/>
            </div>
            <div className="control-panel-config">
                <p>
                    Player 1 (X):
                    <select
                        defaultValue="human"
                        onChange={(ev) => handlePlayerChange("X")(ev.target.value)}
                    >
                        {options}
                    </select>
                </p>
                <p>
                    Player 2 (O):
                    <select
                        defaultValue="bot"
                        onChange={(ev) => handlePlayerChange("O")(ev.target.value)}
                    >
                        {options}
                    </select>
                </p>
            </div>
        </div>
    )
}

interface ScoreProps {
    to_move: Color;
    config: PlayerConfig;
}

const Score: React.FC<ScoreProps> = ({ to_move, config }) => {
    return (
        <div>
            <p>
                Player to move: {to_move}
            </p>
            <p>
                Player type: { config[to_move].kind }
            </p>
        </div>
    )
}

interface MoveListProps {
    move_list: Array<Field>;
}

const MoveList: React.FC<MoveListProps> = ({ move_list }) => {
    const moves = move_list.map(move => <li key={move}>{move}</li>);

    return (
        <div>
            Move list:
            <ol>
                {moves}
            </ol>
        </div>
    )
}

const Game = () => {
    const [pos, setPos] = useState<string>(INIT_POS);
    const [to_move, setToMove] = useState<Color>("X");
    const [candidates, setCandidates] = useState<Array<string>>([]);
    const [move_list, setMoveList] = useState<Array<Field>>([]);

    const [config, setConfig] = useState<PlayerConfig>(defaultPlayerConfig);
    const isHuman = is_human(config[to_move]);

    useEffect(() => {
        fetchMoves(pos, to_move).then(moves => setCandidates(moves));
    }, []); // we only want useEffect to run once

    const update_state_after_move = ({ pos: newPos, moves, move }: AfterMoveResult) => {
        const next_to_move = opposite_player(to_move);

        setPos(newPos);
        setToMove(next_to_move);
        setCandidates(moves);
        setMoveList([...move_list, move]);
    }

    useEffect(() => {
        if (!isHuman) {
            fetchBotMove(pos, to_move)
                .then(update_state_after_move);
        }
    }, [isHuman, pos, to_move]);

    const handleMove = (field: string) => {
      fetchPositionAfterMove(pos, to_move, field)
        .then(update_state_after_move);
    }

    const handleReset = () => {
        setPos(INIT_POS);
        setToMove("X");
        setCandidates([]);
        setMoveList([]);

        fetchMoves(INIT_POS, "X").then(moves => setCandidates(moves));
    }

    const handlePlayerChange = (player: Color) => (value: string) => {
        setConfig({...config, [player]: playerOfString(value)});
    }

    return (
        <main>
            <div className="game">
                <MoveList move_list={move_list} />
                <div className="middle-panels">
                    <Board pos={pos} candidates={candidates} handleMove={handleMove} isHuman={isHuman} />
                    <ControlPanel handleReset={handleReset} handlePlayerChange={handlePlayerChange} />
                </div>
                <Score to_move={to_move} config={config}/>
            </div>
        </main>
    );
}

export default Game;
