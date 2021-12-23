import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import characterClass from "server/character";
import ability_Core from "../abilitycore";

export default class laser_turret extends ability_Core {
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
        this.init();
    }
    amount = 1;
    targetPosition: Vector3 = new Vector3();
    target: boolean = false;
    lookVector: Vector3 = new Vector3();
    fov: number = 75;
    range: number = 50;
    searchForTarget(pos: Vector3) {
        this.target = false;
        Players.GetPlayers().forEach((v) => {
            if (v.Character) {
                let char = v.Character;
                v.Character.GetChildren().forEach((v) => {
                    if (v.IsA('BasePart')) {
                        let unit = (v.Position.sub(pos)).Unit;
                        let dot = this.lookVector.Dot(unit);
                        let deg = math.acos(math.clamp(dot, -1, 1));
                        if (math.abs(deg) <= math.rad(this.fov) / 2) { //if it's within the fov
                            let distance = (v.Position.sub(pos)).Magnitude;
                            if (distance > this.range) return; //if it's too far, return;
                            const ignore = new RaycastParams();
                            ignore.FilterDescendantsInstances = [Workspace.FindFirstChild('ignore') as Folder];
                            let result = Workspace.Raycast(pos, unit.mul(this.range), ignore);
                            if (result && result.Instance.Parent !== char) return; //if it's blocked, return
                            this.target = true;
                            this.targetPosition = v.Position;
                        }
                    }
                });
            }
        })
    }
    override activate(args: unknown[]) {
        if (this.amount < 1) return;
        const cf = args[0] as CFrame;
        if (!cf) return;
        this.lookVector = cf.LookVector;
        let model = ReplicatedStorage.FindFirstChild('abilities')?.FindFirstChild('laser_turret')?.Clone() as Model;
        model.SetPrimaryPartCFrame(cf);
        model.Parent = Workspace.FindFirstChild("world");
        this.amount --;
        let [_cf, size] = model.GetBoundingBox();
        let reg = Workspace.GetPartBoundsInBox(cf, size);
        let touching = false;
        reg.forEach((v) => {
            if (v.Parent === Workspace.FindFirstChild('ignore') as Folder || v.Parent === model) return;
            touching = true;
        })
        //if (touching) return;
        let conn = RunService.Heartbeat.Connect((dt) => {
            if (this.target) {
                
            }
            else {
                this.searchForTarget(model.GetPrimaryPartCFrame().Position);
            }
        });
    }
}