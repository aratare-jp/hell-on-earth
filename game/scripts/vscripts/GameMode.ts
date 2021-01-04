import { reloadable } from "./lib/tstl-utils";
import "./modifiers/WasdModifier";
import "./modifiers/RotateModifier";
import "./modifiers/ShootModifier";
import { WASDController } from "./controllers/WASDController";
import { CameraController } from "./controllers/CameraController";
import { ShootController } from "./controllers/ShootController";

declare global {
    interface CDOTAGamerules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // STATICS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("particle", "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // CONTROLLERS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly wasdController: WASDController;
    private readonly cameraController: CameraController;
    private readonly shootController: ShootController;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // CONSTS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly heroSelectionTime = 10;
    private readonly showCaseTime = 10;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // CONSTRUCTORS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor() {
        this.wasdController = new WASDController();
        this.cameraController = new CameraController();
        this.shootController = new ShootController();

        this.configure();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // PUBLIC METHODS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Called on `script_reload`.
     */
    public Reload() {
        print("Script reloaded!");

        this.configureControllers();

        this.removeModifiers();
        this.addModifers();

        this.removeAbilities();
        this.addAbilities();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // PRIVATE HANDLERS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private OnStateChange(): void {
        const state = GameRules.State_Get();

        // Start game once pregame hits
        if (state == GameState.PRE_GAME) {
            print("Game State: Pre game");
        } else if (state == GameState.GAME_IN_PROGRESS) {
            print("Game State: Game in progress");
        }
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        // After a hero unit spawns, apply modifier_panic for 8 seconds
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        if (unit.IsRealHero()) {
        }
    }

    private OnPlayerSpawned(event: GameEventProvidedProperties & DotaOnHeroFinishSpawnEvent) {
        // Configure the controllers here so player and hero are available at script called.
        this.configureControllers();

        this.addModifers();
        this.addAbilities();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // PRIVATE METHODS
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private configure(): void {
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("dota_on_hero_finish_spawn", event => this.OnPlayerSpawned(event), undefined);

        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);

        GameRules.SetShowcaseTime(this.showCaseTime);
        GameRules.SetHeroSelectionTime(this.heroSelectionTime);
    }

    private configureControllers() {
        print("Configuring controllers");
        this.wasdController.setupWASD();
        this.cameraController.setupCamera();
        this.shootController.setupShoot();
    }

    private addModifers() {
        print("Adding modifiers");
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        hero.AddNewModifier(hero, undefined, "wasdModifier", {});
        hero.AddNewModifier(hero, undefined, "rotateModifier", {});
        hero.AddNewModifier(hero, undefined, "shootModifier", {});
    }

    private removeModifiers() {
        print("Removing modifiers");
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        hero.RemoveModifierByName("wasdModifier");
        hero.RemoveModifierByName("rotateModifier");
        hero.RemoveModifierByName("shootModifier");
    }

    private addAbilities() {
        print("Adding abilities");
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        if (!hero.HasAbility("common_shoot")) {
            hero.AddAbility("common_shoot");
        }
    }

    private removeAbilities() {
        print("Removing abilities");
        let player = Entities.GetLocalPlayer();
        let hero = player.GetAssignedHero();
        hero.RemoveAbility("common_shoot");
    }
}
