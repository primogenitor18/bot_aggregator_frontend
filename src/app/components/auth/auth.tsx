"use client"

import { useRouter } from 'next/navigation'

import { PropsWithChildren, useState, useEffect } from "react"

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { BaseApi } from '@/app/api/base';

import { WebSocket } from "../websocket/websocket";
import ButtonAppBar from "../appBar/appBar";
import { AuthForm } from "./authForm";

export function Auth(props: PropsWithChildren) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (!window.localStorage.getItem('access_token')) {
      router.push('/login')
    }
    setAccessToken(window.localStorage.getItem('access_token'))
  }, [])

  useEffect(() => {
    getAccountInfo()
  }, [accessToken])

  const getAccountInfo = async () => {
    if (!accessToken) { return }
    setLoading(true)
    const api = new BaseApi(1, 'account/info');
    let res = await api.get(
      {}, () => {}, {}
    );
    if (res.status !== 200) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAccessToken(null)
      router.push('/login')
    } else {
      localStorage.setItem("username", res?.body?.username);
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
        : <CircularProgress />
      }
    </>
  )
}
