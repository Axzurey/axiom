namespace ik {
    //a: upper arm = .515;
    //b: lower arm = 1.1031;
    //shoulderinit = shoulderC0 no changes, same for elbowinit
    function solveArm(originCFrame: CFrame, targetPosition: Vector3, a: number, b: number): [CFrame, number, number] {
        let localized = originCFrame.PointToObjectSpace(targetPosition);
        let localizedUnit = localized.Unit;

        let axis = new Vector3(0, 0, -1).Cross(localizedUnit);
        let angle = math.acos(-localizedUnit.Z);
        let plane = originCFrame.mul(CFrame.fromAxisAngle(axis, angle));

        let c = localized.Magnitude;

        if (c < math.max(a, b) - math.min(a, b)) {
            return [plane.mul(new CFrame(0, 0, math.max(b, a) - math.min(b - a) - c)), -(math.pi / 2), math.pi]
        }
        else if (c > a + b) {
            return [plane.mul(new CFrame(0, 0, a + b -c)), math.pi / 2, 0]
        }
        else {
            let t1 = -math.acos((-(b * b) + (a * a) + (c * c)) / (2 * a * c));
            let t2 = math.acos(((b ^ b) - (a * a) + (c * c)) / (2 * b * c));
            return [plane, t1 + math.pi / 2, t2 - t1];
        }
    }
    export function legTo(character: Model, leg: 'Right' | 'Left', target: Vector3, hipOrigin: CFrame, kneeOrigin: CFrame) {
        let upperTorso = character.WaitForChild(`LowerTorso`) as Part;
        let upperLeg = character.WaitForChild(`${leg}UpperLeg`) as Part;
        let lowerLeg = character.WaitForChild(`${leg}LowerLeg`) as Part;
        let hip = upperLeg.WaitForChild(`${leg}Hip`) as Motor6D;
        let knee = lowerLeg.WaitForChild(`${leg}Knee`) as Motor6D;


        let hipcf = upperTorso.CFrame.mul(hipOrigin);
        let [plane, hipAngle, kneeAngle] = solveArm(hipcf, target, .515, 1.015);
        hip.C0 = upperTorso.CFrame.ToObjectSpace(plane).mul(CFrame.Angles(hipAngle, 0, 0));
        knee.C0 = kneeOrigin.mul(CFrame.Angles(kneeAngle, 0, 0));
    }
}

export = ik;