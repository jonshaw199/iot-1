
#ifndef COLOR_PALETTE_FAIRYGARDEN_H_
#define COLOR_PALETTE_FAIRYGARDEN_H_

#include <FastLED.h>

// Gradient palette "fairygarden_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/fairygarden.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

static const TProgmemRGBGradientPalette_byte fairygarden_gp[] FL_PROGMEM = {
    0, 55, 19, 103,
    51, 95, 32, 133,
    101, 167, 44, 162,
    153, 125, 182, 237,
    204, 84, 127, 207,
    255, 19, 40, 114};

#endif
