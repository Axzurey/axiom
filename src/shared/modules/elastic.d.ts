interface elastic {
    GetPosVel: () => number;
    SetPosVel: (p: number, v: number) => void;
    Accelerate(force: number): void;
    p: number,
    v: number,
    t: number,
    d: number,
    s: number,
}

interface elasticConstructor {
    new(init: number): elastic;
}

declare const elastic: elasticConstructor;

export = elastic;