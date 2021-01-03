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

GameEvents.Subscribe("dota_on_hero_finish_spawn", (event) => {
    setupWASD();
});

function setupWASD() {
    let dirs: Array<"UP" | "LEFT" | "DOWN" | "RIGHT"> = ["UP", "LEFT", "DOWN", "RIGHT"];
    for (let dir of dirs) {
        Game.CreateCustomKeyBind(Direction[dir].key, Direction[dir].event);
        Game.AddCommand(Direction[dir].event, function () {
            $.Msg(Direction[dir].message.message);
            GameEvents.SendCustomGameEventToServer<{ message: string }>(
                Direction[dir].event,
                Direction[dir].message
            );
        }, "", 0);
    }
}