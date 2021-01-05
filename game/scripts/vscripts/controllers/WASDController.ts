import {WasdModifier} from "../modifiers/WasdModifier";
import {Logger} from "../lib/logger";
import {CONFIG} from "../config";

export const Direction = {
	UP: {
		key: 'w',
		event: 'MMoveUp',
		message: {message: 'Moving Up!'},
		vec: Vector(0, 1, 0)
	},
	LEFT: {
		key: 'a',
		event: 'MMoveLeft',
		message: {message: 'Moving Left!'},
		vec: Vector(-1, 0, 0)
	},
	DOWN: {
		key: 's',
		event: 'MMoveDown',
		message: {message: 'Moving Down!'},
		vec: Vector(0, -1, 0)
	},
	RIGHT: {
		key: 'd',
		event: 'MMoveRight',
		message: {message: 'Moving Right!'},
		vec: Vector(1, 0, 0)
	},
	UP_LEFT: {
		key: 'd',
		event: 'MMoveUpLeft',
		message: {message: 'Moving Up Left!'},
		vec: Vector(-1, 1, 0)
	},
	DOWN_LEFT: {
		key: 'd',
		event: 'MMoveDownLeft',
		message: {message: 'Moving Down Left!'},
		vec: Vector(-1, -1, 0)
	},
	DOWN_RIGHT: {
		key: 'd',
		event: 'MMoveDownRight',
		message: {message: 'Moving Down Right!'},
		vec: Vector(1, -1, 0)
	},
	UP_RIGHT: {
		key: 'd',
		event: 'MMoveUpRight',
		message: {message: 'Moving Up Right!'},
		vec: Vector(1, 1, 0)
	}
}

export type Dirs =
	"UP"
	| "LEFT"
	| "DOWN"
	| "RIGHT"
	| "UP_LEFT"
	| "DOWN_LEFT"
	| "DOWN_RIGHT"
	| "UP_RIGHT";

export class WASDController {
	// WASD keybinding listeners
	private keyDownListeners: CustomGameEventListenerID[] = [];
	private keyUpListeners: CustomGameEventListenerID[] = [];
	private keyMoveListener?: CustomGameEventListenerID;

	private readonly LOGGER: Logger;

	constructor() {
		this.LOGGER = new Logger("WASDController", CONFIG.LOG_LEVEL);
	}

	public setupWASD() {
		this.LOGGER.debug("Configuring WASDController");

		// Loop to setup WASD without having to declare each separately.
		let dirs: Array<Dirs> = ["UP", "LEFT", "DOWN", "RIGHT"];

		// Bind key down
		this.LOGGER.trace("Binding key down");
		for (let dir of dirs) {
			this.keyDownListeners.push(CustomGameEventManager.RegisterListener<{ message: string }>(
				"+" + Direction[dir].event,
				(userId, _) => {
					this.OnKeyDown(userId, dir);
				}
			));
		}

		// Bind key up
		this.LOGGER.trace("Binding key up");
		for (let dir of dirs) {
			this.keyUpListeners.push(CustomGameEventManager.RegisterListener<{ message: string }>(
				"-" + Direction[dir].event,
				(userId, _) => {
					this.OnKeyUp(userId, dir);
				}
			));
		}

		this.LOGGER.trace("Binding key movement");
		this.keyMoveListener = CustomGameEventManager.RegisterListener<{ x: number, y: number }>(
			"mouseEvent",
			(userId, event) => {
				print("Mouse: " + event.x + " " + event.y)
			}
		)
	}

	public reload() {
		this.LOGGER.debug("Reloading WASDController");

		this.LOGGER.trace("Unregistering key down");
		this.keyDownListeners.forEach((lis) => CustomGameEventManager.UnregisterListener(lis));
		this.keyDownListeners = [];

		this.LOGGER.trace("Unregistering key up");
		this.keyUpListeners.forEach((lis) => CustomGameEventManager.UnregisterListener(lis));
		this.keyUpListeners = [];

		CustomGameEventManager.UnregisterListener(this.keyMoveListener!);
		this.keyMoveListener = undefined;

		this.setupWASD();
	}

	private OnKeyDown(userId: EntityIndex, dir: Dirs) {
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		let modifier = hero.FindModifierByName("wasdModifier") as WasdModifier;
		modifier.moving[dir] = true;
	}

	private OnKeyUp(userId: EntityIndex, dir: Dirs) {
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		let modifier = hero.FindModifierByName("wasdModifier") as WasdModifier;
		modifier.moving[dir] = false;
	}
}
