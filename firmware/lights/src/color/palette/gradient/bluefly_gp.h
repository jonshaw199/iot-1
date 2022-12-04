
#ifndef COLOR_PALETTE_BLUEFLY_H_
#define COLOR_PALETTE_BLUEFLY_H_

#include <FastLED.h>

// Gradient palette "bluefly_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/bluefly.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

static const TProgmemRGBGradientPalette_byte bluefly_gp[] FL_PROGMEM = {
    0, 0, 0, 0,
    63, 0, 39, 64,
    191, 175, 215, 235,
    255, 0, 0, 0};

#endif
