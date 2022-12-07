#ifndef STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_
#define STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_

#include <AF1.h>
#include <vector>

#include "pattern/pattern.h"

class LightsBase : public Base
{
  std::vector<Pattern> patterns;

protected:
  static void handleInboxMsg(AF1Msg &m);

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
