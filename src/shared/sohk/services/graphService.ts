import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { process, Raylib } from "shared/modules/System";
import graphlua from './graphlua'

namespace graphService {
    export type vertex = Part & {
        nextPart?: Folder,
    }
    export class graph {
        vertexFolder = new Instance("Folder");
        constructor() {
            this.vertexFolder.Name = `${tick()}:graph`
            this.vertexFolder.Parent = Workspace
        }
        addVertex(v1: vertex) {
            v1.Parent = this.vertexFolder
        }
        addVertexGroup(vs: vertex[]) {
            vs.forEach((v) => {
                v.Parent = this.vertexFolder;
            })
        }
        calculate() {
            function drawroom(r: vertex[]) {
                r.forEach((v, i) => {
                    let l = Raylib.DrawLine(v.Position, (i < r.size()? r[i + 1]: r[0]).Position);
                    l.draw(Workspace);
                })
            }
            let rooms = graphlua.calculateEdges(this.vertexFolder);
            print("proc rooms")
            rooms.forEach((v) => {
                print(v, 'room');
                drawroom(v);
            })
        }
    }
}

export = graphService;