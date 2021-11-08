interface spring {
    update(dt: number): Vector3;
    shove(force: Vector3): void;
    Target: Vector3,
    Position: Vector3,
    Velocity: Vector3,
    Mass: number,
    Force: number,
    Damping: number,
    Speed: number
}

interface springconstructor {
    create (mass?: number, force?: number, damping?: number, speed?: number): spring
}

declare const spring: springconstructor

export = spring;