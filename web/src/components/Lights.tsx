import iro from "@jaames/iro";
import {
  useTheme,
  TextField,
  MenuItem,
  Card,
  Grid,
  Slider,
} from "@mui/material";
import { useContext, useCallback, useState } from "react";
import { GlobalWebsocketContext } from "../hooks/useWebsocket";
import {
  MessageType,
  Topics,
  PacketLightsAppearance,
  Packet,
  State,
  Palette,
} from "../serverTypes";
import { sendMessageThunk } from "../state/messageSlice";
import { useDispatch } from "../state/store";
import ColorPicker from "./subcomponents/ColorPicker";

const stateOptions: [number, string][] = [
  [State.STATE_HOME, "Home"],
  [State.STATE_PATTERN_NOISE, "Pattern - Noise"],
  [State.STATE_PATTERN_TWINKLEFOX, "Pattern - Twinklefox"],
  [State.STATE_PATTERN_PICKER, "Pattern - Color Picker"],
  [State.STATE_PATTERN_BEATWAVE, "Pattern - Beatwave"],
  [State.STATE_PATTERN_RIPPLE, "Pattern - Ripple"],
  [State.STATE_PATTERN_EVERYOTHER, "Pattern - Every Other"],
  [State.STATE_RESTART, "Restart"],
  [State.STATE_OTA, "OTA"],
];

const paletteOptions: [number, string][] = [
  [Palette.BlueWhite_p, "Blue & White"],
  [Palette.Holly_p, "Holly"],
  [Palette.Ice_p, "Ice"],
  [Palette.RedGreenWhite_p, "Red, Green, & White"],
  [Palette.RedWhite_p, "Red & White"],
  [Palette.RetroC9_p, "Retro C9"],
  [Palette.Snow_p, "Snow"],
  [Palette.RainbowColors_p, "Rainbow Colors"],
  [Palette.PartyColors_p, "Party Colors"],
];

export default function Lights() {
  const theme = useTheme();
  const ws = useContext(GlobalWebsocketContext);
  const dispatch = useDispatch();
  const [selectedState, setSelectedState] = useState(0);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState(0);
  const [selectedScale, setSelectedScale] = useState(0);

  const submitColor = useCallback(
    (c: iro.Color) => {
      const msg: PacketLightsAppearance = {
        senderId: process.env.REACT_APP_DEVICE_ID || "",
        type: MessageType.TYPE_MQTT_PUBLISH,
        topic: Topics.LIGHTS_APPEARANCE,
        h: ((c.hsv.h || 0) * 255) / 360,
        s: ((c.hsv.s || 0) * 255) / 100,
        v: ((c.hsv.v || 0) * 255) / 100,
      };
      dispatch(sendMessageThunk({ msg, ws }));
    },
    [dispatch, ws]
  );

  const submitSpeed = useCallback(
    (s: number) => {
      const msg: PacketLightsAppearance = {
        senderId: process.env.REACT_APP_DEVICE_ID || "",
        type: MessageType.TYPE_MQTT_PUBLISH,
        topic: Topics.LIGHTS_APPEARANCE,
        speed: s,
      };
      dispatch(sendMessageThunk({ msg, ws }));
    },
    [dispatch, ws]
  );

  const submitScale = useCallback(
    (s: number) => {
      const msg: PacketLightsAppearance = {
        senderId: process.env.REACT_APP_DEVICE_ID || "",
        type: MessageType.TYPE_MQTT_PUBLISH,
        topic: Topics.LIGHTS_APPEARANCE,
        scale: s,
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

  const changePalette = useCallback(
    (p: number) => {
      const msg: PacketLightsAppearance = {
        senderId: process.env.REACT_APP_DEVICE_ID || "",
        type: MessageType.TYPE_MQTT_PUBLISH,
        topic: Topics.LIGHTS_APPEARANCE,
        palette: p,
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
          >
            {stateOptions.map(([value, name]: [number, string], i) => (
              <MenuItem value={value} key={i}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Color Palette"
            value={selectedPalette}
            onChange={(e) => {
              const p = parseInt(e.target.value);
              setSelectedPalette(p);
              changePalette(p);
            }}
            select
          >
            {paletteOptions.map(([value, name]: [number, string], i) => (
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
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: theme.spacing(2) }}>
          <Slider
            name="Speed"
            value={selectedSpeed}
            onChange={(e, v) => {
              let speed = v;
              if (Array.isArray(v)) {
                speed = v[0];
              }
              setSelectedSpeed(speed as number);
            }}
            onChangeCommitted={() => submitSpeed(selectedSpeed)}
          />
          <Slider
            name="Scale"
            value={selectedScale}
            onChange={(e, v) => {
              let scale = v;
              if (Array.isArray(v)) {
                scale = v[0];
              }
              setSelectedScale(scale as number);
            }}
            onChangeCommitted={() => submitScale(selectedScale)}
          />
        </Card>
      </Grid>
    </Grid>
  );
}
