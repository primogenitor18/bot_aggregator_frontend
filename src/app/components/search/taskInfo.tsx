"use client"

import Link from 'next/link'

import { useParams } from 'next/navigation';

import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link as MUILink } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { BaseApi } from '@/app/api/base';

export function TaskCreate() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [taskId, setTaskId] = React.useState<string>('')
  const [open, setOpen] = React.useState(false);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const createTask = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'search/search_task/create');
    let res = await api.post(
      { file: file }, 'multipart/form-data', () => {}, {}
    );
    if (res.status !== 200) {
      setOpen(true);
    } else {
      setTaskId(res.body.task_id)
    }
    setLoading(false)
  }

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx= {{ padding: '20px', width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
      <Box sx={{ marginBottom: '10px' }}>
        <input id="file" type="file" onChange={handleFileChange} />
      </Box>
      <Box>
        <Button
          variant="outlined"
          disabled={loading || !file}
          onClick={() => {createTask()}}
        >
          {loading
            ? <CircularProgress />
            : <Typography variant="button">Upload</Typography>
          }
        </Button>
      </Box>
      <Box>
        {taskId
          ? <Typography variant="h6">Task id: {taskId}</Typography>
          : <></>
        }
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Create task failed"
        action={action}
      />
    </Box>
  )
}

export function TaskReport() {
  const { id } = useParams()

  const [loading, setLoading] = React.useState<boolean>(false)
  const [files, setFiles] = React.useState<string[]>([])

  React.useEffect(() => {
    getReport()
  }, [])

  const getReport = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'search/search_task/report');
    let res = await api.get(
      {task_id: id}, () => {}, {}
    );
    if (res.status === 200) {
      setFiles(res.body.files)
    };
    setLoading(false)
  }

  return (
    <Box>
      {loading
        ? <CircularProgress />
        : <List>
            {files.map((file: string) => (
              <ListItem key={`list-file-key-${file}`}>
                <a href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${file}`} target="_blank">{file.split('/')[file.split('/').length - 1]}</a>
              </ListItem>
            ))}
          </List>
      }
    </Box>
  )
}

export function TaskInfo() {
  const { id } = useParams()

  return (
    <Box>
      <Box sx={{ display: 'flex', padding: '20px' }}>
        <ArrowBackIcon color="primary" />
        <Typography variant="h6" color="primary">
          <Link href='/tasks'>Return</Link>
        </Typography>
      </Box>
      {id && id !== '0'
        ? <TaskReport />
        : <TaskCreate />
      }
    </Box>
  )
}
