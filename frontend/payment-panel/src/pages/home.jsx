import { Container, CssBaseline, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IncomingTrasnaction from "../components/Incoming";
import OutgoingTrasnaction from "../components/Outgoing";
import { api } from "../apis/axios";
import { useEffect } from "react";
import { useState } from "react";
import NormalTransaction from "../components/NormalTransaction";
import SplitTransaction from "../components/SplitTransaction";

function CenteredTabs({ transactions }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    <IncomingTrasnaction transactions={transactions.incoming} />,
    <OutgoingTrasnaction transactions={transactions.outgoing} />,
  ];

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Incoming" />
          <Tab label="Outgoing" />
        </Tabs>
      </Box>
      {tabs[value]}
    </>
  );
}

export default function Home() {
  const [transactions, setTransaction] = useState({ incoming: [] });
  const [accountInfo, setAccountInfo] = useState({ outgoing: [] });
  const [users, setUsers] = useState([]);
  const [mapUsers, setMapUsers] = useState({});
  useEffect(() => {
    (async () => {
      //users
      const res1 = await api["get"]("/users/");
      setUsers(res1.data);
      setMapUsers(
        res1.data.reduce(
          (prev, cur) => ({ ...prev, [cur.id]: cur.username }),
          {}
        )
      );

      //transactions
      const res2 = await api["get"]("/transactions/");
      setTransaction(res2.data);
      const data = res2.data;
      const temp = {};
      temp["income"] = data.incoming.length
        ? data.incoming.reduce(
            (prev, curr) =>
              prev +
              (curr.payers.length === 1
                ? curr.amount
                : curr.amount - curr.amount / (curr.payers?.length + 1)),
            0
          )
        : 0;
      temp["spends"] = data.outgoing.length
        ? data.outgoing.reduce(
            (prev, curr) =>
              prev +
              (curr.payers.length === 1
                ? curr.amount
                : curr.amount / (curr.payers?.length + 1)),

            0
          )
        : 0;
      console.log();
      setAccountInfo(temp);
    })();
  }, []);

  return (
    <Container component="main" sx={{ width: "100%" }}>
      <CssBaseline />
      <Stack sx={{ width: "100%" }} spacing={2} flexDirection={"col"}>
        <Paper sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6">
            <b>Account Balance: </b>
            {1000 + accountInfo.income - accountInfo.spends}
          </Typography>
          <Typography variant="body1">
            <b>Total Spendings: {accountInfo.spends}</b>
          </Typography>
          <Typography variant="body1">
            <b>Total Income: {accountInfo.income}</b>
          </Typography>
        </Paper>
        <Stack sx={{ width: "100%" }} direction={"row"} spacing={1}>
          <NormalTransaction users={users} />
          <SplitTransaction users={users} mapUsers={mapUsers} />
        </Stack>
        <CenteredTabs transactions={transactions} />
      </Stack>
    </Container>
  );
}
