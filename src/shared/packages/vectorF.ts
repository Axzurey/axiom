export default class vectorField {
    vectorFunction: (x: number, y: number) => [number, number] =
        function(x: number, y: number) {
            return [
                1,
                y^2 - y,
            ]
    }
    constructor(vectorFunction?: (x: number, y: number) => [number, number]) {
        if(vectorFunction) {
            this.vectorFunction = vectorFunction;
        }
    }
    vectorAtPoint(x: number, y: number) {
        return this.vectorFunction(x, y);
    }
}
//what can i do with this? for a particle system we can add the vectoratpoint to it's velocity or acceleration