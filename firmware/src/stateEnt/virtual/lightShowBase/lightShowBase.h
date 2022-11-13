#ifndef STATEENT_VIRTUAL_LIGHTSHOWBASE_LIGHTSHOWBASE_H_
#define STATEENT_VIRTUAL_LIGHTSHOWBASE_LIGHTSHOWBASE_H_

#include <AF1.h>

class LightShowBase : public Base
{

public:
  void setup();
  void loop();
  bool doScanForPeersESPNow();
  void onConnectWSServer();
  DynamicJsonDocument getInfo();
  msg_handler getInboxHandler();
#ifdef VS1053_CS_PIN
  static void pausePlaying(bool p);
  static void stopPlaying();
  static bool playFile(String f);
#endif
};

#endif