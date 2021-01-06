type Level = "INFO" | "DEBUG" | "TRACE";

/**
 * Utility class used to print out stuff in a more organised way.
 */
export class Logger {
	private readonly level: Level;
	private readonly caller: string;

	constructor(caller: string, level: Level) {
		this.level = level;
		this.caller = caller;
	}

	public info(message: string) {
		print(`[INFO] [${this.caller}] ${message}`);
	}

	public debug(message: string) {
		if (this.level !== "INFO") {
			print(`[DEBUG] [${this.caller}] ${message}`);
		}
	}

	public trace(message: string) {
		if (this.level !== "INFO" && this.level !== "DEBUG") {
			print(`[TRACE] [${this.caller}] ${message}`);
		}
	}
}