#include "ripple.h"

void Ripple::loop()
{
  Pattern::loop();

  static int center = 0;
  static int step = -1;
  static uint8_t myfade = 255;
  static uint8_t fadeval = 128;
  static uint8_t bgcol = 0;
  static int thisdelay = 60;

  EVERY_N_MILLISECONDS(60)
  {
    fadeToBlackBy(leds, CNT, fadeval); // 8 bit, 1 = slow, 255 = fast

    switch (step)
    {

    case -1: // Initialize ripple variables.
      center = random(CNT);
      colour = random8();
      step = 0;
      break;

    case 0:
      leds[center] = ColorFromPalette(currentPalette, colour, myfade, currentBlending);

      step++;
      break;

    case maxsteps: // At the end of the ripples.
      step = -1;
      break;

    default:                                                                                                             // Middle of the ripples.
      leds[(center + step + CNT) % CNT] += ColorFromPalette(currentPalette, colour, myfade / step * 2, currentBlending); // Simple wrap from Marc Miller
      leds[(center - step + CNT) % CNT] += ColorFromPalette(currentPalette, colour, myfade / step * 2, currentBlending);
      step++; // Next step.
      break;
    }

    FastLED.show();
  }
}
