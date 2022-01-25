interface v<T> {
    expected: T[],
    value: any,
}

export default function verifyValues(typeArray: v<any>[]): boolean {
    let retF = true;
    for (const [i, v] of pairs(typeArray)) {
        if (v.expected.indexOf(v.value) === -1) {
            retF = false;
        }
    }
    return retF;
}