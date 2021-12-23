import { ReplicatedStorage, Workspace } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import sohk from "shared/sohk/init";
import { bombViewmodel, unloaded_viewmodel } from "shared/types/fps";
import worldInteractor from "./worldInteractor";

export default class bombClass extends sohk.sohkComponent {
    ctx: fps_framework;
    interactor: worldInteractor;
    viewmodel: bombViewmodel;
    constructor(ctx: fps_framework) {
        super();
        this.ctx = ctx;
        let model = ReplicatedStorage.FindFirstChild('gameModels')?.FindFirstChild('bomb')?.Clone() as Model;
        let vm = ReplicatedStorage.FindFirstChild('viewmodel')?.Clone() as unloaded_viewmodel;
        this.viewmodel = vm as bombViewmodel;
        this.interactor = new worldInteractor(ctx, model);

        model.GetChildren().forEach((v) => {
            v.Parent = this.viewmodel;
        })

        this.viewmodel.PrimaryPart = this.viewmodel.main;

        this.viewmodel.SetPrimaryPartCFrame(new CFrame(0, -10000, 0));
        this.viewmodel.Parent = Workspace.CurrentCamera;
    }
    originPlantPosition() {
        let cf = this.interactor.getSurfaceRightInfront(4, 10);
        return cf;
    }
}