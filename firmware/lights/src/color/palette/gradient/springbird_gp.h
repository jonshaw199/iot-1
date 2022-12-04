
#ifndef COLOR_PALETTE_SPRINGBIRD_H_
#define COLOR_PALETTE_SPRINGBIRD_H_

#include <FastLED.h>

// Gradient palette "springbird_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/springbird.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

static const TProgmemRGBGradientPalette_byte springbird_gp[] FL_PROGMEM = {
    0, 10, 45, 147,
    38, 10, 45, 147,
    216, 192, 121, 162,
    255, 192, 121, 162};

#endif