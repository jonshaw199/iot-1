import iro from "@jaames/iro";
import { Paper, Box, useTheme, TextField, MenuItem } from "@mui/material";
import { useContext, useCallback, useState, useMemo } from "react";
import { GlobalWebsocketContext } from "../hooks/useWebsocket";
import {
  MessageType,
  Topics,
  PacketLightsColor,
  Packet,
  State,
} from "../serverTypes";
import { sendMessageThunk } from "../state/messageSlice";
import { useDispatch } from "../state/store";
import ColorPicker from "./ColorPicker";

export default function Lights() {
  const theme = useTheme();
  const ws = useContext(GlobalWebsocketContext);
  const dispatch = useDispatch();
  const [selectedState, setSelectedState] = useState(0);

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

  const changeState = useCallback(
    (s: number) => {
      const msg: Packet = {
        senderId: process.env.REACT_APP_DEVICE_ID || "",
        type: MessageType.TYPE_MQTT_PUBLISH,
        topic: Topics.LIGHTS_STATE,
        state: s,
        qos: 2,
      };
      dispatch(sendMessageThunk({ msg, ws }));
    },
    [dispatch, ws]
  );

  const stateOptions: [number, string][] = useMemo(
    () => [
      [State.STATE_HOME, "Home"],
      [State.STATE_PATTERN_NOISE, "Pattern - Noise"],
      [State.STATE_PATTERN_NOISEPLUSPALETTE, "Pattern - Noise+Palette"],
      [State.STATE_PATTERN_TWINKLEFOX, "Pattern - Twinklefox"],
      [State.STATE_RESTART, "Restart"],
      [State.STATE_OTA, "OTA"],
    ],
    []
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
        <TextField
          label="State"
          value={selectedState}
          onChange={(e) => {
            const s = parseInt(e.target.value);
            setSelectedState(s);
            changeState(s);
          }}
          select
          sx={{ minWidth: 250 }}
        >
          {stateOptions.map(([value, name]: [number, string], i) => (
            <MenuItem value={value} key={i}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Paper>
  );
}
