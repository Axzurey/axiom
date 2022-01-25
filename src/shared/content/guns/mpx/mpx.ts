import animationsMap from "shared/content/mapping/animations";
import minerva from "shared/minerva";
import fps_framework from "shared/modules/fps";
import weaponCore from "../../weaponCore";

export default class mpx_default extends weaponCore {
    constructor(ctx: fps_framework, attachments: {sight?: string}) {
        super(ctx,
            {
                name: 'mpx',
                animationIds: {
                    idle: animationsMap.mpx_idle,
                    reload: animationsMap.mpx_reload,
                    equip: animationsMap.mpx_equip,
                },
                slotType: 'primary',
                skin: 'default',
                attachments: attachments,
            }
        );
        this.reloadLength = minerva.reloadLengths.mpx;
    }
}