import weaponCore from 'server/content/weaponCore'
import characterClass from './character';
import ability_Core from './content/abilitycore';

declare interface clientData {
    charClass: characterClass,
    loadout: {
        primary: {
            name: string,
            module: weaponCore
        },
        melee: {
            name: string,
            module: weaponCore,
        },
        primaryAbility: {
            name: string,
            module: ability_Core
        },
        secondaryAbility: {
            name: string,
            module: ability_Core
        }
    },
}

declare type userid = number;