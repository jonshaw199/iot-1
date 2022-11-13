#ifndef COLOR_PALETTE_LEOGP_H_
#define COLOR_PALETTE_LEOGP_H_

#include <FastLED.h>

// Gradient palette "halloween_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/halloween.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 16 bytes of program space.

// Gradient palette "leo_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/leo.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 84 bytes of program space.

DEFINE_GRADIENT_PALETTE(leo_gp){
    0, 6, 5, 1,
    12, 25, 14, 3,
    25, 44, 17, 4,
    38, 63, 23, 5,
    51, 63, 23, 5,
    63, 113, 36, 6,
    76, 148, 53, 17,
    86, 182, 51, 24,
    101, 179, 57, 23,
    114, 232, 108, 52,
    127, 222, 164, 83,
    140, 232, 108, 52,
    153, 179, 57, 23,
    165, 182, 51, 24,
    178, 148, 53, 17,
    191, 113, 36, 6,
    204, 63, 23, 5,
    216, 63, 23, 5,
    229, 44, 17, 4,
    242, 25, 14, 3,
    255, 6, 5, 1};

#endif
