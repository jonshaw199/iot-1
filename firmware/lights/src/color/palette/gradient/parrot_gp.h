
#ifndef COLOR_PALETTE_PARROT_H_
#define COLOR_PALETTE_PARROT_H_

#include <FastLED.h>

// Gradient palette "parrot_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/parrot.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 20 bytes of program space.

static const TProgmemRGBGradientPalette_byte parrot_gp[] FL_PROGMEM = {
    0, 126, 0, 1,
    114, 197, 168, 16,
    140, 197, 168, 16,
    216, 0, 2, 32,
    255, 0, 2, 32};

#endif
