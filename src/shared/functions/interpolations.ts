//elapsed time, begin, change(ending - beginning), duration

const interpolations = {
    linear: (t: number, b: number, c: number, d: number) => {
        return c * t / d + b;
    },
    quadIn: (t: number, b: number, c: number, d: number) => {
        t = t / d;
        return c * math.pow(t, 2) + b;
    },
    quadOut: (t: number, b: number, c: number, d: number) => {
        t = t / d;
        return -c * t * (t - 2) + b;
    },
    quadInOut: (t: number, b: number, c: number, d: number) => {
        t = t / d * 2
        if (t < 1) {
            return c / 2 * math.pow(t, 2) + b
        }
        else {
            return -c / 2 * ((t - 1) * (t - 3) - 1) + b
        }
    },
    elasticIn: (t: number, b: number, c: number, d: number) => {
        if (t === 0) return b;

        t = t / d

        if (t === 1) return b + c;

        let p = d * .3

        let a = c;
        let s = p / 4;

        t -= 1;

        return -(a * math.pow(2, 10 * t) * math.sin((t * d - s) * (2 * math.pi) / p)) + b;
    }
}

function interpolate(t: number, n0: number, n1: number, style: keyof typeof interpolations) {
    let begin = n0;
    let _end = n1;
    let change = _end - begin;
    let duration = 1;
    let fx = interpolations[style];
    return fx(t, begin, change, duration);
}

function interpolateV3(t: number, v0: Vector3, v1: Vector3, style: keyof typeof interpolations) {
    let x = interpolate(t, v0.X, v1.X, style);
    let y = interpolate(t, v0.Y, v1.Y, style);
    let z = interpolate(t, v0.Z, v1.Z, style);
    return new Vector3(x, y, z);
}

function interpolateV2(t: number, v0: Vector2, v1: Vector2, style: keyof typeof interpolations) {
    let x = interpolate(t, v0.X, v1.X, style);
    let y = interpolate(t, v0.Y, v1.Y, style);
    return new Vector2(x, y);
}

export = {
    interpolate: interpolate,
    interpolateV3: interpolateV3,
    interpolateV2: interpolateV2,
}