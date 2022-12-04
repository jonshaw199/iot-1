import iro from "@jaames/iro";
import { useTheme, TextField, MenuItem, Card, Grid } from "@mui/material";
import { useContext, useCallback, useState } from "react";
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
import ColorPicker from "./subcomponents/ColorPicker";

const stateOptions: [number, string][] = [
  [State.STATE_HOME, "Home"],
  [State.STATE_PATTERN_NOISE, "Pattern - Noise"],
  [State.STATE_PATTERN_TWINKLEFOX, "Pattern - Twinklefox"],
  [State.STATE_PATTERN_PICKER, "Pattern - Color Picker"],
  [State.STATE_PATTERN_CONFETTI, "Pattern - Confetti"],
  [State.STATE_RESTART, "Restart"],
  [State.STATE_OTA, "OTA"],
];

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
      };
      dispatch(sendMessageThunk({ msg, ws }));
    },
    [dispatch, ws]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: theme.spacing(2) }}>
          <TextField
            label="State"
            value={selectedState}
            onChange={(e) => {
              const s = parseInt(e.target.value);
              setSelectedState(s);
              changeState(s);
            }}
            select
            // sx={{ flex: 1 }}
          >
            {stateOptions.map(([value, name]: [number, string], i) => (
              <MenuItem value={value} key={i}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: theme.spacing(2) }}>
          <ColorPicker throttle={333} onChangeThrottled={submitColor} />
        </Card>
      </Grid>
    </Grid>
  );
}
