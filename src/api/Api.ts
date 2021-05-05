import { Position, Status } from "../components/Types";

const HOST = "http://localhost:9000";

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchStatus = async (pos: Position): Promise<Status> => {
    const response = await fetch(`${HOST}/status?pos=${pos.board}&to_move=${pos.toMove}`);
    const json = await response.json();
    return json;
}

export const fetchBotMove = async (pos: Position): Promise<string> => {
    const response = await fetch(`${HOST}/bot?pos=${pos.board}&to_move=${pos.toMove}`);
    const move = await response.text();
    await sleep(3000);
    return move;
}

export const fetchPositionAfterMove = async (pos: Position, move: string): Promise<string> => {
    const response = await fetch(`${HOST}/make_move?pos=${pos.board}&to_move=${pos.toMove}&move=${move}`);
    const newPos = await response.text();
    return newPos;
}
