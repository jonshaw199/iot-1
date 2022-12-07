#ifndef PATTERN_NOISE_H_
#define PATTERN_NOISE_H_

#include "pattern/pattern.h"

class Noise : public Pattern
{
public:
  void loop() override;
};

#endif