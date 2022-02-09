import weaponCore from 'server/content/weaponCore'
import characterClass from './character';
import ability_Core from './content/abilitycore';

declare interface clientData {
    charClass: characterClass,
    loadout: {
        primary: {
            name: string,
            skin: string,
            module: weaponCore,
        },
        secondary: {
            name: string,
            skin: string,
            module: weaponCore,
        },
        melee: {
            name: string,
            skin: string,
            module: weaponCore,
        },
        primaryAbility: {
            name: string,
            module: ability_Core
        },
        secondaryAbility: {
            name: string,
            module: ability_Core
        },
        extra1: {
            name: string,
            skin: string,
            module: weaponCore,
        }
    },
}

declare type userid = number;