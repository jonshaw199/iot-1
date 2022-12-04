
#ifndef COLOR_PALETTE_CAROUSEL_H_
#define COLOR_PALETTE_CAROUSEL_H_

#include <FastLED.h>

// Gradient palette "carousel_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/carousel.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 28 bytes of program space.

static const TProgmemRGBGradientPalette_byte carousel_gp[] FL_PROGMEM = {
    0, 2, 6, 37,
    101, 2, 6, 37,
    122, 177, 121, 9,
    127, 217, 149, 2,
    132, 177, 121, 9,
    153, 84, 13, 36,
    255, 84, 13, 36};

#endif