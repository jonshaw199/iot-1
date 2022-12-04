
#ifndef COLOR_PALETTE_BEAUTIFULDREAMS_H_
#define COLOR_PALETTE_BEAUTIFULDREAMS_H_

#include <FastLED.h>

// Gradient palette "beautifuldreams_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/beautifuldreams.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 28 bytes of program space.

static const TProgmemRGBGradientPalette_byte beautifuldreams_gp[] FL_PROGMEM = {
    0,  27, 27, 49,
   51, 126,104,138,
   76,  64, 85,133,
  127,   4, 16, 78,
  178,  64, 85,133,
  204, 126,104,138,
  255,  27, 27, 49};

#endif