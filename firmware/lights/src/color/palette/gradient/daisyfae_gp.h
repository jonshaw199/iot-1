
#ifndef COLOR_PALETTE_DAISYFAE_H_
#define COLOR_PALETTE_DAISYFAE_H_

#include <FastLED.h>

// Gradient palette "daisyfae_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/daisyfae.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

static const TProgmemRGBGradientPalette_byte daisyfae_gp[] FL_PROGMEM = {
    0, 4, 8, 0,
    86, 74, 91, 1,
    178, 161, 175, 41,
    255, 237, 139, 0};

#endif
