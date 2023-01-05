import { Button, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { api } from "../apis/axios";

const IncomingTrasnaction = ({ transactions }) => {
  const deleteTransaction = async (id) => {
    try {
      const csrfToken = await api["get"]("auth/token");
      await api["delete"](`/transactions/${id}/`, {
        headers: csrfToken.data
          ? { "X-CSRFToken": csrfToken.data.csrfToken }
          : {},
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

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
                  <b>Payers: </b>
                  {trans.payers.map((user) => user.username).join(",")}
                </Typography>
                <Stack direction={"row"} spacing={1}>
                  {/* <Button variant="contained" color="success">
                    Compeleted
                  </Button> */}
                  <Button
                    onClick={() => deleteTransaction(trans.id)}
                    variant="contained"
                    color="primary"
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))
        : "No Incoming transactions"}
    </Stack>
  );
};

export default IncomingTrasnaction;
