import phyxRemoteProtocol from "shared/phyx/phyxRemoteProtocol";
import clientCamera from "shared/classes/clientCamera";

const camera_request_protocol = new phyxRemoteProtocol<
    () => void, () => Record<string, clientCamera.cameraConfig>>('camera_request_protocol', 'Function');

export = camera_request_protocol;