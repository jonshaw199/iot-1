import iro from "@jaames/iro";
import { Paper, Box, useTheme, Typography } from "@mui/material";
import { Types } from "mongoose";
import { useState, useContext, useCallback, useRef, useEffect } from "react";
import { GlobalWebsocketContext } from "../hooks/useWebsocket";
import { MessageType, Topic, TopicMessageLightsColor } from "../serverTypes";
import ColorPicker from "./ColorPicker";

export default function Lights() {
  const theme = useTheme();
  const [color, setColor] = useState<iro.Color>();
  const { send } = useContext(GlobalWebsocketContext);

  const submitColor = useCallback(
    (c: iro.Color) => {
      const msg: Omit<TopicMessageLightsColor, "_id"> = {
        senderId: new Types.ObjectId(process.env.REACT_APP_DEVICE_ID),
        type: MessageType.TYPE_MQTT_BROADCAST,
        topic: Topic.LIGHTS_COLOR,
        h: c.hsv.h,
        s: c.hsv.s,
        v: c.hsv.v,
      };
      send(msg);
    },
    [send]
  );

  return (
    <Paper>
      <Box
        p={theme.spacing(2)}
        gap={theme.spacing(2)}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <ColorPicker throttle={333} onChangeThrottled={submitColor} />
      </Box>
    </Paper>
  );
}
