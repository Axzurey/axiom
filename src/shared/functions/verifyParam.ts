import { t } from "@rbxts/t";

export default function verifyParam(expected: t.check<any>[], got: unknown[]) {
    let pass = true;
    expected.forEach((v, i) => {
        let index = got[i];
        if (index) {
            if (v(index)) {
                return
            }
            else {
                pass = false;
            };
        }
        else {
            pass = false;
        }
    })
    return pass;
}