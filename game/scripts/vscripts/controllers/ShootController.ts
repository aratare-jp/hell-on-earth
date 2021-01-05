import {ShootModifier} from "../modifiers/ShootModifier";
import {Logger} from "../lib/logger";
import {CONFIG} from "../config";

export class ShootController {
	private LOGGER: Logger;
	private leftMouseDownListenerID!: CustomGameEventListenerID;
	private leftMouseUpListenerID!: CustomGameEventListenerID;

	constructor() {
		this.LOGGER = new Logger("ShootController", CONFIG.LOG_LEVEL);
	}

	public setupShoot() {
		this.LOGGER.debug("Configuring ShootController");

		this.LOGGER.trace("Registering mouse down");
		this.leftMouseDownListenerID = CustomGameEventManager.RegisterListener(
			"leftMouseDown",
			(userId, event) => this.OnMouseDown(userId, event)
		);

		this.LOGGER.trace("Registering mouse up");
		this.leftMouseUpListenerID = CustomGameEventManager.RegisterListener(
			"leftMouseUp",
			(userId, event) => this.OnMouseUp(userId, event)
		);
	}

	public reload() {
		this.LOGGER.debug("Reloading ShootController");

		this.LOGGER.trace("Unregistering mouse down");
		CustomGameEventManager.UnregisterListener(this.leftMouseDownListenerID);

		this.LOGGER.trace("Unregistering mouse up");
		CustomGameEventManager.UnregisterListener(this.leftMouseUpListenerID);

		this.setupShoot();
	}

	private OnMouseDown(userId: EntityIndex, event: { PlayerID: PlayerID }) {
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		let shootMod = hero.FindModifierByName("shootModifier") as ShootModifier;
		shootMod.isLeftMouseDown = true;
	}

	private OnMouseUp(userId: EntityIndex, event: { PlayerID: PlayerID }) {
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		let shootMod = hero.FindModifierByName("shootModifier") as ShootModifier;
		shootMod.isLeftMouseDown = false;
	}
}