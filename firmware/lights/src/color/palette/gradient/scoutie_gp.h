
#ifndef COLOR_PALETTE_SCOUTIE_H_
#define COLOR_PALETTE_SCOUTIE_H_

#include <FastLED.h>

// Gradient palette "scoutie_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/scoutie.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

static const TProgmemRGBGradientPalette_byte scoutie_gp[] FL_PROGMEM = {
    0, 255, 156, 0,
    127, 0, 195, 18,
    216, 1, 0, 39,
    255, 1, 0, 39};

#endif
