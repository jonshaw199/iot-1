#include "ripple.h"

uint8_t Ripple::colour; // Ripple colour is randomized.
int Ripple::center;     // Center of the current ripple.
int Ripple::step;       // -1 is the initializing step.
uint8_t Ripple::myfade; // Starting brightness.
#define maxsteps 16     // Case statement wouldn't allow a variable.
uint8_t Ripple::fadeval;
uint8_t Ripple::bgcol; // Background colour rotates.
int Ripple::thisdelay; // Standard delay value.

void Ripple::setup()
{
  Pattern::setup();

  center = 0;
  step = -1;
  myfade = 255;
  fadeval = 128;
  bgcol = 0;
  thisdelay = 60;

  addEvent(Event(
      "Ripple_NextPalette", [](ECBArg a)
      { advanceTargetPalette(); },
      EVENT_TYPE_TEMP, 3000));

  addEvent(Event(
      "Ripple_Blend", [](ECBArg a)
      { nblendPaletteTowardPalette(currentPalette, targetPalette, 24); },
      EVENT_TYPE_TEMP, 100));

  addEvent(Event(
      "Ripple_Loop", [](ECBArg a)
      { 
        ripple(); 
        FastLED.show(); },
      EVENT_TYPE_TEMP, 60));
}

void Ripple::ripple()
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
  } // switch step
}
