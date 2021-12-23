namespace curves {
    export function catenary(a: number, h: number, k: number) {
        return function(x: number) {
            return a * math.cosh(x / a - h) + k;
        }
    }
    export function quadratic(a: number, h: number, k: number) {
        return function(x: number) {
            return a * (x - h) ^ 2 + k;
        }
    }
    export function sine(a: number, h: number, k: number) {
        return function(x: number) {
            return a * math.sin(x - h) + k;
        }
    }
}

export = curves;