import {BaseModifier, registerModifier} from "../lib/dota_ts_adapter";

@registerModifier("shootModifier")
export class ShootModifier extends BaseModifier {
	public isLeftMouseDown = false;
	public shootInterval = 0.15;
	private shootTimer = 0.15;

	public OnCreated() {
		if (IsServer()) {
			this.StartIntervalThink(FrameTime());
		}
	}

	public OnDestroy() {
		if (IsServer()) {
			this.StartIntervalThink(-1);
		}
	}

	public OnIntervalThink() {
		this.shootTimer += FrameTime();

		if (this.isLeftMouseDown) {
			if (this.shootTimer >= this.shootInterval) {
				let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
				let ability = hero.FindAbilityByName("common_shoot");
				ability?.CastAbility();
				this.shootTimer = 0;
			}
		}
	}
}