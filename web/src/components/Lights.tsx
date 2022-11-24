import iro from "@jaames/iro";
import { IroColorPicker } from "@jaames/iro/dist/ColorPicker";
import { Paper, Box, useTheme, Typography } from "@mui/material";
import { Types } from "mongoose";
import { useState, useContext, useCallback, useRef, useEffect } from "react";
import { HuePicker, AlphaPicker, ColorResult, Color } from "react-color";
import { GlobalWebsocketContext } from "../hooks/useWebsocket";
import { MessageType, Topic, TopicMessageColor } from "../serverTypes";

export default function Lights() {
  const theme = useTheme();
  const [color, setColor] = useState<ColorResult>();
  const { send } = useContext(GlobalWebsocketContext);
  const pickerDivRef = useRef(null);
  const pickerRef = useRef<IroColorPicker | null>(null);

  useEffect(() => {
    if (!pickerRef.current) {
      pickerRef.current = iro.ColorPicker(pickerDivRef.current!, {});
      pickerRef.current.on("color:change", (c: Color) => {
        console.log(c);
      });
    }
  }, []);

  console.log(pickerRef.current);

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
        <div ref={pickerDivRef} />
      </Box>
    </Paper>
  );
}
