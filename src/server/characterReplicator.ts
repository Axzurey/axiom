import { Players } from "@rbxts/services";
import sohk from "shared/sohk/init";

const maxAllowedDifference = 16 * (1 / 60); //16 studs a second, multiplied by 1 / 60th of a second

export default class characterReplicator extends sohk.sohkComponent {
    lastCFrames: Record<number, {cf: CFrame, pass: boolean, delta: number}> = {};
    constructor() {
        super();
        const conn = this.replicationService.remotes.replicateCharacter.OnServerEvent.Connect((client, ...args: unknown[]) => {
            let cf = args[0] as CFrame;
            if (!cf) return;
            this.changeCFrame(client, cf);
        })
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
        if (pass) return true;
        dir.pass = false;

        let difference = (position.sub(last.Position)).Magnitude;
        let delta = tick() - dir.delta;
        let ideal = 1 / 60;
        
        let deltaoff = ideal - delta;
        let ispos = deltaoff >= 0? true: false;
        deltaoff = math.abs(deltaoff);

        if (difference > maxAllowedDifference) {
            return false;
        }

        return true;
    }
    changeCFrame(client: Player, cf: CFrame) {
        Players.GetPlayers().forEach((player) => {
            if (player === client) return;
            this.replicationService.remotes.replicateCharacter.FireClient(player, client, cf);
        })
        let reEval = this.validateCFrame(client, cf);
        if (!reEval) {
            Players.GetPlayers().forEach((player) => {
                if (player === client) return;
                this.replicationService.remotes.replicateCharacter.FireClient(player, client, cf);
            })
            this.replicationService.remotes.replicateCharacter.FireClient(
                client, this.lastCFrames[client.UserId].cf);
        }

    }
}