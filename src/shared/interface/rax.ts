import {RunService, Workspace} from '@rbxts/services'

export type pageUiType = Frame & {
	corePosition: Vector2,
	corePosiitonType: udimType
}

export type pageTransitionType = (current: page, to: page) => void

export enum udimType {
	offset, scale
}
/**
 * temporarily until i have access to my system.mathf lib
 */
function interpolate(v0: number, v1: number, t: number) {
	return (1 - t) * v0 + t * v1
}

/**
 * time will be constrained within 0 and 1
 */
const directions = {
	right: new Vector2(1, 0),
	left: new Vector2(-1, 0),
	up: new Vector2(0, 1),
	down: new Vector2(0, -1)
}

const pageTransitions = {
	slideIn(current: page, to: page) {
		const transitionLength = 1

        const screenSize = (Workspace.CurrentCamera as Camera).ViewportSize

        let target = current.gui.AbsolutePosition.add(directions.left.mul(screenSize.X))
        
        let start = current.gui.AbsolutePosition;
		let conn = RunService.RenderStepped.Connect((dt) => {
			
		})
		task.wait(transitionLength)
	}
}

export default abstract class page {
	gui: pageUiType

	transitionInLength: number = 1;

	constructor(gui: pageUiType) {
		this.gui = gui;
	}
	/**
	 * DO NOT OVERRIDE
	 */
	transition(nextPage: page) {
		pageTransitions.slideIn(this, nextPage);
	}
}