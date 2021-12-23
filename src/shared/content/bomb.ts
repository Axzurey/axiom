import { Workspace } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import animationsMap from "./mapping/animations";
import weaponCore from "./weaponCore";

export default class bomb extends weaponCore {
    isAGun = false;
    isAMelee = false;
    canAim = false;
    canLean = false;
    constructor(ctx: fps_framework) {
        super(ctx, {
            slotType: 'bomb',
            animationIds: {
                equip: animationsMap.bomb_plant,
            },
            skin: 'default',
            name: 'bomb',
        });
    }
    animate() {
        let floor = this.ctx.bombClass.originPlantPosition();
        if (!floor) throw `could not find a suitable floor`;
        let camCF = this.ctx.camera.CFrame;
        let look = CFrame.lookAt(camCF.Position, floor.Position);
        
    }
}