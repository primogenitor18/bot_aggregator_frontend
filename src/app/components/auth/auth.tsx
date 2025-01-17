"use client";

import { useRouter } from "next/navigation";

import { PropsWithChildren, useState, useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { BaseApi } from "@/app/api/base";

import { WebSocket } from "../websocket/websocket";
import ButtonAppBar from "../appBar/appBar";
import { AuthForm } from "./authForm";

interface ApiResponse {
  status: number;
  body: { username?: string };
}

export function Auth(props: PropsWithChildren) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setAccessToken(storedToken);
  }, []);

  useEffect(() => {
    if (accessToken) {
      getAccountInfo();
    }
  }, [accessToken]);

  const getAccountInfo = async () => {
    if (!accessToken) {
      return;
    }
    setLoading(true);
    const api = new BaseApi(1, "account/info");
    let res: ApiResponse = await api.get({}, () => {}, {});
    if (res.status !== 200) {
      clearTokens();
      setAccessToken(null);
      router.push("/login");
    } else {
      if (res.body?.username) {
        localStorage.setItem("username", res.body.username);
      }
    }
    setLoading(false);
  };

  const logOut = async () => {
    setLoading(true);
    clearTokens();
    setAccessToken(null);
    setLoading(false);
  };

  if (loading || !accessToken) {
    return <CircularProgress />;
  }

  return (
    <>
      <WebSocket accessToken={String(accessToken)}>
        <ButtonAppBar logOut={logOut} />
        {props.children}
      </WebSocket>
    </>
  );
}
