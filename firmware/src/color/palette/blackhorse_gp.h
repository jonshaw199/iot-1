
#ifndef COLOR_PALETTE_BLACKHORSEGP_H_
#define COLOR_PALETTE_BLACKHORSEGP_H_

#include <FastLED.h>

// Gradient palette "blackhorse_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/rc/tn/blackhorse.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
// Size: 24 bytes of program space.

DEFINE_GRADIENT_PALETTE(blackhorse_gp){
    0, 8, 30, 1,
    53, 29, 99, 237,
    112, 1, 1, 14,
    168, 21, 5, 21,
    219, 1, 5, 2,
    255, 8, 30, 1};

#endif
