
#ifndef COLOR_PALETTE_GIRLCAT_H_
#define COLOR_PALETTE_GIRLCAT_H_

#include <FastLED.h>

// Gradient palette "girlcat_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/girlcat.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 20 bytes of program space.

static const TProgmemRGBGradientPalette_byte girlcat_gp[] FL_PROGMEM = {
    0, 173, 229, 51,
    73, 139, 199, 45,
    140, 46, 176, 37,
    204, 7, 88, 5,
    255, 0, 24, 0};

#endif
