
#ifndef COLOR_PALETTE_OTIS_H_
#define COLOR_PALETTE_OTIS_H_

#include <FastLED.h>

// Gradient palette "otis_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/otis.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

static const TProgmemRGBGradientPalette_byte otis_gp[] FL_PROGMEM = {
    0,  26,  1, 89,
  127,  17,193,  0,
  216,   0, 34, 98,
  255,   0, 34, 98};

#endif

