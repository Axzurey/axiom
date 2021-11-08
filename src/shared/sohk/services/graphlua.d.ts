import { vertex } from "./graphService";

interface graphlua_ {
    calculateEdges: (vertexes: Folder) => (vertex[])[];
}

declare const graphlua: graphlua_

export = graphlua;