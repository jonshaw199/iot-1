#ifndef PATTERN_BEATWAVE_H_
#define PATTERN_BEATWAVE_H_

#include "pattern/pattern.h"

class Beatwave : public Pattern
{
public:
  void loop() override;
};

#endif