import logo from "../logo.svg";
import { Box } from "@mui/system";

export default function Dashboard() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      // sx={{ backgroundColor: "#282c34" }}
    >
      <img src={logo} className="App-logo" alt="logo" />
    </Box>
  );
}
