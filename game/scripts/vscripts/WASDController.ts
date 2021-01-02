const Direction = {
    UP: {
        key: 'w',
        event: 'moveUp',
        message: {message: 'Moving Up!'}
    },
    LEFT: {
        key: 'a',
        event: 'moveLeft',
        message: {message: 'Moving Left!'}
    },
    DOWN: {
        key: 's',
        event: 'moveDown',
        message: {message: 'Moving Down!'}
    },
    RIGHT: {
        key: 'd',
        event: 'moveRight',
        message: {message: 'Moving Right!'}
    }
}

function setupWASD() {
    let dirs: Array<"UP" | "LEFT" | "DOWN" | "RIGHT"> = ["UP", "LEFT", "DOWN", "RIGHT"];
    for (let dir of dirs) {
        CustomGameEventManager.RegisterListener(Direction[dir].event, (userId, event) => {
            OnCustomListener(userId, event);
        });
    }
}

function OnCustomListener(
    userId: EntityIndex,
    event: NetworkedData<CCustomGameEventManager.InferEventType<string, object> & { PlayerID: PlayerID }>,
) {
    let player = Entities.GetLocalPlayer();
    
    print(event);
}