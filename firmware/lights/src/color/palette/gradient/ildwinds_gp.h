
#ifndef COLOR_PALETTE_ILDWINDS_H_
#define COLOR_PALETTE_ILDWINDS_H_

#include <FastLED.h>

// Gradient palette "ildwinds_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/ildwinds.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 20 bytes of program space.

static const TProgmemRGBGradientPalette_byte ildwinds_gp[] FL_PROGMEM = {
    0, 17, 6, 4,
    63, 51, 19, 13,
    127, 177, 138, 120,
    191, 30, 63, 102,
    255, 2, 9, 23};

#endif