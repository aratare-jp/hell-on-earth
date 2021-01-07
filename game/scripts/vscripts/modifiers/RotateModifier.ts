import {CONFIG} from "../config";
import {BaseModifier, registerModifier} from "../lib/dota_ts_adapter";
import {Logger} from "../lib/logger";
import {centraliseFromScreenPosition} from "../lib/position";

@registerModifier("rotateModifier")
export class RotateModifier extends BaseModifier {
	private readonly LOGGER: Logger;
	private mousePositionResListenerID!: CustomGameEventListenerID;

	constructor() {
		super();
		this.LOGGER = new Logger("RotateModifier", CONFIG.LOG_LEVEL);
	}

	public OnCreated() {
		this.LOGGER.debug("OnCreated");

		if (IsServer()) {
			this.LOGGER.trace("Registering Mouse Position Listener")
			this.mousePositionResListenerID = CustomGameEventManager.RegisterListener<{ x: number, y: number, z: number }>(
				"mousePositionRes",
				(userId, event) => this.OnMouseMoved(userId, event)
			)

			this.LOGGER.trace("Start interval think");
			this.StartIntervalThink(FrameTime());
		}
	}

	public OnDestroy() {
		this.LOGGER.debug("OnDestroy");

		if (IsServer()) {
			this.LOGGER.trace("Stop interval think");
			this.StartIntervalThink(-1);

			this.LOGGER.trace("Unregistering mouse position listener");
			CustomGameEventManager.UnregisterListener(this.mousePositionResListenerID);
		}
	}

	public OnIntervalThink() {
		// Telling the client to send back mouse position
		CustomGameEventManager.Send_ServerToPlayer<{ message: string }>(
			Entities.GetLocalPlayer(),
			"mousePositionReq",
			{message: "stub"}
		);
	}

	private OnMouseMoved(userId: EntityIndex, event: { x: number, y: number, z: number, PlayerID: PlayerID }) {
		let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
		let worldCursor = (Vector(event.x, event.y, event.z) - hero.GetAbsOrigin() as Vector).Normalized();
		hero.SetForwardVector(Vector(worldCursor.x, worldCursor.y, 0));
	}
}