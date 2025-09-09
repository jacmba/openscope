# Sacta Theme

The Sacta theme is inspired by the Spanish ATC software Sacta and provides a more realistic ATC radar display experience.

## Features

### Aircraft Representation
- **Square shapes** instead of circular dots for aircraft
- **Half the size** of default aircraft symbols for better visibility
- **Category-based colors**:
  - 🟠 **Orange** for arrivals (incoming traffic)
  - 🟢 **Green** for departures (outgoing traffic)  
  - 🟡 **Yellow** for overflights

### Visual Design
- **Dark background** with high contrast for better visibility
- **Muted terrain colors** to reduce visual clutter
- **High contrast** text and UI elements
- **Sacta-inspired** color scheme

## Usage

To use the Sacta theme, you need to set it in the game options or theme selection. The theme will automatically:

1. Draw aircraft as squares instead of circles
2. Color aircraft based on their flight category (arrival/departure/overflight)
3. Use smaller aircraft symbols (half the default size)
4. Apply the dark, high-contrast color scheme

## Technical Details

The theme modifies the following components:
- **Radar targets**: Square shapes with category-based colors
- **Data blocks**: Dark background with high contrast text
- **Scope elements**: Muted colors for better focus on aircraft
- **Terrain**: Reduced opacity and muted colors

## Files

- `color.js` - Color definitions for the Sacta theme
- `modules/radarTarget.js` - Aircraft symbol configuration
- `modules/dataBlock.js` - Data block styling
- `modules/scope.js` - Radar scope elements
- `modules/terrain.js` - Terrain display settings
- `modules/windVane.js` - Wind indicator styling
- `theme.js` - Main theme configuration

## Compatibility

This theme is compatible with all openScope airports and maintains full functionality while providing the Sacta-inspired visual experience.
