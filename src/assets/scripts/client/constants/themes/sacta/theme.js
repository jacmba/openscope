import { DATA_BLOCK_THEME } from './modules/dataBlock';
import { RADAR_TARGET_THEME } from './modules/radarTarget';
import { SCOPE_THEME } from './modules/scope';
import { TERRAIN_THEME } from './modules/terrain';
import { WIND_VANE_THEME } from './modules/windVane';

/**
 * Sacta theme - inspired by Spanish ATC software Sacta
 * Features:
 * - Orange aircraft for arrivals (incoming traffic)
 * - Green aircraft for departures (outgoing traffic)
 * - Square aircraft symbols instead of circles
 * - Smaller aircraft symbols (half the size)
 * - Dark background with high contrast
 *
 * @enum THEME_SACTA
 * @type {Object}
 * @final
 */
export const THEME_SACTA = {
    CLASSNAME: 'canvas-theme-sacta',
    DATA_BLOCK: DATA_BLOCK_THEME,
    RADAR_TARGET: RADAR_TARGET_THEME,
    SCOPE: SCOPE_THEME,
    TERRAIN: TERRAIN_THEME,
    WIND_VANE: WIND_VANE_THEME
};
