import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { Direction, Dirs } from "../WASDController";

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

    // TODO: Move this into each hero.
    private movementSpeed = 400;

    OnCreated() {
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }

    OnDestroy() {
        this.StartIntervalThink(-1);
    }

    OnIntervalThink() {
        let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
        if (!hero) {
            return;
        }

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

        let newCord = (cord + vec * this.movementSpeed * FrameTime()) as Vector;
        hero.SetAbsOrigin(GetGroundPosition(newCord, hero));
        if (!IsUnitInValidPosition(hero)) {
            hero.SetAbsOrigin(GetGroundPosition(cord, hero));
        }
    }
}
