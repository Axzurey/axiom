namespace datatypes {
    export type keybinds = Record<
        'fire' | 'reload' | 'primary' | 'secondary' | 'aim' | 'leanLeft' | 'leanRight' | 'prone' | 'crouch' |
        'sprint' | 'sneak' | 'vault' | 'rappel' | 'fireMode' | 'melee' | 'primaryAbility' | 'inspect' | 'secondaryAbility'
        | 'plant/defuse' | 'dropBomb' | 'toggleCamera'
    , Enum.UserInputType | Enum.KeyCode>

    export enum movementState {
        walking, sprinting, idle, falling
    }
}

export = datatypes;