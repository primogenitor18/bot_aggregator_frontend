"use client";

import { useRouter } from "next/navigation";

import { PropsWithChildren, useState, useEffect } from "react";

import toast, { Toaster } from "react-hot-toast";

import CircularProgress from "@mui/material/CircularProgress";

import { BaseApi } from "@/app/api/base";

import { WebSocket } from "../websocket/websocket";
import ButtonAppBar from "../appBar/appBar";

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
    if (!accessToken) return;

    setLoading(true);
    const api = new BaseApi(1, "account/info");
    try {
      let res: ApiResponse = await api.get({}, () => {}, {});
      if (res.status !== 200) {
        clearTokens();
        setAccessToken(null);
        router.push("/login");
        toast.error("Authentication error. Please log in again.");
      } else {
        if (res.body?.username) {
          localStorage.setItem("username", res.body.username);
        }
      }
    } catch (error) {
      clearTokens();
      setAccessToken(null);
      router.push("/login");
      toast.error("Error fetching user information.");
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    clearTokens();
    setAccessToken(null);
    router.push("/login");
    setLoading(false);
  };

  if (loading || !accessToken) {
    return (
      <CircularProgress
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  return (
    <>
      <WebSocket accessToken={String(accessToken)}>
        <ButtonAppBar logOut={logOut} />
        {props.children}
      </WebSocket>
      <Toaster />
    </>
  );
}
