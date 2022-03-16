import { RunService, UserInputService } from "@rbxts/services";
import phyxConnection from "shared/phyx/phyxConnection";


let keys = 0;
export default class keyHold {
    private key: Enum.KeyCode | Enum.UserInputType;

    private call: ((length: number) => void)[] = [];

    keyRaised = new phyxConnection<(length: number) => void>(this.call as unknown as never)
    
    constructor(key: Enum.KeyCode | Enum.UserInputType, terminationTime: number) {
        keys ++;
        this.key = key;
        let start = tick()
        let s = RunService.RenderStepped.Connect(() => {
            if (tick() - start >= terminationTime) {
                s.Disconnect();
                conn.Disconnect();
                this.call[0](terminationTime);
            }
        })
        let conn = UserInputService.InputEnded.Connect((input, gp) => {
            if (gp) return;
            if (input.KeyCode === key || input.UserInputType === key) {
                print('stopped holding')
                conn.Disconnect();
                s.Disconnect()
                this.call[0](tick() - start);
            }
        })
    }
}