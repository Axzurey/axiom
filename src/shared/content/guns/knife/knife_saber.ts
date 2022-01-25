import fps_framework from "shared/modules/fps";
import weaponCore from "../../weaponCore";
import animationsMap from "shared/content/mapping/animations";

export default class knife_saber extends weaponCore {
    isAGun = false;
    isAMelee = true;
    canAim = false;
    canLean = false;
    inverseMovementTilt = false;
    bobIntensityModifier = 1;
    bobSpeedModifier = 1;
    constructor(ctx: fps_framework) {
        super(ctx, {
            name: 'knife',
            animationIds: {
                idle: animationsMap.knife_saber_idle,
                swing: animationsMap.knife_saber_swing,
            },
            skin: 'saber',
            slotType: 'melee',
        });
    }
}