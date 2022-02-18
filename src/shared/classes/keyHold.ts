import { UserInputService } from "@rbxts/services";
import phyxConnection from "shared/phyx/phyxConnection";


let keys = 0;
export default class keyHold {
    private key: Enum.KeyCode | Enum.UserInputType;

    private call: ((length: number) => void)[] = [];

    keyRaised = new phyxConnection<(length: number) => void>(this.call as unknown as never)
    
    constructor(key: Enum.KeyCode | Enum.UserInputType) {
        keys ++;
        this.key = key;
        let start = tick()
        let conn = UserInputService.InputEnded.Connect((input, gp) => {
            if (gp) return;
            if (input.KeyCode === key || input.UserInputType === key) {
                conn.Disconnect();
                this.call[0](tick() - start);
            }
        })
    }
}