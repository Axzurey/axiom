namespace cameraService {
    export function bob(speed: number, mod: number) {
        return math.sin(tick() * speed) * mod;
    }
}

export = cameraService;