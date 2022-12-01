import iro from "@jaames/iro";
import { Paper, Box, useTheme } from "@mui/material";
import { useContext, useCallback } from "react";
import { GlobalWebsocketContext } from "../hooks/useWebsocket";
import { MessageType, Topics, PacketLightsColor } from "../serverTypes";
import { sendMessageThunk } from "../state/messageSlice";
import { useDispatch } from "../state/store";
import ColorPicker from "./ColorPicker";

export default function Lights() {
  const theme = useTheme();
  const ws = useContext(GlobalWebsocketContext);
  const dispatch = useDispatch();

  const submitColor = useCallback(
    (c: iro.Color) => {
      const msg: PacketLightsColor = {
        senderId: process.env.REACT_APP_DEVICE_ID || "",
        type: MessageType.TYPE_MQTT_PUBLISH,
        topic: Topics.LIGHTS_COLOR,
        h: ((c.hsv.h || 0) * 255) / 360,
        s: ((c.hsv.s || 0) * 255) / 100,
        v: ((c.hsv.v || 0) * 255) / 100,
        qos: 2,
      };
      dispatch(sendMessageThunk({ msg, ws }));
    },
    [dispatch, ws]
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
