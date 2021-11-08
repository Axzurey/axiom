import fps_framework from "shared/modules/fps";
import weaponCore from "../../weaponCore";

export default class mpx_default extends weaponCore {
    constructor(ctx: fps_framework) {
        super(ctx, 
            {
                name: 'mpx',
                animationIds: {
                    idle: 'rbxassetid://7694870088'
                },
                slotType: 'primary',
                skin: 'default',
            }
        );
    }
}