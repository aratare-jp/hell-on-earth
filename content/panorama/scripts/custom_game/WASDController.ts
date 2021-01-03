const Direction = {
    UP: {
        key: 'w',
        event: 'MMoveUp',
        message: { message: 'Moving Up!' }
    },
    LEFT: {
        key: 'a',
        event: 'MMoveLeft',
        message: { message: 'Moving Left!' }
    },
    DOWN: {
        key: 's',
        event: 'MMoveDown',
        message: { message: 'Moving Down!' }
    },
    RIGHT: {
        key: 'd',
        event: 'MMoveRight',
        message: { message: 'Moving Right!' }
    }
}

// TODO: Move this to another file so no reload.
GameEvents.Subscribe("dota_on_hero_finish_spawn", (event) => {
    setupWASD();
});

function setupWASD() {
    $.Msg("Setting up WASD");

    let dirs: Array<"UP" | "LEFT" | "DOWN" | "RIGHT"> = ["UP", "LEFT", "DOWN", "RIGHT"];
    for (let dir of dirs) {
        // Bind key down
        Game.AddCommand("+" + Direction[dir].event, function () {
            $.Msg("Key down: " + dir);
            GameEvents.SendCustomGameEventToServer<{ message: string }>(
                "+" + Direction[dir].event,
                Direction[dir].message
            );
        }, "", 0);

        // Bind key up
        Game.AddCommand("-" + Direction[dir].event, function () {
            $.Msg("Key up: " + dir);
            GameEvents.SendCustomGameEventToServer<{ message: string }>(
                "-" + Direction[dir].event,
                Direction[dir].message
            );
        }, "", 0);
    }
}