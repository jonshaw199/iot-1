import { useEffect, useState } from "react";
import { styled, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import Messages from "./components/Messages";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./components/Users";
import Settings from "./components/Settings";
import { GlobalUserContext, useUserState } from "./state/user";
import { useMemo } from "react";
import Login from "./components/Login";
// import { useAF1Websocket } from "./hooks/useWebsocket";
import Orgs from "./components/Orgs";
import { GlobalOrgContext, useOrgState } from "./state/org";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  padding: theme.spacing(1),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: theme.drawer.width,
  }),
}));

const Outer = styled("div")(({ theme }) => ({
  height: "100vh",
  backgroundColor: theme.page.backgroundColor,
}));

//const orgId = 1; // to do
//const deviceId = -1; // to do

function LoggedIn() {
  const [open, setOpen] = useState(false);
  //const { currentUser } = useUserState();

  /*useAF1Websocket({
    url: `ws://127.0.0.1:3000/lights/ws?orgId=${orgId}&deviceId=${deviceId}`,
    onRecv: (m) => console.log(m),
    orgId: orgId
  });*/

  return (
    <>
      <Nav
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
      <Main open={open}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="messages/" element={<Messages />} />
          <Route path="users/" element={<Users />} />
          <Route path="settings/" element={<Settings />} />
          <Route path="orgs/" element={<Orgs />} />
        </Routes>
      </Main>
    </>
  );
}

function App() {
  const userState = useUserState();
  const { token, currentUser, authWithToken } = userState;
  const loggedIn = useMemo(() => token && currentUser, [token, currentUser]);
  const orgState = useOrgState();

  useEffect(() => {
    authWithToken();
  }, [authWithToken]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalOrgContext.Provider value={orgState}>
          <GlobalUserContext.Provider value={userState}>
            <Outer>{true ? <LoggedIn /> : <Login />}</Outer>
          </GlobalUserContext.Provider>
        </GlobalOrgContext.Provider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
