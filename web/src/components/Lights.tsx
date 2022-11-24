import { Paper, Box, useTheme, Typography } from "@mui/material";
import { useState } from "react";
import { HuePicker, AlphaPicker, ColorResult } from "react-color";

export default function Lights() {
  const theme = useTheme();
  const [color, setColor] = useState<ColorResult>();
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
          width="100%"
        />
        <AlphaPicker
          color={color?.rgb}
          onChange={(c) => setColor(c)}
          width="100%"
        />
      </Box>
    </Paper>
  );
}
