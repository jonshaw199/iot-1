#include "noise.h"

CRGB *Noise::leds;
CRGBPalette16 Noise::currentPalette;
TBlendType Noise::currentBlending;
CRGBPalette16 Noise::targetPalette;
uint8_t Noise::scale;

void Noise::setup()
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
      EVENT_TYPE_TEMP, 5000));
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
  uint8_t secondHand = (getCurStateEnt()->getElapsedMs() / 1000) % 60;
  static uint8_t lastSecond = 99;

  if (lastSecond != secondHand)
  {
    lastSecond = secondHand;
    Serial.print("Second hand: ");
    Serial.println(secondHand);
    if (secondHand == 0)
    {
      targetPalette = RainbowColors_p;
      scale = 30;
    }
    if (secondHand == 5)
    {
      SetupPurpleAndGreenPalette();
      scale = 50;
    }
    if (secondHand == 10)
    {
      SetupBlackAndWhiteStripedPalette();
      scale = 30;
    }
    if (secondHand == 15)
    {
      targetPalette = ForestColors_p;
      scale = 120;
    }
    if (secondHand == 20)
    {
      targetPalette = CloudColors_p;
      scale = 30;
    }
    if (secondHand == 25)
    {
      targetPalette = LavaColors_p;
      scale = 50;
    }
    if (secondHand == 30)
    {
      targetPalette = OceanColors_p;
      scale = 90;
    }
    if (secondHand == 35)
    {
      targetPalette = PartyColors_p;
      scale = 30;
    }
    if (secondHand == 40)
    {
      SetupRandomPalette();
      scale = 20;
    }
    if (secondHand == 45)
    {
      SetupRandomPalette();
      scale = 50;
    }
    if (secondHand == 50)
    {
      SetupRandomPalette();
      scale = 90;
    }
    if (secondHand == 55)
    {
      targetPalette = RainbowStripeColors_p;
      scale = 20;
    }
  }
}

// This function generates a random palette that's a gradient
// between four different colors.  The first is a dim hue, the second is
// a bright hue, the third is a bright pastel, and the last is
// another bright hue.  This gives some visual bright/dark variation
// which is more interesting than just a gradient of different hues.
void Noise::SetupRandomPalette()
{
  targetPalette = CRGBPalette16(
      CHSV(random8(), 255, 32),
      CHSV(random8(), 255, 255),
      CHSV(random8(), 128, 255),
      CHSV(random8(), 255, 255));
}

// This function sets up a palette of black and white stripes,
// using code.  Since the palette is effectively an array of
// sixteen CRGB colors, the various fill_* functions can be used
// to set them up.
void Noise::SetupBlackAndWhiteStripedPalette()
{
  // 'black out' all 16 palette entries...
  fill_solid(targetPalette, 16, CRGB::Black);
  // and set every fourth one to white.
  targetPalette[0] = CRGB::White;
  targetPalette[4] = CRGB::White;
  targetPalette[8] = CRGB::White;
  targetPalette[12] = CRGB::White;
}

// This function sets up a palette of purple and green stripes.
void Noise::SetupPurpleAndGreenPalette()
{
  CRGB purple = CHSV(HUE_PURPLE, 255, 255);
  CRGB green = CHSV(HUE_GREEN, 255, 255);
  CRGB black = CRGB::Black;

  targetPalette = CRGBPalette16(
      green, green, black, black,
      purple, purple, black, black,
      green, green, black, black,
      purple, purple, black, black);
}

//
// Mark's xy coordinate mapping code.  See the XYMatrix for more information on it.
//
/*
uint16_t Noise::XY(uint8_t x, uint8_t y)
{
  uint16_t i;
  if (kMatrixSerpentineLayout == false)
  {
    i = (y * kMatrixWidth) + x;
  }
  if (kMatrixSerpentineLayout == true)
  {
    if (y & 0x01)
    {
      // Odd rows run backwards
      uint8_t reverseX = (kMatrixWidth - 1) - x;
      i = (y * kMatrixWidth) + reverseX;
    }
    else
    {
      // Even rows run forwards
      i = (y * kMatrixWidth) + x;
    }
  }
  return i;
}
*/
