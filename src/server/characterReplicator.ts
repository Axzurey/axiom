import { Players } from "@rbxts/services";
import sohk from "shared/sohk/init";

const maxAllowedDifferenceX = 15;
const maxAllowedDifferenceY = 10;
const maxAllowedDifferenceZ = 15;

const maxHeight = 100;
const minHeight = -100;

export default class characterReplicator extends sohk.sohkComponent {
    lastCFrames: Record<number, {cf: CFrame, pass: boolean, delta: number}> = {};
    constructor() {
        super();
    }
    newPlayer(client: Player) {
        this.lastCFrames[client.UserId] = {
            cf: new CFrame(-1, -1, -1),
            delta: tick(),
            pass: true,
        };
    }
    validateCFrame(client: Player, cf: CFrame) {
        let position = cf.Position;
        let [rx, ry, rz] = cf.ToOrientation();
        let dir = this.lastCFrames[client.UserId];
        let pass = dir.pass;
        let last = dir.cf;
        if (pass) {
            dir.pass = false;
            return true;
        }

        let differenceX = math.abs(last.Position.X - position.X);
        let differenceY = math.abs(last.Position.Y - position.Y);
        let differenceZ = math.abs(last.Position.Z - position.Z)
        let delta = tick() - dir.delta;
        let ideal = 1 / 60;
        
        let deltaoff = ideal - delta;
        let ispos = deltaoff >= 0? true: false;
        deltaoff = math.abs(deltaoff);

        if (differenceX > maxAllowedDifferenceX || differenceY > maxAllowedDifferenceY || differenceZ > maxAllowedDifferenceZ) {
            print(dir.cf.Position, cf.Position, 'not allowed')
            return false;
        }
        else if (position.Y > maxHeight || position.Y < minHeight) {
            print('y not above max height')
            return false;
        }

        return true;
    }
    setCFrame(player: Player, cf: CFrame) {
        let dir = this.lastCFrames[player.UserId];
        dir.cf = cf;
        dir.delta = tick();
    }
    getLast(player: Player) {
        return this.lastCFrames[player.UserId].cf;
    }
    givePass(player: Player) {
        this.lastCFrames[player.UserId].pass = true;
    }
}