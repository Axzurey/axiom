interface v {
    expected: keyof CheckableTypes,
    value: any,
}

export default function verifyTypes(typeArray: v[]): boolean {
    let retF = true;
    for (const [i, v] of pairs(typeArray)) {
        if (typeOf(v.value) !== v.expected) {
            retF = false;
        }
    }
    return retF;
}