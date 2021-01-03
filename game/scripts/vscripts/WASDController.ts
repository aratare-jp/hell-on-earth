const Direction = {
    UP: {
        key: 'w',
        event: 'moveUp',
        message: { message: 'Moving Up!' }
    },
    LEFT: {
        key: 'a',
        event: 'moveLeft',
        message: { message: 'Moving Left!' }
    },
    DOWN: {
        key: 's',
        event: 'moveDown',
        message: { message: 'Moving Down!' }
    },
    RIGHT: {
        key: 'd',
        event: 'moveRight',
        message: { message: 'Moving Right!' }
    }
}

type Dirs = "UP" | "LEFT" | "DOWN" | "RIGHT";

export class WASDController {
    // WASD keybinding listeners
    private listeners: CustomGameEventListenerID[];

    constructor() {
        this.listeners = [];
    }

    public setupWASD() {
        print("Configuring WASDController");

        // De-listen all events before readding them.
        this.listeners.forEach((lis) => CustomGameEventManager.UnregisterListener(lis));

        // Loop to setup WASD without having to declare each separately.
        let dirs: Array<Dirs> = ["UP", "LEFT", "DOWN", "RIGHT"];
        for (let dir of dirs) {
            this.listeners.push(CustomGameEventManager.RegisterListener<{ message: string }>(
                Direction[dir].event,
                (userId, event) => {
                    this.OnCustomListener(userId, { ...event, event: Direction[dir].event, dir: dir });
                }
            ));
        }
    }

    private OnCustomListener(
        userId: EntityIndex,
        event: {
            PlayerID: PlayerID,
            event: string,
            message: string,
            dir: Dirs
        },
    ) {
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();

        let cord = hero.GetAbsOrigin();

        print("Player's X: " + cord.x);
        print("Player's Y: " + cord.y);
        print("Player's Z: " + cord.z);
    }
}
