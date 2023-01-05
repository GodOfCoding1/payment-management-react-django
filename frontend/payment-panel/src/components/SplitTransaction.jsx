import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { api } from "../apis/axios";
import { Stack } from "@mui/system";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SplitTransaction({ users, mapUsers }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [usernames, setUsersLabel] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (usernames.length < 2) {
      return window.alert("select at least 2 people");
    }

    const data = new FormData(event.currentTarget);
    for (let u in usernames) {
      data.append("payers", usernames[u]);
    }
    const csrfToken = await api["get"]("auth/token");
    try {
      await api["post"]("/transactions/", data, {
        headers: csrfToken.data
          ? { "X-CSRFToken": csrfToken.data.csrfToken }
          : {},
        withCredentials: true,
      });
      window.location.reload("");
    } catch (error) {
      console.log(error.response);
      window.alert(error.response.data.message || error.response.statusText);
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setUsersLabel(value);
  };

  function getStyles(username, usersLabel, theme) {
    return {
      fontWeight:
        usersLabel.indexOf(username) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Make Spit Transaction
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Split Transaction
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Stack sx={{ width: "100%", paddingInline: "20%" }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 6 }}
          >
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="uers">Username(s)</InputLabel>
              <Select
                labelId="users"
                id="users"
                multiple
                value={usernames}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={mapUsers[value]} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {users.map((user, index) => (
                  <MenuItem
                    key={index}
                    value={user.id}
                    style={getStyles(user.username, usernames, theme)}
                  >
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              name="amount"
              label="Amount"
              type="number"
              id="amount"
              autoComplete="amount"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </Dialog>
    </div>
  );
}
