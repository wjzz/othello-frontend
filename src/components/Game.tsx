import React, { useEffect, useState } from 'react';
import { fetchBotMove, fetchPositionAfterMove, fetchStatus } from '../api/Api';
import { Color, PlayerConfig, Field, defaultPlayerConfig, is_human, playerOfString, initialPosition, Position, Status, opposite_color } from './Types';
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
    status: Status | null;
}

const Score: React.FC<ScoreProps> = ({ to_move, config, status }) => {
    if (!!status && status.gameFinished) {
        const { difference, winner } = status;
        if (difference === 0) {
            return (
                <div>
                    DRAW!
                </div>
            );
        } else {
            return (
                <div>
                    {winner} wins by {Math.abs(difference)}!
                </div>
            )
        }
    }

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
    const [pos, setPos] = useState<Position>(initialPosition());
    const [status, setStatus] = useState<Status | null>(null);
    const [lastMove, setLastMove] = useState<Field | null>(null);

    const [move_list, setMoveList] = useState<Array<Field>>([]);

    const [config, setConfig] = useState<PlayerConfig>(defaultPlayerConfig);
    const isHuman = is_human(config[pos.toMove]);

    // Initialization before the first move
    useEffect(() => {
        if (status === null) {
            fetchStatus(pos).then(status => setStatus(status));
        }
    }, []);

    const state_after_move = (newBoard: string) => {
        const newPos = {
            toMove: opposite_color(pos.toMove),
            board: newBoard,
        };
        return newPos;
    }

    useEffect(() => {
        if (!isHuman) {
            fetchBotMove(pos).then(move =>
                handleMove(move));
        }
    }, [isHuman, pos]);

    const handleMove = async (move: string) => {
        const newBoard = await fetchPositionAfterMove(pos, move);
        let newPos = state_after_move(newBoard);
        let status = await fetchStatus(newPos);

        let new_move_list = [...move_list, move];
        let last_move = move;

        if (status.passForced) {
            alert("PASS!");
            new_move_list.push("pass");
            last_move = "pass";
            
            newPos = state_after_move(newBoard);
            status = await fetchStatus(newPos);
        }

        setMoveList(new_move_list);
        setLastMove(last_move);
        setPos(newPos);
        setStatus(status);
    }

    const handleReset = () => {
        setPos(initialPosition());
        setStatus(null);
        setLastMove(null);
        setMoveList([]);
        fetchStatus(pos).then(status => setStatus(status));
    }

    const handlePlayerChange = (player: Color) => (value: string) => {
        setConfig({...config, [player]: playerOfString(value)});
    }

    return (
        <main>
            <div className="game">
                <MoveList move_list={move_list} />
                <div className="middle-panels">
                    <Board
                        pos={pos}
                        lastMove={lastMove}
                        status={status}
                        handleMove={handleMove}
                        isHuman={isHuman}
                    />
                    <ControlPanel handleReset={handleReset} handlePlayerChange={handlePlayerChange} />
                </div>
                <Score to_move={pos.toMove} config={config} status={status} />
            </div>
        </main>
    );
}

export default Game;
