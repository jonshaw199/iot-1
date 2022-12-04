
#ifndef COLOR_PALETTE_FAECAT_H_
#define COLOR_PALETTE_FAECAT_H_

#include <FastLED.h>

// Gradient palette "faecat_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/faecat.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 36 bytes of program space.

static const TProgmemRGBGradientPalette_byte faecat_gp[] FL_PROGMEM = {
    0, 30, 18, 31,
    33, 78, 46, 82,
    63, 35, 43, 6,
    96, 5, 12, 2,
    130, 35, 5, 1,
    163, 190, 122, 8,
    191, 84, 146, 240,
    221, 107, 56, 64,
    255, 30, 18, 31};

#endif
