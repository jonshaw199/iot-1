
#include <FastLED.h>

#ifndef COLOR_PALETTE_FLAMEGP_H_
#define COLOR_PALETTE_FLAMEGP_H_

// Gradient palette "flame_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/flame.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 28 bytes of program space.

DEFINE_GRADIENT_PALETTE(flame_gp){
    0, 252, 42, 1,
    43, 217, 6, 1,
    89, 213, 66, 1,
    127, 3, 74, 1,
    165, 213, 66, 1,
    211, 217, 6, 1,
    255, 252, 42, 1};

#endif
