/**
 * Color definitions for the Sacta theme
 * Inspired by Spanish ATC software Sacta
 *
 * @enum COLOR
 * @type {Object}
 * @final
 */
export const COLOR = {
    // Basic colors
    WHITE: 'rgba(255, 255, 255, 1.0)',
    WHITE_01: 'rgba(255, 255, 255, 0.1)',
    WHITE_02: 'rgba(255, 255, 255, 0.2)',
    WHITE_05: 'rgba(255, 255, 255, 0.5)',
    WHITE_08: 'rgba(255, 255, 255, 0.8)',

    BLACK: 'rgba(0, 0, 0, 1.0)',
    BLACK_02: 'rgba(0, 0, 0, 0.2)',
    BLACK_05: 'rgba(0, 0, 0, 0.5)',
    BLACK_08: 'rgba(0, 0, 0, 0.8)',

    // Gray scale
    GRAY_LIGHT: 'rgba(200, 200, 200, 1.0)',
    GRAY_MEDIUM: 'rgba(150, 150, 150, 1.0)',
    GRAY_DARK: 'rgba(100, 100, 100, 1.0)',

    // Sacta-specific colors
    // Orange for arrivals (incoming traffic)
    ORANGE: 'rgba(255, 165, 0, 1.0)',        // Pure orange
    ORANGE_02: 'rgba(255, 165, 0, 0.2)',
    ORANGE_05: 'rgba(255, 165, 0, 0.5)',
    ORANGE_08: 'rgba(255, 165, 0, 0.8)',

    // Green for departures (outgoing traffic)
    GREEN: 'rgba(0, 255, 0, 1.0)',           // Pure green
    GREEN_02: 'rgba(0, 255, 0, 0.2)',
    GREEN_05: 'rgba(0, 255, 0, 0.5)',
    GREEN_08: 'rgba(0, 255, 0, 0.8)',

    // Yellow for overflights
    YELLOW: 'rgba(255, 255, 0, 1.0)',
    YELLOW_02: 'rgba(255, 255, 0, 0.2)',
    YELLOW_05: 'rgba(255, 255, 0, 0.5)',
    YELLOW_08: 'rgba(255, 255, 0, 0.8)',

    // Red for conflicts and violations
    RED: 'rgba(255, 0, 0, 1.0)',
    RED_02: 'rgba(255, 0, 0, 0.2)',
    RED_05: 'rgba(255, 0, 0, 0.5)',
    RED_08: 'rgba(255, 0, 0, 0.8)',

    // Blue for general UI elements
    BLUE: 'rgba(0, 100, 255, 1.0)',
    BLUE_02: 'rgba(0, 100, 255, 0.2)',
    BLUE_05: 'rgba(0, 100, 255, 0.5)',
    BLUE_08: 'rgba(0, 100, 255, 0.8)',

    // Dark background
    DARK: 'rgba(20, 20, 20, 1.0)',
    DARK_02: 'rgba(20, 20, 20, 0.2)',
    DARK_05: 'rgba(20, 20, 20, 0.5)',
    DARK_08: 'rgba(20, 20, 20, 0.8)'
};
