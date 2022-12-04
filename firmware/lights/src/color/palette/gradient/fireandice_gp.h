
#ifndef COLOR_PALETTE_FIREANDICE_H_
#define COLOR_PALETTE_FIREANDICE_H_

#include <FastLED.h>

// Gradient palette "fireandice_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/fireandice.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

static const TProgmemRGBGradientPalette_byte fireandice_gp[] FL_PROGMEM = {
    0, 80, 2, 1,
    51, 206, 15, 1,
    101, 242, 34, 1,
    153, 16, 67, 128,
    204, 2, 21, 69,
    255, 1, 2, 4};

#endif
