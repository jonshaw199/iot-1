#ifndef STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_
#define STATEENT_VIRTUAL_LIGHTSBASE_LIGHTSBASE_H_

#include <AF1.h>

class LightsBase : public Base
{

public:
  void setup();
  void loop();
  bool doScanForPeersESPNow();
  void onConnectWSServer();
  msg_handler getInboxHandler();
  msg_handler getOutboxHandler();
};

#endif