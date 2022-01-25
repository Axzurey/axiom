import { Players, Workspace } from "@rbxts/services";

interface bulletCastResult {
    hit: BasePart,
    position: Vector3,
    normal: Vector3,
    material: Enum.Material,
    player: Player | undefined,
    character: Model & {
        Humanoid: Humanoid,
        HumanoidRootPart: BasePart,
    } | undefined,
    lastImpact: bulletCastResult | undefined,
}

interface bulletParams {
    onHit?: (result: bulletCastResult) => number,
    onTerminated?: () => void,
    maxPenetration: number,
    range: number,
    origin: Vector3,
    direction: Vector3,
    ignoreInstances: Instance[],
    ignoreNames: string[],
    ignoreHumanoidRootPart: boolean,
    ignorePlayers?: Player[],
}

export default class bullet {
    /**
     * 
     * @param params 
     * onHit returns the amount of pierces to that impact takes up.
     */
    constructor(params: bulletParams) {
        let pens = 0;
        let lastImpact: RaycastResult | undefined = undefined;
        let lastIM: bulletCastResult | undefined = undefined;
        let terminated = false;
        let ignorePlayers = params.ignorePlayers || [];
        let ignoreCharacters: Model[] = [];
        ignorePlayers.forEach((v) => {
            if (v.Character) {
                ignoreCharacters.push(v.Character);
            }
        })
        let ignoreInstances = params.ignoreInstances || [];
        let impacted: BasePart[] = [];
        while (!terminated) {
            let ignoreParams = new RaycastParams();
            ignoreParams.FilterDescendantsInstances = [
                ...ignoreInstances,
                ...ignoreCharacters,
                ...impacted,
            ];
            let result = Workspace.Raycast(params.origin, params.direction.mul(params.range), ignoreParams);
            if (result) {
                lastImpact = result;
                let hit = result.Instance;

                impacted.push(result.Instance);

                if ((hit.Name === 'HumanoidRootPart' && params.ignoreHumanoidRootPart) 
                    ||
                    (params.ignoreNames && params.ignoreNames.indexOf(hit.Name) !== -1)) 
                {
                    continue;
                }

                let parent = hit.Parent as Instance;
                let humanoid = hit.FindFirstChild("Humanoid");
                let rootPart = hit.FindFirstChild('HumanoidRootPart');
                let player = Players.GetPlayerFromCharacter(parent);
                if (params.onHit) {
                    lastIM = {
                        hit: hit,
                        position: result.Position,
                        normal: result.Normal,
                        material: result.Material,
                        player: player,
                        character: (humanoid && rootPart)? parent as Model & {
                            Humanoid: Humanoid,
                            HumanoidRootPart: BasePart,
                        }: undefined,
                        lastImpact: lastIM
                    }
                    let increment = params.onHit(lastIM);
                    pens += increment;
                    if (pens >= params.maxPenetration) {
                        terminated = true;
                    }
                }
            }
        }
        if (params.onTerminated) {
            params.onTerminated();
        }
    }
}