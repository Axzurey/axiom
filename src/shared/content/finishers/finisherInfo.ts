export interface finisherParams {
    character: Model & {
        Humanoid: Humanoid,
        HumanoidRootPart: BasePart,
    }
    impactPosition: Vector3,
    impactNormal: Vector3,
    impactMaterial: Enum.Material,
    impactColor: Color3,
}