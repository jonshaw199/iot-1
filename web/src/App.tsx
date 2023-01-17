import { useEffect, useRef, useState } from "react";
import { styled, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import Nav from "./components/Nav";
import Dashboard from "./components/Dashboard";
import Messages from "./components/Messages";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./components/Users";
import Settings from "./components/Settings";
import { useMemo } from "react";
import Login from "./components/Login";
import { GlobalWebsocketContext, useWebsocket } from "./hooks/useWebsocket";
import Orgs from "./components/Orgs";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import Devices from "./components/Devices";
import Lights from "./components/Lights";
import { useDispatch, useSelector } from "./state/store";
import {
  authWithTokenThunk,
  currentUserSelector,
  getUserListThunk,
  tokenSelector,
} from "./state/userSlice";
import { getOrgListThunk } from "./state/orgSlice";
import { getDeviceListThunk } from "./state/deviceSlice";
import { recvMessageThunk } from "./state/messageSlice";
import { MessageType, Packet } from "./serverTypes";

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
  minHeight: "100vh",
  backgroundColor: theme.page.backgroundColor,
}));

function LoggedIn() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const ws = useWebsocket<Packet>({
    url: `ws://${process.env.REACT_APP_SERVER_ADDRESS}/?deviceId=${process.env.REACT_APP_DEVICE_ID}&pubs=63c47ae8d7531ebb0ded4b9a`,
    onOpen: () => {
      ws.send({
        senderId: process.env.REACT_APP_DEVICE_ID!,
        topic: "lights/#",
        type: MessageType.TYPE_MQTT_SUBSCRIBE,
        qos: 0,
      });
    },
    onRecv: (m) => {
      dispatch(recvMessageThunk({ msg: m, ws }));
    },
  });

  return (
    <>
      <GlobalWebsocketContext.Provider value={ws}>
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
            <Route path="devices/" element={<Devices />} />
            <Route path="lights/" element={<Lights />} />
          </Routes>
        </Main>
      </GlobalWebsocketContext.Provider>
    </>
  );
}

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserSelector);
  const token = useSelector(tokenSelector);

  const initialLoadRef = useRef(true);
  const [loadingInitially, setLoadingInitially] = useState(true);

  const loggedIn = useMemo(() => token && currentUser, [token, currentUser]);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      setTimeout(() => setLoadingInitially(false), 1000);
      dispatch(authWithTokenThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(getOrgListThunk());
      dispatch(getUserListThunk());
      dispatch(getDeviceListThunk());
    }
  }, [token, dispatch]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Outer>
          {loadingInitially ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={1}
            >
              <CircularProgress />
            </Box>
          ) : loggedIn ? (
            <LoggedIn />
          ) : (
            <Login />
          )}
        </Outer>
      </ThemeProvider>
    </Router>
  );
}

export default App;
