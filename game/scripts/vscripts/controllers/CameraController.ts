import {Logger} from "../lib/logger";
import {CONFIG} from "../config";

export class CameraController {
	private LOGGER: Logger;

	constructor() {
		this.LOGGER = new Logger("CameraController", CONFIG.LOG_LEVEL);
	}

	setupCamera() {
		this.LOGGER.debug("Configuring CameraController");

		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();

		this.LOGGER.trace("Locking camera on hero");
		PlayerResource.SetCameraTarget(player.GetPlayerID(), hero);
	}

	reload() {
		this.LOGGER.debug("Reloading CameraController");

		this.setupCamera();
	}
}