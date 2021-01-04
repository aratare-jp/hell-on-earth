import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class common_shoot extends BaseAbility {
    public OnAbilityPhaseStart() {
        return true;
    }

    public OnSpellStart() {
        if (IsServer()) {
            
        }
    }
}