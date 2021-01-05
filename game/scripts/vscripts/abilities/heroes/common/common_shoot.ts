import {BaseAbility, registerAbility} from "../../../lib/dota_ts_adapter";
import {Logger} from "../../../lib/logger";
import {CONFIG} from "../../../config";

@registerAbility()
export class common_shoot extends BaseAbility {
	private particle?: ParticleID;
	private readonly LOGGER: Logger;

	constructor() {
		super();
		this.LOGGER = new Logger("common_shoot", CONFIG.LOG_LEVEL);
	}

	public OnAbilityPhaseStart() {
		return true;
	}

	public OnSpellStart() {
		this.LOGGER.info("Spell start");

		let hero = this.GetCaster() as CDOTA_BaseNPC_Hero;
		let origin = hero.GetAbsOrigin();
		let forwardVec = hero.GetForwardVector();
		let projectile = "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf";

		this.particle = ParticleManager.CreateParticle(
			projectile,
			ParticleAttachment.ABSORIGIN,
			hero
		);

		let newVec = (origin + forwardVec * 100) as Vector;

		this.LOGGER.debug("Creating projectile");
		ProjectileManager.CreateLinearProjectile({
			Ability: this,
			EffectName: projectile,
			Source: hero,
			// vSpawnOrigin: hero.GetAbsOrigin(),
			vVelocity: newVec,
			fExpireTime: GameRules.GetGameTime() + 5,
			fStartRadius: 50,
			fEndRadius: 50,
			fDistance: 1000,
			bHasFrontalCone: false,
			bProvidesVision: true,
			iVisionRadius: 50,
			iVisionTeamNumber: hero.GetTeamNumber(),
			iUnitTargetTeam: UnitTargetTeam.NONE,
			iUnitTargetFlags: UnitTargetFlags.NONE,
			iUnitTargetType: UnitTargetType.NONE
		});
	}
}