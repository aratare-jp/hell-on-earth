import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier("rotateModifier")
export class RotateModifier extends BaseModifier {
    public OnCreated() {
        if (IsServer()) {
            CustomGameEventManager.RegisterListener<{ x: number, y: number }>(
                "mousePositionRes",
                (userId, event) => this.OnMouseMoved(userId, event)
            )

            this.StartIntervalThink(FrameTime());
        }
    }

    public OnDestroy() {
        this.StartIntervalThink(-1);
    }

    public OnIntervalThink() {
        // Telling the client to send back mouse position
        CustomGameEventManager.Send_ServerToPlayer<{ message: string }>(
            Entities.GetLocalPlayer(),
            "mousePositionReq",
            { message: "stub" }
        );
    }

    private OnMouseMoved(userId: EntityIndex, event: { x: number, y: number, PlayerID: PlayerID }) {
        let hero = this.GetParent() as CDOTA_BaseNPC_Hero;
        let centralisedCursor = this.centraliseFromScreenPosition(event.x, event.y);
        let normalisedCursor = Vector(centralisedCursor.x, centralisedCursor.y, 0).Normalized();
        let oldForwardVec = hero.GetForwardVector();
        let newForwardVec = oldForwardVec.Lerp(normalisedCursor, 0.7);
        hero.SetForwardVector(newForwardVec);
    }

    /**
     * Default XY plane has origin at top-left corner. This function takes any point on such plane and normalise it so
     * it would have origin at the centre of the screen.
     */
    private centraliseFromScreenPosition(x: number, y: number): { x: number, y: number } {
        // TODO: Need to find a way to get the resolution.
        return {
            x: x - 640,
            y: -(y - 360)
        }
    }
}