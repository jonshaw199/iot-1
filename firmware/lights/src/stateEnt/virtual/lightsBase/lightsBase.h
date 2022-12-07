#ifndef STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_
#define STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_

#include <AF1.h>
#include <vector>

#include "pattern/pattern.h"
#include "pattern/beatwave/beatwave.h"
#include "pattern/everyother/everyother.h"
#include "pattern/noise/noise.h"
#include "pattern/picker/picker.h"
#include "pattern/ripple/ripple.h"
#include "pattern/twinklefox/twinklefox.h"

enum patterns
{
  PATTERN_BEATWAVE,
  PATTERN_EVERYOTHER,
  PATTERN_NOISE,
  PATTERN_PICKER,
  PATTERN_RIPPLE,
  PATTERN_TWINKLEFOX,
};

class LightsBase : public Base
{
protected:
  static void handleInboxMsg(AF1Msg &m);
  static void setCurrentPattern(uint8_t p);

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
