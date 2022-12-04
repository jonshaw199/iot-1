
#ifndef COLOR_PALETTE_TUBEPREVIEW_H_
#define COLOR_PALETTE_TUBEPREVIEW_H_

#include <FastLED.h>

// Gradient palette "tubepreview_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/tubepreview.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 32 bytes of program space.

static const TProgmemRGBGradientPalette_byte tubepreview_gp[] FL_PROGMEM = {
    0, 113, 99, 23,
    51, 255, 255, 255,
    76, 255, 255, 255,
    114, 0, 0, 0,
    140, 0, 0, 0,
    178, 255, 255, 255,
    204, 255, 255, 255,
    255, 113, 99, 23};

#endif
