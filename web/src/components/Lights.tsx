import { Paper, Box, useTheme, Typography } from "@mui/material";
import { Types } from "mongoose";
import { useState, useContext, useCallback } from "react";
import { HuePicker, AlphaPicker, ColorResult } from "react-color";
import { GlobalWebsocketContext } from "../hooks/useWebsocket";
import { MessageType, Topic, TopicMessageColor } from "../serverTypes";

export default function Lights() {
  const theme = useTheme();
  const [color, setColor] = useState<ColorResult>();
  const { send } = useContext(GlobalWebsocketContext);

  const submitColor = useCallback(
    (c: ColorResult) => {
      const msg: Omit<TopicMessageColor, "_id"> = {
        senderId: new Types.ObjectId(process.env.REACT_APP_DEVICE_ID),
        type: MessageType.TYPE_MQTT_BROADCAST,
        topic: Topic.LIGHTS_COLOR,
        h: c.hsl.h,
        s: c.hsl.s,
        l: c.hsl.l,
        a: c.hsl.a,
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
      >
        <Typography>Color Picker</Typography>
        <HuePicker
          color={color?.rgb}
          onChange={(c) => setColor(c)}
          onChangeComplete={(c) => submitColor(c)}
          width="100%"
        />
        <AlphaPicker
          color={color?.rgb}
          onChange={(c) => setColor(c)}
          onChangeComplete={(c) => submitColor(c)}
          width="100%"
        />
      </Box>
    </Paper>
  );
}
