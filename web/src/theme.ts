import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    drawer: {
      width: number;
    };
    page: {
      backgroundColor: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    drawer?: {
      width?: number;
    };
    page: {
      backgroundColor: string;
    };
  }
}

export default createTheme({
  drawer: {
    width: 240,
  },
  page: {
    backgroundColor: "whitesmoke",
  },
});
