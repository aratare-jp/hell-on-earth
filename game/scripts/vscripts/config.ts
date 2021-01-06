/**
 * Global config across the entire app.
 */
export const CONFIG: Config = {
	LOG_LEVEL: "TRACE"
}

export interface Config {
	LOG_LEVEL: "INFO" | "DEBUG" | "TRACE"
}