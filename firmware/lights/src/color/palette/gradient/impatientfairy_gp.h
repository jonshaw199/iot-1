
#ifndef COLOR_PALETTE_IMPATIENTFAIRY_H_
#define COLOR_PALETTE_IMPATIENTFAIRY_H_

#include <FastLED.h>

// Gradient palette "impatientfairy_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/impatientfairy.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 32 bytes of program space.

static const TProgmemRGBGradientPalette_byte impatientfairy_gp[] FL_PROGMEM = {
    0,  36,  5,  1,
   51,  74, 18,  2,
   89,  65, 22,  1,
  114, 103, 23, 10,
  140, 120, 32, 24,
  165, 126, 36, 52,
  204, 106, 27, 48,
  255,  27,  4, 13};

#endif