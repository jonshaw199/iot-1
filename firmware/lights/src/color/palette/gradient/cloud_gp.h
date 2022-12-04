
#ifndef COLOR_PALETTE_CLOUD_H_
#define COLOR_PALETTE_CLOUD_H_

#include <FastLED.h>

// Gradient palette "cloud_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/cloud.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 12 bytes of program space.

static const TProgmemRGBGradientPalette_byte cloud_gp[] FL_PROGMEM = {
    0, 247, 149, 91,
    127, 208, 32, 71,
    255, 42, 79, 188};

#endif
