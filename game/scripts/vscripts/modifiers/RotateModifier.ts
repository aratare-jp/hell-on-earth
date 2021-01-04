import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier("rotateModifier")
export class RotateModifier extends BaseModifier {
    public OnCreated() {
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }

    public OnDestroy() {
        this.StartIntervalThink(-1);
    }

    public OnIntervalThink() {
        let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
        let heroAngle = hero.GetAnglesAsVector();
        let newYaw = (heroAngle + Vector(0, 1, 0) * 100 * FrameTime()) as Vector;
        hero.SetAbsAngles(newYaw.x, newYaw.y, newYaw.z);
    }
}