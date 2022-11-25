import iro from "@jaames/iro";
import { IroColorPicker } from "@jaames/iro/dist/ColorPicker";
import { useRef, useEffect, useCallback } from "react";
import _throttle from "lodash/throttle";
import { Box } from "@mui/system";

export default function ColorPicker({
  initial,
  throttle,
  onChange = () => null,
  onChangeThrottled = () => null,
  onEnd = () => null,
}: {
  initial?: iro.Color | null;
  throttle?: number | null;
  onChange?: (c: iro.Color) => void;
  onChangeThrottled?: (c: iro.Color) => void;
  onEnd?: (c: iro.Color) => void;
}) {
  const pickerDivRef = useRef(null);
  const pickerRef = useRef<IroColorPicker | null>(null);

  const throttled = useCallback(
    _throttle((c: iro.Color) => {
      console.log(c);
      onChangeThrottled(c);
    }, throttle || undefined),
    [throttle, onChangeThrottled]
  );

  useEffect(() => {
    if (!pickerRef.current) {
      pickerRef.current = iro.ColorPicker(pickerDivRef.current!, {
        color: initial || undefined,
      });
      pickerRef.current.on("color:change", (c: iro.Color) => {
        onChange(c);
        throttled(c);
      });
      pickerRef.current.on("input:end", (c: iro.Color) => {
        console.log(c);
        onEnd(c);
      });
    }
  }, [initial, onChange]);

  return (
    <Box width={1} overflow="hidden" display="flex" justifyContent="center">
      <div ref={pickerDivRef} />
    </Box>
  );
}