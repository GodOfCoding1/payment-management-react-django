import { Button, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const OutgoingTrasnaction = ({ transactions }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2} flexDirection={"col"}>
      {transactions.length
        ? transactions.map((trans, index) => (
            <Paper key={index} sx={{ p: 2, mt: 4 }}>
              <Stack sx={{ width: "100%" }} spacing={2} flexDirection={"col"}>
                <Typography variant="body1">
                  <b>{trans.about}</b>
                </Typography>
                <Typography variant="body2">
                  <b>Amount: </b>
                  {trans.amount}
                </Typography>
                <Typography variant="body2">
                  <b>Receiver: </b>
                  {trans.payee.username}
                </Typography>
                <Stack direction={"row"} spacing={1}>
                  {/* <Button variant="contained" color="success">
                    Compeleted
                  </Button> */}
                  <Button variant="contained" color="primary">
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))
        : "No Outgoing transactions"}
    </Stack>
  );
};

export default OutgoingTrasnaction;
