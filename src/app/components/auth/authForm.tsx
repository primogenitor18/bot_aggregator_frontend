"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import toast, { Toaster } from "react-hot-toast";

import { BaseApi } from "@/app/api/base";

interface ApiResponse {
  status: number;
  body?: { access_token?: string; refresh_token?: string };
}

export function AuthForm() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const auth = async () => {
    if (!username || !password) {
      toast.error("Both fields are required");
      return;
    }
    setLoading(true);
    const api = new BaseApi(1, "auth/login");
    try {
      let res: ApiResponse = await api.post(
        { username: username, password: password },
        "application/json",
        () => {},
        {}
      );
      if (res.status === 200) {
        localStorage.setItem("access_token", res?.body?.access_token || "");
        localStorage.setItem("refresh_token", res?.body?.refresh_token || "");
        router.push("/");
        toast.success("Successfully logged in!");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        padding: 2,
        position: "relative",
        "& .MuiTextField-root": {
          width: "100%",
          marginBottom: 2,
        },
        "& .MuiButton-root": {
          marginTop: 2,
          width: "100%",
        },
      }}
    >
      <TextField
        id="username"
        label="Username"
        value={username}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUsername(e.target.value);
        }}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      />
      <Button
        variant="outlined"
        disabled={loading}
        onClick={() => {
          auth();
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="button">LogIn</Typography>
        )}
      </Button>

      <Toaster />
    </Box>
  );
}
