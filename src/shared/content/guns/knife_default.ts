import fps_framework from "shared/modules/fps";
import weaponCore from "../weaponCore";

export default class knife_default extends weaponCore {
    isAGun = false;
    isAMelee = true;
    canAim = false;
    canLean = false;
    inverseMovementTilt = true;
    constructor(ctx: fps_framework) {
        super(ctx, {
            name: 'knife',
            animationIds: {
                idle: 'rbxassetid://7816808516',
                swing: 'rbxassetid://7817133381',
            },
            skin: 'default',
            slotType: 'melee',
        });
        //this.isAGun = false;
        //this.isAMelee = true;
        //this.canAim = false;
        //this.canLean = false;
    }
}