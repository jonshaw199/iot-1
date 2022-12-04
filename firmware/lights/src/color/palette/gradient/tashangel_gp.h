
#ifndef COLOR_PALETTE_TASHANGEL_H_
#define COLOR_PALETTE_TASHANGEL_H_

#include <FastLED.h>

// Gradient palette "tashangel_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/tashangel.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

static const TProgmemRGBGradientPalette_byte tashangel_gp[] FL_PROGMEM = {
    0, 133, 68, 197,
    51, 2, 1, 33,
    101, 50, 35, 130,
    153, 199, 225, 237,
    204, 41, 187, 228,
    255, 133, 68, 197};

#endif