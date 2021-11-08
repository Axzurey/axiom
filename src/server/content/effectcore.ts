import { RunService } from "@rbxts/services";
import characterClass from "server/character";

export default class effect {
    ctx: characterClass;
    alive: boolean = false;
    constructor(ctx: characterClass) {
        this.ctx = ctx;
        this.alive = true;
        let conn = RunService.Heartbeat.Connect((dt) => {
            if (!this.alive) {conn.Disconnect(); return;}
            this.everyFrame(dt);
        })
    }
    public everyFrame(dt: number) {}
    public destroy() {
        this.alive = false;
    }
}