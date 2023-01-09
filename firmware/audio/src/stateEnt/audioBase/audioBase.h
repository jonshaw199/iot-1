#ifndef STATEENT_AUDIOBASE
#define STATEENT_AUDIOBASE

#include <AF1.h>

class AudioBase : public Base
{
  bool initI2SSpeakOrMic(int mode);
  static uint8_t *microphoneData;
  static int data_offset;

public:
  void setup();
  void loop();
  void preStateChange(int s) override;
};

#endif