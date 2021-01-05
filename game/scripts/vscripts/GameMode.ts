import {reloadable} from "./lib/tstl-utils";
import "./modifiers/WasdModifier";
import "./modifiers/RotateModifier";
import "./modifiers/ShootModifier";
import {WASDController} from "./controllers/WASDController";
import {CameraController} from "./controllers/CameraController";
import {ShootController} from "./controllers/ShootController";
import {Logger} from "./lib/logger";
import {CONFIG} from "./config";

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
	private readonly LOGGER: Logger;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// CONSTRUCTORS
	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	constructor() {
		this.LOGGER = new Logger("GameMode", CONFIG.LOG_LEVEL);

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
		this.LOGGER.debug("Script reloaded!");

		this.removeModifiers();
		this.addModifiers();

		this.removeAbilities();
		this.addAbilities();

		this.reloadControllers();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// PRIVATE HANDLERS
	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private OnStateChange(): void {
		this.LOGGER.debug("State changed");

		const state = GameRules.State_Get();

		// Start game once pregame hits
		if (state == GameState.PRE_GAME) {
			this.LOGGER.debug("Game State: Pre game");
		} else if (state == GameState.GAME_IN_PROGRESS) {
			this.LOGGER.debug("Game State: Game in progress");
		}
	}

	private OnNpcSpawned(event: NpcSpawnedEvent) {
		this.LOGGER.debug("Npc spawned: " + event.entindex);

		// After a hero unit spawns, apply modifier_panic for 8 seconds
		const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
		if (unit.IsRealHero()) {
		}
	}

	private OnPlayerSpawned(event: GameEventProvidedProperties & DotaOnHeroFinishSpawnEvent) {
		this.LOGGER.debug("Player spawned: " + event.hero);

		// Configure the controllers here so player and hero are available at script called.
		this.configureControllers();

		this.addModifiers();
		this.addAbilities();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// PRIVATE METHODS
	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private configure(): void {
		this.LOGGER.info("Configuring various things");

		this.LOGGER.debug("Configuring game events");
		ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
		ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
		ListenToGameEvent("dota_on_hero_finish_spawn", event => this.OnPlayerSpawned(event), undefined);

		this.LOGGER.debug("Configuring game rules");
		GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
		GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);
		GameRules.SetShowcaseTime(this.showCaseTime);
		GameRules.SetHeroSelectionTime(this.heroSelectionTime);
	}

	private configureControllers() {
		this.LOGGER.debug("Configuring controllers");
		this.wasdController.setupWASD();
		this.cameraController.setupCamera();
		this.shootController.setupShoot();
	}

	private reloadControllers() {
		this.LOGGER.debug("Reloading controllers");
		this.wasdController.reload();
		this.cameraController.reload();
		this.shootController.reload();
	}

	private addModifiers() {
		this.LOGGER.debug("Adding modifiers");
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		hero.AddNewModifier(hero, undefined, "wasdModifier", {});
		hero.AddNewModifier(hero, undefined, "rotateModifier", {});
		hero.AddNewModifier(hero, undefined, "shootModifier", {});
	}

	private removeModifiers() {
		this.LOGGER.debug("Removing modifiers");
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		hero.RemoveModifierByName("wasdModifier");
		hero.RemoveModifierByName("rotateModifier");
		hero.RemoveModifierByName("shootModifier");
	}

	private addAbilities() {
		this.LOGGER.debug("Adding abilities");
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		if (!hero.HasAbility("common_shoot")) {
			hero.AddAbility("common_shoot");
		}
	}

	private removeAbilities() {
		this.LOGGER.debug("Removing abilities");
		let player = Entities.GetLocalPlayer();
		let hero = player.GetAssignedHero();
		if (!hero.HasAbility("common_shoot")) {
			hero.RemoveAbility("common_shoot");
		}
	}
}
