import phyxRemoteProtocol from "shared/phyx/phyxRemoteProtocol";

const get_camera_controlling_protocol = new phyxRemoteProtocol<
    (cameraId: string) => void, () => Player | undefined>('get_camera_controlling_protocol', 'Function');

export = get_camera_controlling_protocol;