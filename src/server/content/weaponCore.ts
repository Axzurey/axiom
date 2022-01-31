import { Debris, Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import when from "server/world";
import worldData from "shared/worlddata";
import sohk from "shared/sohk/init";
import characterClass from "server/character";
import float from "server/float";
import minerva from "shared/minerva";
import impactSoundMap from "shared/content/mapping/impactSoundMap";
import breach from "shared/classes/breach";

export default class weaponCore extends sohk.sohkComponent {
    client: Player;

    equipped: boolean = false;
    lastEquip: number = tick();

    ammo: number = 30;
    maxAmmo: number = 30;
    ammoOverload: number = 1;
    reserve: number = 210;

    boltsOnEmpty: boolean = true;

    knifeDelay: number = .75;

    stabDamage: number = 75;
    backStabDamage: number = 200;
    meleeRange: number = 7;

    lastStab: number = tick();

    isAMelee: boolean = false;
    isAGun: boolean = true;

    weightMultiplier: number = 1.2;

    penetration: number = 2;
    lastfired: number = tick();
    firerate: number = 700;
    
    lastReload: number = tick();
    reloadCooldown: number = .25;

    fireModes: ('auto' | 'burst 2' | 'burst 3' | 'semi' | 'shotgun')[] = ['auto', 'semi'];
    fireMode: number = 0;
    
    reloading: boolean = false;

    baseDamage: number = 30;
    headDamage: number = 300;
    limbDamage: number = 15;

    remotesLoaded: boolean = false;
    charclass: characterClass;

    type: string = 'primary';

    reloadLength: number = 1.5;
    fullReloadLength: number = 2;

    reloadCancelled: boolean = false;

    constructor(client: Player, charclass: characterClass) {
        super();
        this.client = client;
        this.charclass = charclass;
    }
    equip() {
        if (this.equipped) return;
        if (tick() - this.lastEquip < .25) return;
        this.equipped = true;
        this.lastEquip = tick();
        this.replicationService.remotes.toggleData.Fire('equip', this.client, this.type);
        coroutine.wrap(() => {
            this.replicationService.remotes.requestPlayerAmmo.InvokeClient(this.client, this.ammo, this.maxAmmo + this.ammoOverload, this.reserve);
        })()
    }
    unequip() {
        this.equipped = false;
    }
    fire(origin: Vector3, look: Vector3) {//make sure this allows bursts
        if (!this.equipped) return;
        if (this.isAGun) {
            if (this.ammo <= 0) return;
            if (tick() - this.lastfired < 60 / this.firerate) return;
            this.lastfired = tick();
            this.ammo -= 1;
            let canScan = true;
            let last = origin;
            let pens = 0;
            let ignore = [this.client.Character as Instance];
            let ignore2 = [this.client.Character as Instance];
            coroutine.wrap(() => {
                this.replicationService.remotes.requestPlayerAmmo.InvokeClient(this.client, this.ammo, this.maxAmmo + this.ammoOverload, this.reserve);
            })()
            while (canScan) {
                let result = this.hitscanService.scanForHitAsync({
                    position: last,
                    direction: look,
                    distance: 999,
                    ignore: ignore
                })
                if (result) {
                    let canpen = 0;
                    for (const [i, v] of pairs(worldData.penetratableObjects)) {
                        if (result.Instance.Name.find(i)[0]) {
                            canpen = v;
                        }
                    }
                    let backr = this.hitscanService.scanForHitAsync({
                        position: result.Position,
                        direction: CFrame.lookAt(result.Position, origin).LookVector,
                        distance: 999,
                        ignore: ignore2,
                    })
                    if (backr && pens > 0 && pens < this.penetration) {
                        let position = backr.Position;
                        let normal = backr.Normal;
                        minerva.createBulletHole(position, normal, backr.Material, 12, backr.Instance.Color);
                    }
                    if (result.Instance.Name === "HumanoidRootPart") {
                        ignore.push(result.Instance);
                        continue;
                    }
                    else if (canpen) {
                        pens += canpen;
                        if (pens > this.penetration) {canScan = false; break;}
                    }
                    let position = result.Position;
                    let normal = result.Normal;
                    let hit = result.Instance;
                    let char = hit.Parent;
                    let hum = char?.FindFirstChildOfClass("Humanoid") as Humanoid;
                    let player = Players.GetPlayerFromCharacter(char);
                    if (!hum) {
                        minerva.createBulletHole(position, normal, result.Material, 12, result.Instance.Color);
                        let t = impactSoundMap[result.Material.Name as keyof typeof impactSoundMap] || impactSoundMap.Other;
                        minerva.createSoundAt(position, hit, 4, t);
                    }
                    if (!hum && !canpen) {canScan = false; break;}
                    if (hum) {
                        print('hum')
                        ignore.push(hit.Parent as Instance);
                        if (hum.Health > 0) {
                            hum.TakeDamage(this.baseDamage);
                            if (hum.Health <= 0) {
                                print("bot killed");
                                let info = float.processImpact(this.client, hit, player || {})
                                when.entityKilled.entityDied(this.client, undefined, player? when.entityType.Player:when.entityType.Bot, info.impactLocation);
                            }
                        }
                    }
                    else {
                        ignore.push(hit);
                    }
                    last = result.Position;
                }
                else {canScan = false; break};
            }
        }
        else if (this.isAMelee) {
            if (tick() - this.lastStab < this.knifeDelay) return;
            let result: RaycastResult | undefined = undefined;
            let ignorelist: Instance[] = [this.client.Character as Instance];
            let iterations = 0;
            let iterationUpperClamp = 5;
            while (!result) {
                let ignore = new RaycastParams();
                ignore.FilterDescendantsInstances = ignorelist;
                let r = Workspace.Raycast(origin, look.mul(this.meleeRange), ignore);
                if (r && r.Instance.Name !== 'HumanoidRootPart') {
                    result = r;
                    break;
                }
                iterations++;
                if (iterationUpperClamp <= iterations) break;
            }
            if (result) {
                let hit = result.Instance;
                let normal = result.Normal;
                let position = result.Position;
                let name = hit.Name;
                let character = hit.Parent;
                let humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;
                let rootPart = character?.FindFirstChild("HumanoidRootPart") as BasePart;
                let player = Players.GetPlayerFromCharacter(character);
                if (player) {
                    print("it hit a player! ;)")
                }
                else if (character && worldData.bots[character.Name as keyof typeof worldData.bots]) {
                    print("it hit a bot c:");
                    let rootPartCFrame = rootPart.CFrame as CFrame;
                    let cameraCFrame = CFrame.lookAt(origin, look);
                    let displacement = cameraCFrame.Position.sub(rootPartCFrame.Position);
                    let amf = rootPartCFrame.LookVector.Dot(displacement);
                    print(amf);
                    //if amf < 0 then the killer is behind target;
                    if (amf < 0 && (hit.Name === 'UpperTorso' || hit.Name === 'LowerTorso')) {
                        humanoid?.TakeDamage(this.backStabDamage);
                        print("backstab");
                    }
                    else {
                       humanoid?.TakeDamage(this.stabDamage);
                       print("stab");
                    }
                    let info = float.processImpact(this.client, hit, player || {})
                    when.entityKilled.entityDied(this.client, undefined, player? when.entityType.Player:when.entityType.Bot, info.impactLocation);
                }
                else {
                   let objectImpactCFrame = CFrame.lookAt(position, normal.mul(-1));

                    if (worldData.explicitSolidGlass[name as keyof typeof worldData.explicitSolidGlass]) {

                    } 
                }
                
            }
        }
    }
    reload() {
        if (!this.equipped) return;
        if (this.reloading) return;
        if (this.ammo >= this.maxAmmo + this.ammoOverload) return;
        if (tick() - this.lastReload < this.reloadCooldown) return;
        if (this.reserve <= 0) return;

        /*let length = this.reloadLength;
        if (this.ammo <= 0) {
            length = this.fullReloadLength;
        };*/
        this.reloading = true;

        if (this.ammo >= this.maxAmmo + this.ammoOverload) return;
        if (this.reserve <= 0) return;

        let amountneeded = this.ammo <= 0? this.maxAmmo - this.ammo: (this.maxAmmo + this.ammoOverload) - this.ammo;

        if (!this.reloadCancelled && this.reloading) {
            if (amountneeded > this.reserve) {
                this.ammo = this.ammo + this.reserve;
                this.reserve = 0;
            }
            else if (amountneeded < this.reserve) {
                this.ammo += amountneeded;
                this.reserve -= amountneeded;
            }
        }
        this.reloadCancelled = false;
        this.lastReload = tick();
        this.reloading = false;
        coroutine.wrap(() => {
            this.replicationService.remotes.requestPlayerAmmo.InvokeClient(this.client, this.ammo, this.maxAmmo + this.ammoOverload, this.reserve);
        })()
    }
    loadRemotes() {
        if (this.remotesLoaded) return;
        this.remotesLoaded = true;
        let remotebin = ReplicatedStorage.WaitForChild('remotebin')
        if (this.isAGun) {
            
            let fire = new Instance("RemoteEvent");
            fire.Parent = remotebin;

            fire.OnServerEvent.Connect((_client: Player, ...args: unknown[]) => {
                if (this.client !== _client) {
                    when.playerFiringRemoteThatIsntTheirs(this.client);
                    return;
                }
                this.fire(args[0] as Vector3, args[1] as Vector3);
            })

            let reload = new Instance("RemoteEvent");
            reload.Parent = remotebin;

            reload.OnServerEvent.Connect((_client) => {
                if (this.client !== _client) {
                    when.playerFiringRemoteThatIsntTheirs(this.client);
                    return;
                }
                this.reload();
            })

            let cancelReload = new Instance("RemoteEvent");
            cancelReload.Parent = remotebin;

            cancelReload.OnServerEvent.Connect((_client) => {
                if (this.client !== _client) {
                    when.playerFiringRemoteThatIsntTheirs(this.client);
                    return;
                }
                this.reloadCancelled = true;
                this.reloading = false;
                this.lastReload = 0;
            })

            let firemode = new Instance("RemoteEvent");
            firemode.Parent = remotebin;

            firemode.OnServerEvent.Connect((_client) => {
                if (this.client !== _client) {
                    when.playerFiringRemoteThatIsntTheirs(this.client);
                    return;
                }
                if (this.fireMode >= this.fireModes.size() - 1) {
                    this.fireMode = 0;
                }
                else {
                    this.fireMode += 1;
                }
            })

            let requestAmmo = new Instance("RemoteFunction");
            requestAmmo.Parent = remotebin;

            requestAmmo.OnServerInvoke = (client: Player) => {
                if (client !== this.client) {
                    when.playerFiringRemoteThatIsntTheirs(this.client);
                    return;
                }
                return [this.ammo, this.maxAmmo, this.ammoOverload, this.reserve];
            }

            return {
                remotes: {
                    fire: fire,
                    reload: reload,
                    cancelReload: cancelReload,
                    firemode: firemode,
                },
                calls: {
                    requestAmmo: requestAmmo
                }
            } 
        }
        else if (this.isAMelee) {
            let melee = new Instance("RemoteEvent");
            melee.Parent = remotebin;

            melee.OnServerEvent.Connect((_client: Player, ...args: unknown[]) => {
                if (this.client !== _client) {
                    when.playerFiringRemoteThatIsntTheirs(this.client);
                    return;
                }
                this.fire(args[0] as Vector3, args[1] as Vector3);
            })
            return {
                remotes: {
                    melee: melee
                },
                calls: {},
            }
        }
    }
}