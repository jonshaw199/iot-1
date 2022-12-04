
#ifndef COLOR_PALETTE_SCARLETDRAGON_H_
#define COLOR_PALETTE_SCARLETDRAGON_H_

#include <FastLED.h>

// Gradient palette "scarletdragon_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/scarletdragon.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 32 bytes of program space.

static const TProgmemRGBGradientPalette_byte scarletdragon_gp[] FL_PROGMEM = {
    0, 1, 1, 1,
    51, 16, 2, 1,
    91, 58, 5, 1,
    122, 100, 16, 2,
    150, 120, 33, 9,
    178, 132, 43, 13,
    216, 157, 79, 28,
    255, 227, 92, 29};

#endif
