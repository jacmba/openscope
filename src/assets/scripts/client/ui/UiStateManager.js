import { STORAGE_KEY } from '../constants/storageKeys';

/**
 * Manages UI state persistence using localStorage
 * 
 * Handles saving and loading of display toggles, panel states, and other UI preferences
 * 
 * @class UiStateManager
 */
class UiStateManager {
    /**
     * @for UiStateManager
     * @constructor
     */
    constructor() {
        /**
         * Default UI state values
         *
         * @for UiStateManager
         * @property _defaults
         * @type {object}
         * @private
         */
        this._defaults = {
            [STORAGE_KEY.UI_DISPLAY_AIRSPACE]: false,
            [STORAGE_KEY.UI_DISPLAY_LABELS]: false,
            [STORAGE_KEY.UI_DISPLAY_RESTRICTED_AREAS]: false,
            [STORAGE_KEY.UI_DISPLAY_SID_MAP]: false,
            [STORAGE_KEY.UI_DISPLAY_STAR_MAP]: false,
            [STORAGE_KEY.UI_DISPLAY_TERRAIN]: true,
            [STORAGE_KEY.UI_DISPLAY_VIDEO_MAP]: false,
            [STORAGE_KEY.UI_STRIP_VIEW_EXPANDED]: false
        };
    }

    // ------------------------------ PUBLIC ------------------------------

    /**
     * Get a UI state value from localStorage or return default
     *
     * @for UiStateManager
     * @method getState
     * @param key {string} Storage key
     * @returns {boolean} State value
     */
    getState(key) {
        const stored = localStorage.getItem(key);
        
        if (stored === null) {
            return this._defaults[key];
        }

        return stored === 'true';
    }

    /**
     * Set a UI state value in localStorage
     *
     * @for UiStateManager
     * @method setState
     * @param key {string} Storage key
     * @param value {boolean} State value
     */
    setState(key, value) {
        localStorage.setItem(key, value.toString());
    }

    /**
     * Get all UI display states
     *
     * @for UiStateManager
     * @method getAllDisplayStates
     * @returns {object} Object with all display states
     */
    getAllDisplayStates() {
        return {
            airspace: this.getState(STORAGE_KEY.UI_DISPLAY_AIRSPACE),
            labels: this.getState(STORAGE_KEY.UI_DISPLAY_LABELS),
            restrictedAreas: this.getState(STORAGE_KEY.UI_DISPLAY_RESTRICTED_AREAS),
            sidMap: this.getState(STORAGE_KEY.UI_DISPLAY_SID_MAP),
            starMap: this.getState(STORAGE_KEY.UI_DISPLAY_STAR_MAP),
            terrain: this.getState(STORAGE_KEY.UI_DISPLAY_TERRAIN),
            videoMap: this.getState(STORAGE_KEY.UI_DISPLAY_VIDEO_MAP)
        };
    }

    /**
     * Get flight strips bar state
     *
     * @for UiStateManager
     * @method getStripViewState
     * @returns {boolean} Whether strip view is expanded
     */
    getStripViewState() {
        return this.getState(STORAGE_KEY.UI_STRIP_VIEW_EXPANDED);
    }

    /**
     * Set flight strips bar state
     *
     * @for UiStateManager
     * @method setStripViewState
     * @param expanded {boolean} Whether strip view is expanded
     */
    setStripViewState(expanded) {
        this.setState(STORAGE_KEY.UI_STRIP_VIEW_EXPANDED, expanded);
    }

    /**
     * Reset all UI states to defaults
     *
     * @for UiStateManager
     * @method resetToDefaults
     */
    resetToDefaults() {
        Object.keys(this._defaults).forEach(key => {
            this.setState(key, this._defaults[key]);
        });
    }
}

/**
 * The static instance of the `UiStateManager` class
 */
export default new UiStateManager();
