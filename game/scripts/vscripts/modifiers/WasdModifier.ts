import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { Direction } from "../WASDController";

@registerModifier("wasdModifier")
export class WasdModifier extends BaseModifier {
    public moving = {
        UP: false,
        LEFT: false,
        DOWN: false,
        RIGHT: false,
        // These 4 do nothing. Just here to satisfy type checks.
        UP_LEFT: false,
        DOWN_LEFT: false,
        DOWN_RIGHT: false,
        UP_RIGHT: false,
    }

    OnCreated() {
        if (IsServer()) {
            this.StartIntervalThink(0.1);
        }
    }

    OnDestroy() {
        this.StartIntervalThink(-1);
    }

    OnIntervalThink() {
        let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
        let cord = hero.GetAbsOrigin();

        let vec: Vector;
        if (this.moving.UP && this.moving.LEFT) {
            vec = Direction.UP_LEFT.vec;
        } else if (this.moving.UP && this.moving.RIGHT) {
            vec = Direction.UP_RIGHT.vec;
        } else if (this.moving.DOWN && this.moving.LEFT) {
            vec = Direction.DOWN_LEFT.vec;
        } else if (this.moving.DOWN && this.moving.RIGHT) {
            vec = Direction.DOWN_RIGHT.vec;
        } else if (this.moving.UP) {
            vec = Direction.UP.vec;
        } else if (this.moving.LEFT) {
            vec = Direction.LEFT.vec;
        } else if (this.moving.DOWN) {
            vec = Direction.DOWN.vec;
        } else if (this.moving.RIGHT) {
            vec = Direction.RIGHT.vec;
        } else {
            return;
        }

        let newCord = cord + (vec * 850 * FrameTime()) as Vector;
        hero.SetOrigin(GetGroundPosition(newCord, hero));
    }
}
