#include "confetti.h"

#define SECONDS_PER_PALETTE 15

CRGB *Confetti::leds;
CRGBPalette16 Confetti::gCurrentPalette;
CRGBPalette16 Confetti::gTargetPalette;
TBlendType Confetti::currentBlending;
uint8_t Confetti::whichPalette;
// Add or remove palette names from this list to control which color
// palettes are used, and in what order.
const TProgmemRGBPalette16 *Confetti::ActivePaletteList[] = {
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

uint8_t Confetti::thisfade;  // How quickly does it fade? Lower = slower fade rate.
int Confetti::thishue;       // Starting hue.
uint8_t Confetti::thisinc;   // Incremental value for rotating hues
uint8_t Confetti::thissat;   // The saturation, where 255 = brilliant colours.
uint8_t Confetti::thisbri;   // Brightness of a sequence. Remember, max_bright is the overall limiter.
int Confetti::huediff;       // Range of random #'s to use for hue
uint8_t Confetti::thisdelay; // We don't need much delay (if any)

void Confetti::setup()
{
  Pattern::setup();

  leds = new CRGB[CNT];

#if CNT
#if CNT_A
  FastLED.addLeds<LED_TYPE_A, LED_PIN_A, LED_ORDER_A>(leds, CNT);
#endif
#if CNT_B
  FastLED.addLeds<LED_TYPE_B, LED_PIN_B, LED_ORDER_B>(leds, CNT);
#endif
#endif

  thisfade = 8;
  thishue = 50;
  thisinc = 1;
  thissat = 100;
  thisbri = 255;
  huediff = 256;
  thisdelay = 33;
  currentBlending = LINEARBLEND;
  gCurrentPalette = RetroC9_p;
  whichPalette = -1;

  addEvent(Event(
      "Confetti_NextPalette", [](ECBArg a)
      { changeMe(); },
      EVENT_TYPE_TEMP, SECONDS_PER_PALETTE, 0, 0, START_EPOCH_SEC));
  addEvent(Event(
      "Confetti_BlendPalette", [](ECBArg a)
      { nblendPaletteTowardPalette(gCurrentPalette, gTargetPalette, 10); },
      EVENT_TYPE_TEMP, 100));
  addEvent(Event(
      "Confetti_Main", [](ECBArg a)
      { 
        confetti(); },
      EVENT_TYPE_TEMP, thisdelay));
  addEvent(Event(
      "Confetti_Update", [](ECBArg a)
      { 
        FastLED.show(); },
      EVENT_TYPE_TEMP, 1));
}

void Confetti::preStateChange(int s)
{
  Pattern::preStateChange(s);
  delete[] leds;
}

void Confetti::confetti()
{ // random colored speckles that blink in and fade smoothly

  fadeToBlackBy(leds, CNT, thisfade); // Low values = slower fade.
  int pos = random16(CNT);            // Pick an LED at random.
  leds[pos] = ColorFromPalette(gCurrentPalette, thishue + random16(huediff) / 4, thisbri, currentBlending);
  thishue = thishue + thisinc; // It increments here.
}

void Confetti::changeMe()
{
  const uint8_t numberOfPalettes = sizeof(ActivePaletteList) / sizeof(ActivePaletteList[0]);
  whichPalette = addmod8(whichPalette, 1, numberOfPalettes);
  gTargetPalette = *(ActivePaletteList[whichPalette]);
  Serial.print("Changing palette: ");
  Serial.println(whichPalette);

} // ChangeMe()
