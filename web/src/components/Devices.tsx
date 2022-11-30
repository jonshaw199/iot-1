import { useCallback, useMemo, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import {
  Button,
  Collapse,
  IconButton,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/system";
import { Types } from "mongoose";

import { Board, Device, Org } from "../serverTypes";
import { orgs as orgsSelector } from "../state/orgSlice";
import { useDispatch, useSelector } from "../state/store";
import {
  createDeviceThunk,
  devices as devicesSelector,
} from "../state/deviceSlice";

const Error = styled("div")(({ theme }) => ({
  color: "red",
  paddingTop: theme.spacing(1),
}));

function NewDevice() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const orgs = useSelector(orgsSelector);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [board, setBoard] = useState("");
  const [orgId, setOrgId] = useState("");

  const submit = useCallback(() => {
    try {
      dispatch(
        createDeviceThunk({
          name,
          board: board as Board,
          orgId: new Types.ObjectId(orgId),
        })
      );
    } catch (e) {
      setError(String(e));
    }
  }, [name, board, orgId, dispatch]);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>New Device</Typography>
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
              label="Board"
              value={board}
              onChange={(e) => setBoard(e.target.value || Board.BOARD_OTHER)}
              select
              sx={{ minWidth: 100 }}
            >
              {Object.values(Board).map((b, i) => (
                <MenuItem value={b} key={i}>
                  {b}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Org"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              select
              sx={{ minWidth: 100 }}
            >
              {Array.from(orgs.values()).map((o: Org, i) => (
                <MenuItem value={o._id.toString()} key={i}>
                  {o.name}
                </MenuItem>
              ))}
            </TextField>
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

function DeviceTableRow({ device }: { device: Device }) {
  const [open, setOpen] = useState(false);

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
          {device._id.toString()}
        </TableCell>
        <TableCell component="th" scope="row">
          {device.orgId.toString()}
        </TableCell>
        <TableCell component="th" scope="row">
          {device.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {device.board}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>Org</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function DeviceTable() {
  const deviceMap = useSelector(devicesSelector);

  const devices = useMemo(() => Array.from(deviceMap.values()), [deviceMap]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Device ID</TableCell>
            <TableCell>Org ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Board</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((d, i) => (
            <DeviceTableRow device={d} key={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export default function Devices() {
  return (
    <Container>
      <NewDevice />
      <DeviceTable />
    </Container>
  );
}
