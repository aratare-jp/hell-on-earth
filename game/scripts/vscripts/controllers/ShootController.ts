import { ShootModifier } from "../modifiers/ShootModifier";

export class ShootController {

    public setupShoot() {
        print("Configuring ShootModifier");

        CustomGameEventManager.RegisterListener(
            "leftMouseDown",
            (userId, event) => this.OnMouseDown(userId, event)
        );

        CustomGameEventManager.RegisterListener(
            "leftMouseUp",
            (userId, event) => this.OnMouseUp(userId, event)
        );
    }

    private OnMouseDown(userId: EntityIndex, event: { PlayerID: PlayerID }) {
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        let shootMod = hero.FindModifierByName("shootModifier") as ShootModifier;
        shootMod.isLeftMouseDown = true;
    }

    private OnMouseUp(userId: EntityIndex, event: { PlayerID: PlayerID }) {
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        let shootMod = hero.FindModifierByName("shootModifier") as ShootModifier;
        shootMod.isLeftMouseDown = false;
    }
}