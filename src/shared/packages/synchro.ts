interface savableProperties {
    BasePart: {
        CFrame: CFrame,
        Size: Vector3,
        Color: Color3,
        Transparency: number,
        CastShadow: boolean,
        BottomSurface: Enum.SurfaceType,
        TopSurface: Enum.SurfaceType,
        LeftSurface: Enum.SurfaceType,
        RightSurface: Enum.SurfaceType,
        FrontSurface: Enum.SurfaceType,
        BackSurface: Enum.SurfaceType,
        LocalTransparencyModifier: number, //might end up changing this and serializing it differently
        Material: Enum.Material,
        Reflectance: number,
        Name: string, //why not?
        ClassName: keyof CreatableInstances,
    },
    Attachment: {
        CFrame: CFrame,
        Visible: boolean,
        Name: string,
        ClassName: 'Attachment',
    },
    Decal: {
        Color3: Color3,
        LocalTransparencyModifier: number, //might change
        Texture: string,
        Transparency: number,
        ZIndex: number,
        Face: Enum.NormalId,
        ClassName: 'Decal',
        Name: string,
    },
    Texture: {
        OffsetStudsU: number,
        OffsetStudsV: number,
        StudsPerTileU: number,
        StudsPerTileV: number,
        Color3: Color3,
        LocalTransparencyModifier: number,
        Texture: string,
        Transparency: number,
        ZIndex: number,
        Face: Enum.NormalId,
        ClassName: string,
        Name: string,
    },
    Folder: {
        Name: string,
        ClassName: string,
    },
    IntValue: {
        Name: string,
        ClassName: string,
        Value: number,
    },
    NumberValue: {
        Name: string,
        ClassName: string,
        Value: number,
    },
    StringValue: {
        Name: string,
        ClassName: string,
        Value: string,
    },
    Vector3Value: {
        Name: string,
        ClassName: string,
        Value: Vector3,
    },
    Color3Value: {
        Name: string,
        ClassName: string,
        Value: Color3,
    },
    CFrameValue: {
        Name: string,
        ClassName: string,
        Value: CFrame,
    },
    BoolValue: {
        Name: string,
        ClassName: string,
        Value: boolean,
    },
    BrickColorValue: {
        Name: string,
        ClassName: string,
        Value: BrickColor,
    },
    Sound: {
        Name: string,
        ClassName: Sound,
        RollOffMaxDistance: number,
        RollOffMinDistance: number,
        RollOffMode: Enum.RollOffMode,
        Volume: number,
        PlaybackSpeed: number,
        SoundId: number,
        TimePosition: number,
        IsPlaying: boolean,//how are u gonnna manage dat
    }
}

const serialize_functions = {
    'CFrame': function(cf: CFrame) {
        return ['CFrame', ...cf.GetComponents()];
    },
    'Vector3': function(v3: Vector3) {
        return ['Vector3', v3.X, v3.Y, v3.Z];
    },
    'Vector2': function(v2: Vector2) {
        return ['Vector2', v2.X, v2.Y];
    },
    'Color3': function(c3: Color3) {
        return ['Color3', c3.R, c3.G, c3.B];
    },
    'Enum': function(en: EnumItem) {
        return ['Enum', en.EnumType, en.Name];
    },
    'UDim2': function(ud2: UDim2) {
        return ['UDim2', ud2.X.Scale, ud2.X.Offset, ud2.Y.Scale, ud2.Y.Offset];
    },
    'UDim': function(ud: UDim) {
        return ['UDim', ud.Offset, ud.Scale];
    }
}

const unserialize_functions = {
    'CFrame': function() {
        
    }
}

const serializable_properties = {
    BasePart: ['CFrame', 'Size', 'Color', 'Transparency', 'BackSurface', 'FrontSurface',
        'UpSurface', 'BackSurface', 'RightSurface', 'LeftSurface', 'CastShadow', 'Reflectance',
        'Material', 'Name', 'LocalTransparencyModifier'
    ]
}

export {}