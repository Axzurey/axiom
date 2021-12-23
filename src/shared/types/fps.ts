import ability_core from "shared/content/abilitycore";
import weaponCore from "shared/content/weaponCore";

namespace fps_framework_types {
    export interface loadout {
        primary: {
            module: weaponCore,
            equipped: boolean,
            sight: {
                name: string,
            }
        },
        melee: {
            module: weaponCore,
            equipped: boolean,
        },
        bomb: {
            module: weaponCore,
            equipped: boolean,
        }
    }
    export interface abilityloadout {
        primaryAbility: {
            module: ability_core,
            equipped: boolean,
        },
        secondaryAbility: {
            module: ability_core,
            equipped: boolean,
        },
    }
    export type bombViewmodel = Model & {
        controller: AnimationController & {
            animator: Animator
        },
        rightArm: MeshPart,
        leftArm: MeshPart,
        leftHand: Part,
        rightHand: Part,
        rootpart: Part,
        main: Part,
        offsets: Folder & {
            idle: CFrameValue,
        }
    }
    export type viewmodel = Model & {
        controller: AnimationController & {
            animator: Animator
        },
        rightArm: MeshPart,
        leftArm: MeshPart,
        leftHand: Part,
        rightHand: Part,
        rootpart: Part,
        aimpart: Part,
        barrel: Part,
        sightNode: Part,
        mag: MeshPart,
        bolt: MeshPart,
        main: MeshPart,
        audio: Folder & {
            boltback: Sound,
            boltforward: Sound,
            magin: Sound,
            magout: Sound,
            fire: Sound,
        },
        offsets: Folder & {
            idle: CFrameValue,
        }
    }

    export type unloaded_viewmodel = Model & {
        controller: AnimationController & {
            animator: Animator
        },
        leftHand: Part,
        rightHand: Part,
        rightArm: MeshPart,
        leftArm: MeshPart,
        rootpart: Part,
        offsets: Folder & {
            idle: CFrameValue,
        }
    }
}

export = fps_framework_types;