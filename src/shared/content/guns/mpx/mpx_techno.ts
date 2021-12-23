import animationsMap from "shared/content/mapping/animations";
import minerva from "shared/minerva";
import fps_framework from "shared/modules/fps";
import weaponCore from "../../weaponCore";

export default class mpx_techno extends weaponCore {
    constructor(ctx: fps_framework, attachments: {sight?: string}) {
        super(ctx,
            {
                name: 'mpx',
                animationIds: {
                    idle: animationsMap.mpx_idle,
                    reload: animationsMap.mpx_reload,
                },
                slotType: 'primary',
                skin: 'techno',
                attachments: attachments,
            }
        );
        this.reloadLength = minerva.reloadLengths.mpx;
    }
}