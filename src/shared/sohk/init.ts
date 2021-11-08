import { ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";
import load_all_files from "./connections/loader";
import tagservice from "./services/tagservice";
import UISCONTROLLER from "./services/userinputservice";
import replicationService from "./services/replicationService";
import hitScanService from "./services/hitscanService";
import itemService from "./services/itemservice";
import cameraService from "./services/cameraService";
import renderService from "./services/renderService";
import csgService from "./services/csgService";
import graphService from "./services/graphService";

let loaded = false;

abstract class defaultSohk {
    itemService = itemService;
    hitscanService = hitScanService;
    replicationService = replicationService;
    uisController = new UISCONTROLLER();
    tagService = tagservice;
    cameraService = cameraService;
    renderService = renderService;
    csgService = csgService;
    graphService = graphService;
}

abstract class sohkComponent extends defaultSohk {
    /**
     * a place to store stuff?
     */
    dump: Folder;
    constructor() {
        super();
        let dump = ReplicatedStorage.FindFirstChild("$sohk.dump") as Folder;
        if (!dump) {
            dump = new Instance("Folder");
            dump.Name = '$sohk.dump';
            dump.Parent = ReplicatedStorage;
        }
        this.dump = dump;
    }
}

abstract class sohkEntity extends defaultSohk {
    model: Model | undefined = undefined;
    constructor() {
        super();
    }
    isVectorInRange(v: Vector3, range: number) {
        if (!this.model) throw "model doesn't exist";
        if (!this.model.PrimaryPart) throw "model doesn't have a primary part";
        let distance = v.sub(this.model.GetPrimaryPartCFrame().Position).Magnitude;
        return [distance <= range, distance];
    }
    moveTo(v: Vector3) {
        if (!this.model) throw "model doesn't exist";
        if (!this.model.PrimaryPart) throw "model doesn't have a primary part";
        let [rx, ry, rz] = this.model.GetPrimaryPartCFrame().ToOrientation();
        this.model.SetPrimaryPartCFrame(new CFrame(v).mul(CFrame.fromOrientation(rx, ry, rz)));
        return this;
    }
    setInteraction() {

    }
}

export default class sohk {
    constructor() {
        if (RunService.IsServer() && !loaded) {load_all_files(); loaded = true;};
    }
    static sohkComponent = sohkComponent;
    static sohkEntity = sohkEntity;
}