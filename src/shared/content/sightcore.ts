import { ReplicatedStorage, RunService } from "@rbxts/services";
import sohk from "shared/sohk/init";
import { viewmodel } from "shared/types/fps";

type modelType = Model & {
    focus: Part,
    base: Part,
}

export default abstract class sightcore extends sohk.sohkComponent {
    active: boolean = true
    model: modelType;
    orientationAddon: Vector3 = new Vector3();
    /**
     * the user's default fov gets divided by this
     */
    zoom: number = 1.2;
    constructor(modelId: string) {
        super();
        let [prefix, skin] = modelId.split('::');
        this.model = ReplicatedStorage.FindFirstChild('sights')?.FindFirstChild(prefix)?.FindFirstChild(`${prefix}_${skin}`)?.Clone() as modelType;
        let conn = RunService.RenderStepped.Connect((dt) => {
            if (!this.active) {conn.Disconnect(); return;}
            this.preRender(dt);
        })
    }
    public preRender(dt: number) {}
    public mount(vm: viewmodel) {
        this.model.Parent = vm;
        this.model.SetPrimaryPartCFrame(vm.sightNode.CFrame);
        let md = new Instance('Motor6D');
        md.Part0 = vm.sightNode;
        md.Part1 = this.model.PrimaryPart;
        md.Parent = this.model.PrimaryPart;

        task.wait(1)
    }
    public mountFinisher(vm: viewmodel) {
        vm.aimpart.Position = this.model.focus.Position;
    }
    public destroy() {
        this.active = false;
    }
}