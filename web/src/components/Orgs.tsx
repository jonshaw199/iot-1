import { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  TextField,
  useTheme,
} from "@mui/material";

import { Org } from "../serverTypes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/system";
import { GlobalOrgContext } from "../state/org";

const Error = styled("div")(({ theme }) => ({
  color: "red",
  paddingTop: theme.spacing(1),
}));

function NewOrg() {
  const theme = useTheme();
  const { create } = useContext(GlobalOrgContext);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const submit = useCallback(() => {
    try {
      create({});
    } catch (e) {
      setError(String(e));
    }
  }, [create]);

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>New Org</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" gap={1} flexWrap="wrap">
            <TextField
              required
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

function MessageTableRow({ org }: { org: Org }) {
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
          {org._id.toString()}
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

function OrgTable() {
  const { orgs: orgMap, getList } = useContext(GlobalOrgContext);

  useEffect(() => {
    getList();
  }, [getList]);

  const orgs = useMemo(() => Array.from(orgMap.values()), [orgMap]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Org ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orgs.map((org, i) => (
            <MessageTableRow org={org} key={i} />
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

export default function Orgs() {
  return (
    <Container>
      <NewOrg />
      <OrgTable />
    </Container>
  );
}
