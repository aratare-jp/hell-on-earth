import {BaseAbility, registerAbility} from "../../../lib/dota_ts_adapter";
import {Logger} from "../../../lib/logger";
import {CONFIG} from "../../../config";

@registerAbility()
export class common_shoot extends BaseAbility {
	private readonly LOGGER: Logger;

	private bulletParticle?: ParticleID;
	private muzzleFlashParticle?: ParticleID;

	constructor() {
		super();
		this.LOGGER = new Logger("common_shoot", CONFIG.LOG_LEVEL);
	}

	public OnAbilityPhaseStart() {
		return true;
	}

	public GetCooldown() {
		return 0;
	}

	public OnSpellStart() {
		this.LOGGER.debug("Spell start");

		let hero = this.GetCaster() as CDOTA_BaseNPC_Hero;
		let origin = hero.GetAbsOrigin();
		let forwardVec = hero.GetForwardVector();

		this.bulletParticle = ParticleManager.CreateParticle(
			"particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_cone.vpcf",
			ParticleAttachment.ABSORIGIN,
			hero
		);

		this.muzzleFlashParticle = ParticleManager.CreateParticle(
			"particles/units/heroes/hero_snapfire/hero_snapfire_base_attack_b.vpcf",
			ParticleAttachment.ABSORIGIN,
			hero
		);

		let newVec = (origin + forwardVec * 100) as Vector;
		print("New vec: " + newVec.x + " " + newVec.y + " " + newVec.z);

		this.LOGGER.trace("Creating projectile");
		ProjectileManager.CreateLinearProjectile({
			Ability: this,
			EffectName: "",
			Source: hero,
			vSpawnOrigin: hero.GetAbsOrigin(),
			vVelocity: forwardVec * 1000 as Vector,
			fExpireTime: GameRules.GetGameTime() + 5,
			fStartRadius: 50,
			fEndRadius: 50,
			fDistance: 300,
			bHasFrontalCone: false,
			bProvidesVision: true,
			iVisionRadius: 50,
			iVisionTeamNumber: hero.GetTeamNumber(),
			iUnitTargetTeam: UnitTargetTeam.ENEMY,
			iUnitTargetFlags: UnitTargetFlags.NONE,
			iUnitTargetType: UnitTargetType.ALL
		});

		Timers.CreateTimer({
			callback: () => {
				if (this.bulletParticle) {
					ParticleManager.DestroyParticle(this.bulletParticle, true);
				}
				if (this.muzzleFlashParticle) {
					ParticleManager.DestroyParticle(this.muzzleFlashParticle, true);
				}
			},
			useGameTime: true,
			endTime: GameRules.GetGameTime() + 5
		});
	}

	public OnProjectileHit(_target: CDOTA_BaseNPC, location: Vector) {
		this.LOGGER.debug("Projectile hit");

		this.LOGGER.trace("NPC: " + location.x + " " + location.y + " " + location.z);

		let caster = this.GetCaster().GetAbsOrigin();
		this.LOGGER.trace("NPC: " + caster.x + " " + caster.y + " " + caster.z);
		return true;
	}
}