/**
 * Default XY plane has origin at top-left corner. This function takes any point on such plane and normalise it so
 * it would have origin at the centre of the screen.
 */
export function centraliseFromScreenPosition(x: number, y: number): { x: number, y: number } {
	// TODO: Need to find a way to get the resolution.
	return {
		x: x - 640,
		y: -(y - 360)
	}
}

/**
 * Revert from centralised position to normal default XY plane with top-left origin.
 */
export function decentraliseFromGamePosition(x: number, y: number): { x: number, y: number } {
	return {
		x: x + 640,
		y: -y + 360
	}
}