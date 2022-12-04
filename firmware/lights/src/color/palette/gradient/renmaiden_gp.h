
#ifndef COLOR_PALETTE_RENMAIDEN_H_
#define COLOR_PALETTE_RENMAIDEN_H_

#include <FastLED.h>

// Gradient palette "renmaiden_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/renmaiden.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 28 bytes of program space.

static const TProgmemRGBGradientPalette_byte renmaiden_gp[] FL_PROGMEM = {
    0, 3, 82, 4,
    38, 9, 13, 16,
    89, 184, 77, 105,
    127, 201, 213, 156,
    165, 222, 88, 170,
    216, 190, 63, 4,
    255, 3, 82, 4};

#endif
