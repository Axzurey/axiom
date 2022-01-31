import fps_framework from "shared/modules/fps";
import weaponCore from "../weaponCore";

export default class blank_arms extends weaponCore {
    constructor(ctx: fps_framework) {
        super(ctx, {
            name: 'basic_arms',
            animationIds: {},
            slotType: 'special',
            skin: 'none',
        });
    }
    setUpExtraAnimation(name: string, animationObject: Animation) {
        let vm = this.viewmodel;
        let animator = vm.controller.animator;
        let anim = animator.LoadAnimation(animationObject);
        this.extraAnimations[name] = anim;
    }
    playExtraAnimation(name: string) {
        if (this.extraAnimations[name]) {
            this.extraAnimations[name].Play();
        }
    }
}