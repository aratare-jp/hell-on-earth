import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier("shootModifier")
export class ShootModifier extends BaseModifier {
    public isLeftMouseDown = false;

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
        if (this.isLeftMouseDown) {
            let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
            let origin = hero.GetAbsOrigin();
            let forwardVec = hero.GetForwardVector();
            let projectile = "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf";
            let ability = hero.FindAbilityByName("common_shoot");

            ProjectileManager.CreateLinearProjectile({
                Ability: ability,
                Source: hero,
                EffectName: projectile,
                vVelocity: forwardVec,
                fMaxSpeed: 300,
                bProvidesVision: true,
                iVisionRadius: 50,
                iVisionTeamNumber: hero.GetTeamNumber()
            });
        }
    }
}