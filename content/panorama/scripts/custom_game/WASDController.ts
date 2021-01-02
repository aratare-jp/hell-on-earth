GameEvents.Subscribe("dota_player_spawned", (event) => {
    Game.CreateCustomKeyBind('b', "test");
    Game.AddCommand("test", function () {
        $.Msg("Test keybinding triggered");
        GameEvents.SendCustomGameEventToServer<{ message: string }>("testEvent", { message: "hello" });
    }, "", 0);
});