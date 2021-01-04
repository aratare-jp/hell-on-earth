export class CameraController {
    setupCamera() {
        print("Configuring CameraController");

        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        
        // Lock camera on the hero.
        PlayerResource.SetCameraTarget(player.GetPlayerID(), hero);
    }
}