
#ifndef COLOR_PALETTE_CATFAIRY_H_
#define COLOR_PALETTE_CATFAIRY_H_

#include <FastLED.h>

// Gradient palette "catfairy_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/catfairy.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

static const TProgmemRGBGradientPalette_byte catfairy_gp[] FL_PROGMEM = {
    0, 74, 124, 85,
    76, 152, 128, 44,
    127, 144, 97, 96,
    178, 100, 72, 102,
    232, 78, 90, 122,
    255, 78, 90, 122};

#endif
