"use client"

import { PropsWithChildren, useState, ChangeEvent, useEffect } from "react"

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { BaseApi } from '@/app/api/base';

import { WebSocket } from "../websocket/websocket";
import ButtonAppBar from "../appBar/appBar";

export function Auth(props: PropsWithChildren) {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    setAccessToken(window.localStorage.getItem('access_token'))
  }, [])

  useEffect(() => {
    if (!accessToken) { return }
    getAccountInfo()
  }, [accessToken])

  const getAccountInfo = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'account/info');
    let res = await api.get(
      {}, () => {}, {}
    );
    if (res.status !== 200) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAccessToken(null)
    } else {
      localStorage.setItem("username", res?.body?.username);
    };
    setLoading(false)
  }

  const auth = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'auth/login');
    let res = await api.post(
      { username: username, password: password }, 'application/json', () => {}, {}
    );
    if (res.status === 200) {
      localStorage.setItem("access_token", res?.body?.access_token);
      localStorage.setItem("refresh_token", res?.body?.refresh_token);
      setAccessToken(res?.body?.access_token)
    };
    setLoading(false)
  }

  const logOut = async () => {
    setLoading(true)
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null)
    setLoading(false)
  }

  return (
    <>
      {accessToken
        ? <>
            <WebSocket accessToken={String(accessToken)}>
              <ButtonAppBar logOut={logOut} />
              {props.children}
            </WebSocket>
          </>
        : <Box
          sx={{
            display: 'block',
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto',
            '& .MuiTextField-root': { display: 'block' },
            padding: '10px'
          }}
          >
            <TextField
              id="username"
              label="Username"
              value={username}
              onChange={(e: ChangeEvent) => {setUsername(e.target.value)}}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent) => {setPassword(e.target.value)}}
            />
            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => {auth()}}
            >
              {loading
                ? <CircularProgress />
                : <Typography variant="button">LogIn</Typography>
              }
            </Button>
          </Box>
      }
    </>
  )
}
