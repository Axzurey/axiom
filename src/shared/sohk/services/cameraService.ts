namespace cameraService {
    export function bob(speed: number, intensity: number) {
        return math.sin(tick() * speed) * intensity;
    }
    export function bobLemnBern(speed: number, intensity: number): [number, number] {
        let t = tick() * speed;
        let scale = 2 / (3 - math.cos(2 * t))
        return [scale * math.cos(t) * intensity, scale * math.sin(2 * t) / 2 * intensity]
    }
}

export = cameraService;