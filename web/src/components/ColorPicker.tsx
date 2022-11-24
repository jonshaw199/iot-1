import iro from "@jaames/iro";
import { IroColorPicker } from "@jaames/iro/dist/ColorPicker";
import { useRef, useEffect } from "react";
import { Nullable } from "../serverTypes";

export default function ColorPicker({
  initial,
  onChange = () => null,
}: {
  initial?: Nullable<iro.Color>;
  onChange?: (c: iro.Color) => void;
}) {
  const pickerDivRef = useRef(null);
  const pickerRef = useRef<IroColorPicker | null>(null);

  useEffect(() => {
    if (!pickerRef.current) {
      pickerRef.current = iro.ColorPicker(pickerDivRef.current!, {
        color: initial || undefined,
      });
    }
    pickerRef.current.on("color:change", (c: iro.Color) => {
      onChange(c);
    });
  }, [initial, onChange]);

  return <div ref={pickerDivRef} />;
}
