import { COLOR } from '../color';

/**
 * Colors and options for radar targets in Sacta theme
 * Features square aircraft symbols and category-based colors
 *
 * @enum RADAR_TARGET_THEME
 * @type {object}
 */
export const RADAR_TARGET_THEME = {
    /**
     * Color of the dots behind the aircraft, showing where it has been
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof RADAR_TARGET_THEME
     * @property HISTORY_DOT_INSIDE_RANGE
     */
    HISTORY_DOT_INSIDE_RANGE: COLOR.WHITE_05,

    /**
     * Color of the dots behind the aircraft, showing where it has been
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof RADAR_TARGET_THEME
     * @property HISTORY_DOT_OUTSIDE_RANGE
     */
    HISTORY_DOT_OUTSIDE_RANGE: COLOR.WHITE_05,

    /**
     * Radius of the history dots, in kilometers
     *
     * @memberof RADAR_TARGET_THEME
     * @property HISTORY_DOT_RADIUS_KM
     */
    HISTORY_DOT_RADIUS_KM: 0.2,

    /**
     * Number of history dots to display behind the aircraft
     *
     * @memberof RADAR_TARGET_THEME
     * @property HISTORY_LENGTH
     */
    HISTORY_LENGTH: 7,

    /**
     * Color of projected track lines
     *
     * @memberof RADAR_TARGET_THEME
     * @property PROJECTED_TRACK_LINES
     */
    PROJECTED_TRACK_LINES: COLOR.WHITE,

    /**
     * Color of projection lines showing an arrival aircraft will go
     * (for selected aircraft)
     *
     * @memberof RADAR_TARGET_THEME
     * @property PROJECTION_ARRIVAL
     */
    PROJECTION_ARRIVAL: COLOR.ORANGE,

    /**
     * Color of projection lines showing an arrival aircraft will go
     * (for non-selected aircraft when projected path set to "always")
     *
     * @memberof RADAR_TARGET_THEME
     * @property PROJECTION_ARRIVAL_ALL
     */
    PROJECTION_ARRIVAL_ALL: COLOR.ORANGE_02,

    /**
     * Color of projection lines showing where a departure aircraft will go
     * (for selected aircraft)
     *
     * @memberof RADAR_TARGET_THEME
     * @property PROJECTION_DEPARTURE
     */
    PROJECTION_DEPARTURE: COLOR.GREEN,

    /**
     * Color of projection lines showing where a departure aircraft will go
     * (for non-selected aircraft when projected path set to "always")
     *
     * @memberof RADAR_TARGET_THEME
     * @property PROJECTION_DEPARTURE_ALL
     */
    PROJECTION_DEPARTURE_ALL: COLOR.GREEN_02,

    /**
     * Color of projection lines used when the aircraft is
     * established on an instrument approach
     *
     * @memberof RADAR_TARGET_THEME
     * @property PROJECTION_ESTABLISHED_ON_APPROACH
     */
    PROJECTION_ESTABLISHED_ON_APPROACH: COLOR.ORANGE,

    /**
     * Default color for radar targets (fallback)
     * This will be overridden by category-based colors
     *
     * @memberof RADAR_TARGET_THEME
     * @property RADAR_TARGET
     */
    RADAR_TARGET: COLOR.WHITE,

    /**
     * Color for arrival aircraft (incoming traffic)
     *
     * @memberof RADAR_TARGET_THEME
     * @property RADAR_TARGET_ARRIVAL
     */
    RADAR_TARGET_ARRIVAL: COLOR.ORANGE,

    /**
     * Color for departure aircraft (outgoing traffic)
     *
     * @memberof RADAR_TARGET_THEME
     * @property RADAR_TARGET_DEPARTURE
     */
    RADAR_TARGET_DEPARTURE: COLOR.GREEN,

    /**
     * Color for overflight aircraft
     *
     * @memberof RADAR_TARGET_THEME
     * @property RADAR_TARGET_OVERFLIGHT
     */
    RADAR_TARGET_OVERFLIGHT: COLOR.YELLOW,

    /**
     * Radius to draw all radar targets (same size as default theme)
     *
     * @memberof RADAR_TARGET_THEME
     * @property RADIUS_KM
     */
    RADIUS_KM: 0.5,

    /**
     * Radius to draw radar targets of aircraft that are currently selected
     *
     * @memberof RADAR_TARGET_THEME
     * @property RADIUS_SELECTED_KM
     */
    RADIUS_SELECTED_KM: 0.75,

    /**
     * Color of conflict rings (shown to warn you of possible issue)
     *
     * @memberof RADAR_TARGET_THEME
     * @property RING_CONFLICT
     */
    RING_CONFLICT: COLOR.BLUE_02,

    /**
     * Color of violation rings (shown when aircraft have lost separation)
     *
     * @memberof RADAR_TARGET_THEME
     * @property RING_VIOLATION
     */
    RING_VIOLATION: COLOR.RED,

    /**
     * Color of halo
     *
     * @memberof RADAR_TARGET_THEME
     * @property HALO
     */
    HALO: COLOR.GREEN_05,

    /**
     * Whether or not the small line behind aircraft established on an
     * instrument approach should be drawn
     *
     * @memberof RADAR_TARGET_THEME
     * @property TRAILING_SEPARATION_INDICATOR_ENABLED
     */
    TRAILING_SEPARATION_INDICATOR_ENABLED: false,

    /**
     * Color of small line behind aircraft established on an instrument approach
     *
     * @memberof RADAR_TARGET_THEME
     * @property TRAILING_SEPARATION_INDICATOR
     */
    TRAILING_SEPARATION_INDICATOR: COLOR.RED_08,

    /**
     * Whether to use square shapes instead of circles for aircraft
     *
     * @memberof RADAR_TARGET_THEME
     * @property USE_SQUARE_SHAPES
     */
    USE_SQUARE_SHAPES: true
};
