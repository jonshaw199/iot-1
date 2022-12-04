#include "noise.h"

#define SECONDS_PER_PALETTE 20

CRGB *Noise::leds;
CRGBPalette16 Noise::currentPalette;
TBlendType Noise::currentBlending;
CRGBPalette16 Noise::targetPalette;
uint8_t Noise::scale;

uint8_t Noise::whichPalette;
// Add or remove palette names from this list to control which color
// palettes are used, and in what order.
const TProgmemRGBPalette16 *Noise::ActivePaletteList[] = {
    &RetroC9_p,
    &BlueWhite_p,
    // &RainbowColors_p,
    // &FairyLight_p,
    &RedGreenWhite_p,
    // &PartyColors_p,
    // &RedWhite_p,
    // &Snow_p,
    &Holly_p,
    &Ice_p};

void Noise::setup()
{
  Pattern::setup();

  leds = new CRGB[CNT];

  whichPalette = -1;

#if CNT
#if CNT_A
  FastLED.addLeds<LED_TYPE_A, LED_PIN_A, LED_ORDER_A>(leds, CNT);
#endif
#if CNT_B
  FastLED.addLeds<LED_TYPE_B, LED_PIN_B, LED_ORDER_B>(leds, CNT);
#endif
  // FastLED.setBrightness(10);
  // FastLED.showColor(CRGB::DarkRed);
#endif

  // currentPalette = CRGBPalette16(orange);
  setTargetPalette();
  addEvent(Event(
      "Noise",
      [](ECBArg a)
      { fillNoise8();
        FastLED.show();
        nblendPaletteTowardPalette(currentPalette, targetPalette, 150);          // Blend towards the target palette over 48 iterations.
      },
      EVENT_TYPE_TEMP, 1));

  addEvent(Event(
      "Noise_MovingTarget",
      [](ECBArg a)
      { setTargetPalette(); },
      EVENT_TYPE_TEMP, SECONDS_PER_PALETTE, 0, 0, START_EPOCH_SEC));
}

void Noise::preStateChange(int s)
{
  Pattern::preStateChange(s);
  delete[] leds;
}

void Noise::fillNoise8()
{
  for (int i = 0; i < CNT; i++)
  {                                                                                        // Just ONE loop to fill up the LED array as all of the pixels change.
    uint8_t index = inoise8(i * scale, getCurStateEnt()->getElapsedMs() / 10 + i * scale); // Get a value from the noise function. I'm using both x and y axis.
    leds[i] = ColorFromPalette(currentPalette, index, 255, LINEARBLEND);                   // With that value, look up the 8 bit colour palette value and assign it to the current LED.
  }

} // fillnoise8()

void Noise::setTargetPalette()
{
  const uint8_t numberOfPalettes = sizeof(ActivePaletteList) / sizeof(ActivePaletteList[0]);
  whichPalette = addmod8( whichPalette, 1, numberOfPalettes);
  targetPalette = *(ActivePaletteList[whichPalette]);
  Serial.print("Changing palette: ");
  Serial.println(whichPalette);
}
