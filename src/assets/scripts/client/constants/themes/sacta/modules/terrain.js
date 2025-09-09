/**
 * Colors and options for terrain contours in Sacta theme
 *
 * @enum TERRAIN_THEME
 * @type {object}
 */
export const TERRAIN_THEME = {
    /**
     * Opacity of the lines on outer edges of terrain-elevated areas
     *
     * @memberof TERRAIN_THEME
     * @property BORDER_OPACITY
     */
    BORDER_OPACITY: 0.8,

    /**
     * Opacity of the fill color within terrain-elevated areas
     *
     * @memberof TERRAIN_THEME
     * @property FILL_OPACITY
     */
    FILL_OPACITY: 0.15,

    /**
     * Colors for each elevation level (in feet), in HSL
     * From these HSL values, we later generate HSLA for use in the canvas
     * Sacta theme uses more muted, darker colors
     *
     * Note that values must use the following units:
     * (H) Hue:         degrees
     * (S) Saturation:  percentage
     * (L) Lightness:   percentage
     *
     * @memberof TERRAIN_THEME
     * @property COLOR
     */
    COLOR: {
        0: '0, 0%, 15%',
        1000: '0, 0%, 18%',
        2000: '0, 0%, 20%',
        3000: '0, 0%, 22%',
        4000: '0, 0%, 24%',
        5000: '0, 0%, 26%',
        6000: '0, 0%, 28%',
        7000: '0, 0%, 30%',
        8000: '0, 0%, 32%',
        9000: '0, 0%, 34%',
        10000: '0, 0%, 36%',
        11000: '0, 0%, 38%',
        12000: '0, 0%, 40%',
        13000: '0, 0%, 42%',
        14000: '0, 0%, 44%',
        15000: '0, 0%, 46%',
        16000: '0, 0%, 48%',
        17000: '0, 0%, 50%',
        18000: '0, 0%, 52%',
        19000: '0, 0%, 54%',
        20000: '0, 0%, 56%',
        21000: '0, 0%, 58%',
        22000: '0, 0%, 60%',
        23000: '0, 0%, 62%',
        24000: '0, 0%, 64%',
        25000: '0, 0%, 66%'
    }
};
