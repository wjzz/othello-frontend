const HOST = "http://localhost:9000";

const fetchMoves = async (pos: string, to_move: string): Promise<Array<string>> => {
    const response = await fetch(`${HOST}/candidates?pos=${pos}&to_move=${to_move}`);
    const json = await response.json();
    if (Array.isArray(json)) {
        return json;
    }
    console.error("/candidates didn't return an array!");
    return [];
}

export interface AfterMoveResult {
    pos: string;
    moves: Array<string>;
}

const fetchPositionAfterMove = async (pos: string, to_move: string, move: string): Promise<AfterMoveResult> => {
    const response = await fetch(`${HOST}/make_move?pos=${pos}&to_move=${to_move}&move=${move}`);
    const json = await response.json();
    return json;
}


export {
    fetchMoves,
    fetchPositionAfterMove,
}