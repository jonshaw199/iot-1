
#ifndef COLOR_PALETTE_SHYVIOLET_H_
#define COLOR_PALETTE_SHYVIOLET_H_

#include <FastLED.h>

// Gradient palette "shyviolet_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/shyviolet.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 28 bytes of program space.

static const TProgmemRGBGradientPalette_byte shyviolet_gp[] FL_PROGMEM = {
    0, 10, 9, 32,
    38, 41, 36, 79,
    76, 103, 107, 188,
    127, 142, 154, 194,
    178, 58, 92, 176,
    216, 19, 51, 158,
    255, 5, 24, 103};

#endif
