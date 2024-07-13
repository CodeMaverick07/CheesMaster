import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/user.js";
export var useUser = function () {
    var value = useRecoilValue(userAtom);
    return value;
};
