import characterClass from "server/character";
import weaponCore from "../weaponCore";
import minerva from "shared/minerva";
import projectile from "shared/classes/projectile";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import projectile_protocol_create from "shared/protocols/projectile_protocol_create";
import projectile_protocol_freeze from "shared/protocols/projectile_protocol_freeze";

export default class muon_item extends weaponCore {
    term = 0;
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
    }
    reload(): void {
        
    }
    fire(origin: Vector3, look: Vector3): void {
        this.term ++;
        let object = (ReplicatedStorage.WaitForChild('guns').WaitForChild('muon').WaitForChild('muon_blank') as Model).Clone();
        object.GetChildren().forEach((v) => {
            if (v.IsA('BasePart')) {
                v.Transparency = 1;
                v.Color = new Color3(1, 0, 0)
                v.Anchored = true;
            }
        })
        object.SetPrimaryPartCFrame(new CFrame(origin));
        object.Parent = Workspace;

        const objectPath = 'ReplicatedStorage//guns//muon//muon_blank';
        
        Players.GetPlayers().forEach((v) => {
            if (v === this.client) return;
            projectile_protocol_create.fireClient(v, `$server_projectile:muon:${this.term}`, objectPath, origin, look, new Vector3(0, -50, 0), 100, 50)
        })

        print('server', origin, look, new Vector3(0, -50, 0), 100, 50)

        let p = new projectile({
            origin: origin,
            direction: look,
            gravity: new Vector3(0, -50, 0),
            ignoreInstances: [this.client.Character as Instance],
            lifeTime: 50,
            velocity: 100,
            onHit: () => {
                projectile_protocol_freeze.fireClient(this.client, `$client_projectile:muon:${this.term}`, object.GetPrimaryPartCFrame())
                Players.GetPlayers().forEach((v) => {
                    if (v === this.client) return;
                    projectile_protocol_freeze.fireClient(v, `$server_projectile:muon:${this.term}`, object.GetPrimaryPartCFrame())
                })
            },
            onTerminated: () => {
                
            },
            instance: object
        })
    }
}