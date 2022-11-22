import { useMemo, useState, useCallback, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Collapse,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { User } from "../serverTypes";
import { GlobalUserContext } from "../state/user";

const Error = styled("div")(({ theme }) => ({
  color: "red",
  paddingTop: theme.spacing(1),
}));

function NewUser() {
  const theme = useTheme();
  const { create } = useContext(GlobalUserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = useCallback(() => {
    if (name && email && pass) {
      setError("");
      try {
        create({ email, name, password: pass });
      } catch (e) {
        setError(String(e));
      }
    } else {
      setError("Please fill out all required fields");
    }
  }, [name, email, pass, create]);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>New User</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" gap={1} flexWrap="wrap">
            <TextField
              required
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
          </Box>
          {error && <Error>{error}</Error>}
          <Box pt={theme.spacing(1)}>
            <Button variant="outlined" onClick={() => submit()}>
              Submit
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function UsersTableRow({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const { remove } = useContext(GlobalUserContext);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset !important" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {user._id.toString()}
        </TableCell>
        <TableCell component="th" scope="row">
          {user.orgId.toString()}
        </TableCell>
        <TableCell component="th" scope="row">
          {user.name}
        </TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => remove(user._id.toString())}
              >
                Delete
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function UsersTable() {
  const { users: userMap } = useContext(GlobalUserContext);

  const users = useMemo(() => Array.from(userMap.values()), [userMap]);

  return useMemo(
    () => (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>User ID</TableCell>
              <TableCell>Org ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, i) => (
              <UsersTableRow user={user} key={i} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ),
    [users]
  );
}

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export default function Messages() {
  return (
    <Container>
      <NewUser />
      <UsersTable />
    </Container>
  );
}
