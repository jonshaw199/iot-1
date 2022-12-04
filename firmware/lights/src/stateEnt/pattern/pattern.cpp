#include "pattern.h"

CRGBPalette16 Pattern::currentPalette;
CRGBPalette16 Pattern::targetPalette;
TBlendType Pattern::currentBlending = LINEARBLEND;
uint8_t Pattern::currentBrightness = 200;
uint8_t Pattern::currentPaletteIndex;
// Add or remove palette names from this list to control which color
// palettes are used, and in what order.
const TProgmemRGBPalette16 *Pattern::activePaletteList[] = {
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

void Pattern::advanceTargetPalette() {
  const uint8_t numberOfPalettes = sizeof(activePaletteList) / sizeof(activePaletteList[0]);
  currentPaletteIndex = addmod8(currentPaletteIndex, 1, numberOfPalettes);
  targetPalette = *(activePaletteList[currentPaletteIndex]);
  Serial.print("Changing palette: ");
  Serial.println(currentPaletteIndex);
}
