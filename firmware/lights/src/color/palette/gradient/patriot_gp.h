
#ifndef COLOR_PALETTE_PATRIOT_H_
#define COLOR_PALETTE_PATRIOT_H_

#include <FastLED.h>

// Gradient palette "patriot_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/patriot.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

static const TProgmemRGBGradientPalette_byte patriot_gp[] FL_PROGMEM = {
    0, 255, 0, 0,
    122, 255, 0, 0,
    132, 0, 16, 255,
    255, 0, 16, 255};

#endif
