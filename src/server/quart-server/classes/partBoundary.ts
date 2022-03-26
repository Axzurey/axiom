const random = new Random()

export default class partBoundary {
    constructor(
        private xRange: NumberRange,
        private yRange: NumberRange,
        private zRange: NumberRange,
    ) {

    }
    generatePointWithinBounds(): Vector3 {
        return new Vector3(
            random.NextNumber(this.xRange.Min, this.xRange.Max),
            random.NextNumber(this.yRange.Min, this.yRange.Max),
            random.NextNumber(this.zRange.Min, this.zRange.Max)
        )
    }
    isPointWithinBounds(vector: Vector3): boolean {
        let x = (vector.X > this.xRange.Min && vector.X < this.xRange.Max)? true: false;
        let y = (vector.Y > this.yRange.Min && vector.Y < this.yRange.Max)? true: false;
        let z = (vector.Z > this.zRange.Min && vector.Z < this.zRange.Max)? true: false;
        return (x && y && z)? true: false;
    }
}