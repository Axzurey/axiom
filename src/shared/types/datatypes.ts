namespace datatypes {
    export type keybinds = Record<
        'fire' | 'reload' | 'primary' | 'secondary' | 'aim' | 'leanLeft' | 'leanRight' | 'prone' | 'crouch' |
        'sprint' | 'sneak' | 'vault' | 'rappel' | 'fireMode' | 'melee' | 'primarySkill' | 'inspect'
    , Enum.UserInputType | Enum.KeyCode>
}

export = datatypes;