#ifndef STATEENT_PATTERN_PATTERN_H_
#define STATEENT_PATTERN_PATTERN_H_

#include "stateEnt/virtual/lightsBase/lightsBase.h"
#include "color/palette/gradient/hopegoddess_gp.h"
#include "color/palette/gradient/halloween_gp.h"
#include "color/palette/ice.h"
#include "color/palette/gradient/autumnrose_gp.h"
#include "color/palette/gradient/blackhorse_gp.h"
#include "color/palette/gradient/butterflytalker_gp.h"
#include "color/palette/gradient/flame_gp.h"
#include "color/palette/gradient/leo_gp.h"


#define CNT max(CNT_A, CNT_B)

class Pattern : public LightsBase
{
public:
  void preStateChange(int s);
};

#endif