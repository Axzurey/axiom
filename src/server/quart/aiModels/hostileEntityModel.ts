import { PathfindingService, Workspace } from "@rbxts/services";
import { mathf } from "shared/modules/System";
import phyxConnection from "shared/phyx/phyxConnection";
import quart from "..";
import aiModel, { aiModelParams } from "../quartAiModel";
import quartUtils, { range } from "../quartUtils";

export interface hostileAiParams extends aiModelParams {
    seeksTarget: boolean,
}

export default class hostileEntityModel extends aiModel {
    target: Model | undefined = undefined;
    targettedPart: BasePart | undefined = undefined;

    potentialTargets: Model[] = [];
    predefineddLocations: Vector3[] = [];
    lastLocationIndex: number = 0;

    moving: boolean = false;

    fieldOfView: number = 80;

    private _onMCanCall:( () => void)[] = []
    onMovementCancelled = new phyxConnection<() => void>(this._onMCanCall)
    //make them walk and turn randomly?

    constructor(params: hostileAiParams) {
        super(params);
    }
    private isTargetStillVisible(v: Model) {
        let origin = this.model.PrimaryPart as BasePart;
        const iterate = v.GetChildren()
        for (const [i, v] of pairs(iterate)) {
            if (v.IsA('BasePart')) {
                let originCFrame = origin.CFrame;
                let lookVector = originCFrame.LookVector;
                let upVector = originCFrame.UpVector;
                let direction = (v.Position.sub(origin.Position)).Unit;

                let length = (v.Position.sub(origin.Position)).Magnitude;

                let angle = mathf.angleBetween(lookVector, direction);

                if (math.abs(angle) <= this.fieldOfView / 2) {
                    let result = quart.interactiveRaycast(originCFrame.Position, direction.mul(length), {
                        useGlobalIgnore: true,
                        ignorePlayers: true,
                    })
                    if (result) {
                        continue; //blocked
                    }
                    else {
                        return true; //nothing obscuring it so it's fine
                    }
                }
            }
        }
        return false;
    }
    private searchForTarget(): [number, BasePart] | undefined {
        for (const [i, v] of pairs(this.potentialTargets)) {
            let origin = this.model.PrimaryPart as BasePart;
            if (origin) {
                //check if the head can see target from fov
                const iterate = v.GetChildren()
                let selectedPart: BasePart | undefined = undefined;
                for (const [i, v] of pairs(iterate)) {
                    if (v.IsA('BasePart')) {
                        let originCFrame = origin.CFrame;
                        let lookVector = originCFrame.LookVector;
                        let direction = (v.Position.sub(origin.Position)).Unit;

                        let length = (v.Position.sub(origin.Position)).Magnitude;

                        let angle = mathf.angleBetween(lookVector, direction);

                        if (math.abs(angle) <= this.fieldOfView / 2) {
                            let result = quart.interactiveRaycast(originCFrame.Position, direction.mul(length), {
                                useGlobalIgnore: true,
                                ignorePlayers: true,
                            })
                            if (result) {
                                continue; //blocked
                            }
                            else {
                                selectedPart = v; //nothing obscuring it so it's fine
                                break;
                            }
                        }
                    }
                }
                if (selectedPart) {
                    return [i, selectedPart] //keyof potentialTargets, partThatItDetected
                }
            }
            else {
                throw `potential target ${i} does not have a primary part set`
            }
        }
    }
    isDirectionObscured(origin: Vector3, direction: Vector3, distance: number) {
        let cast = quart.interactiveRaycast(origin, direction.mul(distance), {
            ignorePlayers: true,
            useGlobalIgnore: true,
        })
        return cast? true: false;
    }
    castUntilBlocked(origin: Vector3, direction: Vector3, startLength: number, maxLength: number, step: number = 1) {
        let pass = false;
        let distance = startLength;
        let i = step;
        while (true) {
            if (startLength + i >= maxLength) {
                distance = maxLength
                break;
            }
            let cast = quart.interactiveRaycast(origin, direction.mul(startLength + i), {
                ignorePlayers: true,
                useGlobalIgnore: true,
            })
            if (cast) {
                break;
            }
            else {
                i += step;
                distance = startLength + i
            }
        }
        return distance;
    }
    randomMove() {
        let originCFrame = (this.model.PrimaryPart as BasePart).CFrame;
        let directionBlocked = this.isDirectionObscured(originCFrame.Position, originCFrame.LookVector, 10);
        let chosenDirection = originCFrame.LookVector;
        if (directionBlocked) {
            let pass = false;
            let t = math.atan2(chosenDirection.X, chosenDirection.Y);
            let currentdeg = t
            while (true) {
                print("checking turn!", math.deg(t), 'original:', math.deg(currentdeg))
                let [x, y] = [math.cos(t), math.sin(t)]
                let vector = new Vector3(x, y, 0);
                if (!this.isDirectionObscured(originCFrame.Position, vector, 10)) {
                    // if it aint blocked
                    pass = true;
                    chosenDirection = vector;
                    directionBlocked = false;
                    print('turn passed!', t)
                    //still flips a full 180!
                    //also, maybe use pathfinding to move to predetermined locations?
                    break;
                }
                else if (t > currentdeg + 360) {
                    break;
                }
                t += 1;
            }
        }
        if (!directionBlocked) {
            let maximumDistanceInDirection = this.castUntilBlocked(originCFrame.Position, chosenDirection, 10, 50);
            let target = originCFrame.Position.add(chosenDirection.mul(maximumDistanceInDirection - 5));
            let humanoid = this.model.FindFirstChild('Humanoid') as Humanoid;
            if (humanoid) {
                this.moving = true;
                humanoid.MoveTo(target);
                humanoid.MoveToFinished.Wait();
                this.moving = false;
            }
            else {
                throw `entity can not move, as it has no humanoid...`
            }
        }
        else {
            //unable to move
        }
    }
    moveCloseToTarget() {
        let target = this.target;
        if (target) {

        }
    }
    private setTarget(index: number) {
        if (index > this.potentialTargets.size() - 1) {
            throw `index ${index} exceeds potential target size of ${this.potentialTargets.size()}`
        }
        this.target = this.potentialTargets[index];
    }
    private turnTowards(point: Vector3) {
        let cf = this.model.GetPrimaryPartCFrame();
        this.model.SetPrimaryPartCFrame(CFrame.lookAt(cf.Position, new Vector3(point.X, cf.Position.Y, point.Z)))
    }
    private searchAndMoveToPredefined() {
        if (this.predefineddLocations.size() === 0) throw `predefined locations has a size of zero. initialize the object with some for this to work!`

        this.moving = true;
        
        const humanoid = this.model.FindFirstChild('Humanoid') as Humanoid;

        if (!humanoid) throw `entityModel must have a humanoid for it to move!`
        
        let copy: number[] = []

        for (let i = 0; i < this.predefineddLocations.size(); i++) {
            if (i !== this.lastLocationIndex) {
                copy.push(i)
            }
        }

        this.lastLocationIndex = copy[math.random(0, copy.size() - 1)];
        let selection = this.predefineddLocations[this.lastLocationIndex];
        const path = PathfindingService.CreatePath({
            AgentCanJump: false,
            AgentHeight: 5,
            AgentRadius: 2,
        })
        path.ComputeAsync(this.model.GetPrimaryPartCFrame().Position, selection)
        let waypoints = path.GetWaypoints();
        
        let i = 0;
        let can = true;
        while (can) {
            if (i >= waypoints.size()) break;
            let index = waypoints[i];
            humanoid.MoveTo(index.Position)
            this.onMovementCancelled.connect(() => {
                print("movement cancelled")
                can = false;
                this.moving = false;
                humanoid.MoveTo(this.model.GetPrimaryPartCFrame().Position)
            })
            humanoid.MoveToFinished.Wait();
            i ++;
        }

        this.moving = false;
    }
    override onHeartbeat(dt: number): void {
        if (!this.model.PrimaryPart) return;
        if (this.target) {
            //this._onMCanCall[0]()
        }
        else {
            let searched = this.searchForTarget();
            if (searched) {
                this.setTarget(searched[0])
            }
            else {
                if (!this.moving) {
                    print("switching target!")
                    this.searchAndMoveToPredefined()
                }
            }
        }
    }
}