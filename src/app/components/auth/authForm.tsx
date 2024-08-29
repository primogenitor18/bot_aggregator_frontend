"use client"

import { useRouter } from 'next/navigation'

import { ChangeEvent, useState } from "react"

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { BaseApi } from '@/app/api/base';

export function AuthForm() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const auth = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'auth/login');
    let res = await api.post(
      { username: username, password: password }, 'application/json', () => {}, {}
    );
    if (res.status === 200) {
      localStorage.setItem("access_token", res?.body?.access_token);
      localStorage.setItem("refresh_token", res?.body?.refresh_token);
      router.push('/')
    };
    setLoading(false)
  }
  
  return (
    <Box
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
  )
}
