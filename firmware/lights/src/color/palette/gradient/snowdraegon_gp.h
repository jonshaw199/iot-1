
#ifndef COLOR_PALETTE_SNODRAEGON_H_
#define COLOR_PALETTE_SNODRAEGON_H_

#include <FastLED.h>

// Gradient palette "snodraegon_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/snodraegon.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 20 bytes of program space.

static const TProgmemRGBGradientPalette_byte snodraegon_gp[] FL_PROGMEM = {
    0, 25, 72, 155,
    63, 35, 95, 172,
    124, 255, 250, 250,
    191, 34, 32, 68,
    255, 27, 25, 59};

#endif
