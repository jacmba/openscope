import { COLOR } from '../color';

/**
 * Colors and options for data blocks in Sacta theme
 *
 * @enum DATA_BLOCK_THEME
 * @type {object}
 */
export const DATA_BLOCK_THEME = {
    /**
     * Number of characters of aircraft model icao to show in data block
     *
     * @memberof AIRCRAFT_MODEL_ICAO_CHARACTER_LIMIT
     * @type {number}
     */
    AIRCRAFT_MODEL_ICAO_CHARACTER_LIMIT: 4,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property ARRIVAL_BAR_IN_RANGE
     */
    ARRIVAL_BAR_IN_RANGE: COLOR.ORANGE,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property ARRIVAL_BAR_OUT_OF_RANGE
     */
    ARRIVAL_BAR_OUT_OF_RANGE: COLOR.ORANGE_05,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is selected
     *
     * @memberof DATA_BLOCK_THEME
     * @property ARRIVAL_BAR_SELECTED
     */
    ARRIVAL_BAR_SELECTED: COLOR.ORANGE,

    /**
     * Color of the data block fill (if it is enabled)
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property BACKGROUND_IN_RANGE
     */
    BACKGROUND_IN_RANGE: COLOR.DARK_08,

    /**
     * Color of the data block fill (if it is enabled)
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property BACKGROUND_OUT_OF_RANGE
     */
    BACKGROUND_OUT_OF_RANGE: COLOR.DARK_05,

    /**
     * Color of the data block fill (if it is enabled)
     * Opacity used for when the aircraft is selected
     *
     * @memberof DATA_BLOCK_THEME
     * @property BACKGROUND_SELECTED
     */
    BACKGROUND_SELECTED: COLOR.DARK_08,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property DEPARTURE_BAR_IN_RANGE
     */
    DEPARTURE_BAR_IN_RANGE: COLOR.GREEN,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property DEPARTURE_BAR_OUT_OF_RANGE
     */
    DEPARTURE_BAR_OUT_OF_RANGE: COLOR.GREEN_05,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is selected
     *
     * @memberof DATA_BLOCK_THEME
     * @property DEPARTURE_BAR_SELECTED
     */
    DEPARTURE_BAR_SELECTED: COLOR.GREEN,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property OVERFLIGHT_BAR_IN_RANGE
     */
    OVERFLIGHT_BAR_IN_RANGE: COLOR.YELLOW,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property OVERFLIGHT_BAR_OUT_OF_RANGE
     */
    OVERFLIGHT_BAR_OUT_OF_RANGE: COLOR.YELLOW_05,

    /**
     * Color of the bar on the left side of the data block
     * Opacity used for when the aircraft is selected
     *
     * @memberof DATA_BLOCK_THEME
     * @property OVERFLIGHT_BAR_SELECTED
     */
    OVERFLIGHT_BAR_SELECTED: COLOR.YELLOW,

    /**
     * Color of the data block border
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property BORDER_IN_RANGE
     */
    BORDER_IN_RANGE: COLOR.WHITE_05,

    /**
     * Color of the data block border
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property BORDER_OUT_OF_RANGE
     */
    BORDER_OUT_OF_RANGE: COLOR.WHITE_02,

    /**
     * Color of the data block border
     * Opacity used for when the aircraft is selected
     *
     * @memberof DATA_BLOCK_THEME
     * @property BORDER_SELECTED
     */
    BORDER_SELECTED: COLOR.WHITE_08,

    /**
     * Color of the data block text
     * Opacity used for when the aircraft is within the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property TEXT_IN_RANGE
     */
    TEXT_IN_RANGE: COLOR.WHITE,

    /**
     * Color of the data block text
     * Opacity used for when the aircraft is outside the airspace
     *
     * @memberof DATA_BLOCK_THEME
     * @property TEXT_OUT_OF_RANGE
     */
    TEXT_OUT_OF_RANGE: COLOR.WHITE_05,

    /**
     * Color of the data block text
     * Opacity used for when the aircraft is selected
     *
     * @memberof DATA_BLOCK_THEME
     * @property TEXT_SELECTED
     */
    TEXT_SELECTED: COLOR.WHITE,

    /**
     * Direction of the data block leader line
     *
     * @memberof DATA_BLOCK_THEME
     * @property LEADER_DIRECTION
     */
    LEADER_DIRECTION: 45,

    /**
     * Length of the data block leader line
     *
     * @memberof DATA_BLOCK_THEME
     * @property LEADER_LENGTH
     */
    LEADER_LENGTH: 1,

    /**
     * Whether to show the data block background
     *
     * @memberof DATA_BLOCK_THEME
     * @property SHOW_BACKGROUND
     */
    SHOW_BACKGROUND: true,

    /**
     * Whether to show the data block border
     *
     * @memberof DATA_BLOCK_THEME
     * @property SHOW_BORDER
     */
    SHOW_BORDER: true,

    /**
     * Whether to draw the data block background fill
     *
     * @memberof DATA_BLOCK_THEME
     * @property HAS_FILL
     */
    HAS_FILL: true,

    /**
     * Height of the data block
     *
     * @memberof DATA_BLOCK_THEME
     * @property HEIGHT
     */
    HEIGHT: 32,

    /**
     * Half height of the data block
     *
     * @memberof DATA_BLOCK_THEME
     * @property HALF_HEIGHT
     */
    HALF_HEIGHT: 16,

    /**
     * Width of the data block
     *
     * @memberof DATA_BLOCK_THEME
     * @property WIDTH
     */
    WIDTH: 60,

    /**
     * Half width of the data block
     *
     * @memberof DATA_BLOCK_THEME
     * @property HALF_WIDTH
     */
    HALF_WIDTH: 30,

    /**
     * Font for data block text
     *
     * @memberof DATA_BLOCK_THEME
     * @property TEXT_FONT
     */
    TEXT_FONT: '12px monoOne',

    /**
     * Distance from data block after which the leader line is drawn
     *
     * @memberof DATA_BLOCK_THEME
     * @property LEADER_PADDING_FROM_BLOCK_PX
     */
    LEADER_PADDING_FROM_BLOCK_PX: 5,

    /**
     * Distance from radar target before which the leader line is drawn
     *
     * @memberof DATA_BLOCK_THEME
     * @property LEADER_PADDING_FROM_TARGET_PX
     */
    LEADER_PADDING_FROM_TARGET_PX: 5,

    /**
     * Number of pixels longer the leader line becomes with each increase of
     * the 'leader length' value
     *
     * @memberof DATA_BLOCK_THEME
     * @property LEADER_LENGTH_INCREMENT_PIXELS
     */
    LEADER_LENGTH_INCREMENT_PIXELS: 25,

    /**
     * Number of pixels to adjust the leader length by
     *
     * @memberof DATA_BLOCK_THEME
     * @property LEADER_LENGTH_ADJUSTMENT_PIXELS
     */
    LEADER_LENGTH_ADJUSTMENT_PIXELS: -10
};
