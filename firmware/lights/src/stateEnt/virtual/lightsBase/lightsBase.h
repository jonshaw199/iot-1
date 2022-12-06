#ifndef STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_
#define STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_

#include <AF1.h>
#include <FastLED.h>

#include "color/palette/list.h"

#define CNT max(CNT_A, CNT_B)
#define SECONDS_PER_PALETTE 20

enum palette_list_id
{
  PALETTE_THEME_REGULAR,
  PALETTE_THEME_CHRISTMAS
};

class LightsBase : public Base
{
protected:
  static CRGB *leds;
  static CRGBPalette16 currentPalette;
  static CRGBPalette16 targetPalette;
  static TBlendType currentBlending;
  static uint8_t currentBrightness;
  static uint8_t currentPaletteIndex;
  static const TProgmemRGBPalette16 *activePaletteList[];
  static std::vector<uint8_t> sceneStates;
  static uint8_t currentSceneIndex;

  static void handleInboxMsg(AF1Msg &m);
  static void advanceTargetPalette();

public:
  static void init();
  void setup();
  void loop();
  bool doScanForPeersESPNow();
  void onConnectWSServer();
  void onConnectWSServerFailed();
  void onConnectWifiFailed();
  msg_handler getInboxHandler();
  msg_handler getOutboxHandler();
};

#endif
