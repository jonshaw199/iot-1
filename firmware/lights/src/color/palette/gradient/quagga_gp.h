
#ifndef COLOR_PALETTE_QUAGGA_H_
#define COLOR_PALETTE_QUAGGA_H_

#include <FastLED.h>

// Gradient palette "quagga_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/quagga.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

static const TProgmemRGBGradientPalette_byte quagga_gp[] FL_PROGMEM = {
    0, 1, 9, 84,
    40, 42, 24, 72,
    84, 6, 58, 2,
    168, 88, 169, 24,
    211, 42, 24, 72,
    255, 1, 9, 84};

#endif
