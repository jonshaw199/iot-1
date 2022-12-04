
#ifndef COLOR_PALETTE_SUNLITWAVE_H_
#define COLOR_PALETTE_SUNLITWAVE_H_

#include <FastLED.h>

// Gradient palette "sunlitwave_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/sunlitwave.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 32 bytes of program space.

static const TProgmemRGBGradientPalette_byte sunlitwave_gp[] FL_PROGMEM = {
    0, 5, 9, 84,
    45, 37, 24, 111,
    81, 16, 5, 59,
    112, 24, 1, 20,
    150, 34, 1, 2,
    198, 175, 36, 7,
    237, 208, 104, 16,
    255, 239, 211, 158};

#endif