namespace cameraService {
    export function bob(plus: number, speed: number, mod: number) {
        return math.sin(tick() * plus * speed) * mod;
    }
}

export = cameraService;