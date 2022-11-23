
#ifndef COLOR_PALETTE_AUTUMNROSE_H_
#define COLOR_PALETTE_AUTUMNROSE_H_

#include <FastLED.h>

// Gradient palette "autumnrose_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/autumnrose.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 32 bytes of program space.

DEFINE_GRADIENT_PALETTE(autumnrose_gp){
    0, 71, 3, 1,
    45, 128, 5, 2,
    84, 186, 11, 3,
    127, 215, 27, 8,
    153, 224, 69, 13,
    188, 229, 84, 6,
    226, 242, 135, 17,
    255, 247, 161, 79};

#endif
