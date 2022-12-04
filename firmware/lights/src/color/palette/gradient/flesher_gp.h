
#ifndef COLOR_PALETTE_FLESHER_H_
#define COLOR_PALETTE_FLESHER_H_

#include <FastLED.h>

// Gradient palette "flesher_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/flesher.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 8 bytes of program space.

static const TProgmemRGBGradientPalette_byte flesher_gp[] FL_PROGMEM = {
    0, 133, 91, 73,
    255, 110, 56, 27};

#endif
