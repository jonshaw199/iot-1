#include "home.h"

String Home::getName()
{
    return "Home";
}

void Home::setup()
{
    LightsBase::setup();

    // Turn off lights
#if CNT
    FastLED.showColor(CRGB::Black);
#endif
}
