import { atom } from "recoil";
export var isBoardFlippedAtom = atom({
    key: "isBoardFlippedAtom",
    default: false,
});
export var movesAtom = atom({
    key: "movesAtom",
    default: [],
});
export var userSelectedMoveIndexAtom = atom({
    key: "userSelectedMoveIndexAtom",
    default: null,
});
