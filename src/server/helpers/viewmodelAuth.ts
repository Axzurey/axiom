namespace vmAuth {

    const BARREL_MAX_DISTANCE_FROM_CAMERA_ORIGIN = 10;
    const CAMERA_MAX_DISTANCE_FROM_CHARACTER_ORIGIN = 10;

    export function barrelIsWithinLogicalDistanceFromCamera(camera: Vector3, barrel: Vector3) {
        return (camera.sub(barrel)).Magnitude <= BARREL_MAX_DISTANCE_FROM_CAMERA_ORIGIN;
    }
    export function cameraIsWithinLogicalDistanceFromCharacter(camera: Vector3, character: Vector3) {
        return (camera.sub(character)).Magnitude <= CAMERA_MAX_DISTANCE_FROM_CHARACTER_ORIGIN;
    }
}

export = vmAuth;