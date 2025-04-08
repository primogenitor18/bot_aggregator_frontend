"use client";

import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

import { IDcitionary } from "@/app/types/types";
import { INameDictMap } from "@/app/types/props";

interface IWebsocketProps {
  accessToken: string;
  children: React.ReactNode;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const WebSocket = (props: IWebsocketProps) => {
  // For testing on localhost
  const backendUri =
    process.env.NEXT_PUBLIC_WS_BACKEND_URI || "ws://localhost:3000";
  let uri = new URL(`${backendUri}/websocket`);

  // let uri = new URL(`${process.env.NEXT_PUBLIC_WS_BACKEND_URI}/websocket`);
  uri.searchParams.append("token", props.accessToken);
  const [socketUrl, setSocketUrl] = useState<string>(uri.href);
  const [open, setOpen] = React.useState<boolean>(false);
  const [tgCode, setTgCode] = React.useState<string>("");
  const [lastSocketMessages, setLastSocketMessages] =
    React.useState<INameDictMap>({});
  const [recievedSocketId, setRecievedSocketId] =
    React.useState<boolean>(false);
  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        socketMessages: lastSocketMessages,
      });
    }
    return child;
  });

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      share: true,
      onMessage: (event: MessageEvent<any>) => {
        let data: IDcitionary<number | string | boolean | undefined> =
          JSON.parse(event.data);
        let _key: string = String(data.name);
        if (data.event_type === "connect") {
          localStorage.setItem("SocketId", String(data.socket_id));
          setRecievedSocketId(true);
        } else if (data.event_type === "code_request") {
          setOpen(true);
        } else if (_key) {
          setLastSocketMessages({ ...lastSocketMessages, [_key]: data });
        }
      },
    }
  );

  useEffect(() => {
    if (window.localStorage.getItem("SocketId")) {
      setRecievedSocketId(true);
    }
  }, []);

  const handleSendCode = () => {
    if (!tgCode) {
      return;
    }
    sendMessage(JSON.stringify({ token: tgCode }));
    setOpen(false);
  };

  return (
    <div>
      {open ? (
        <BootstrapDialog
          onClose={() => {}}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Telegram code
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="tgCode"
              label="Telegram code"
              fullWidth
              variant="standard"
              value={tgCode}
              onChange={(e) => {
                setTgCode(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleSendCode}>
              Send code
            </Button>
          </DialogActions>
        </BootstrapDialog>
      ) : (
        ""
      )}
      {recievedSocketId ? <>{childrenWithProps}</> : <CircularProgress />}
    </div>
  );
};
