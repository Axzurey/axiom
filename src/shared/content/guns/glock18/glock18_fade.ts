import animationsMap from "shared/content/mapping/animations";
import minerva from "shared/minerva";
import fps_framework from "shared/modules/fps";
import weaponCore from "../../weaponCore";

export default class glock18_fade extends weaponCore {
    constructor(ctx: fps_framework, attachments: {sight?: string}) {
        super(ctx,
            {
                name: 'glock18',
                animationIds: {
                    idle: animationsMap.glock18_idle,
                    reload: animationsMap.glock18_reload,
                    equip: animationsMap.glock18_equip,
                    empty: animationsMap.glock18_empty,
                    fire: animationsMap.glock18_fire,
                },
                slotType: 'secondary',
                skin: 'fade',
                attachments: attachments,
            }
        );
        this.firerate = 860;
        this.reloadLength = minerva.reloadLengths.glock18;
    }
}