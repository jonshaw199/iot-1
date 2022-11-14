import { TextField, styled, Button, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { useCallback, useContext, useState } from "react";
import { GlobalUserContext } from "../state/user";

const Error = styled("div")(({ theme }) => ({
  color: "red",
  paddingTop: theme.spacing(1),
}));

export default function Login() {
  const theme = useTheme();
  const { auth } = useContext(GlobalUserContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = useCallback(() => {
    if (email && pass) {
      setError("");
      try {
        auth({ email, password: pass });
      } catch (e) {
        setError(String(e));
      }
    } else {
      setError("Please fill out all required fields");
    }
  }, [email, pass, auth]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Box
          maxWidth={250}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={theme.spacing(1)}
        >
          <Typography variant="h5">Login</Typography>
          <TextField
            required
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            label="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <Error>{error}</Error>}
          <Box pt={theme.spacing(1)}>
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
