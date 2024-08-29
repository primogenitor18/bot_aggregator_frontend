"use client"

import Link from 'next/link'

import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { BaseApi } from '@/app/api/base';

interface ITask {
  id: number
  task_id: string
  filename: string
  status: string
}

export function Tasks() {
  const [tasks, setTasks] = React.useState<ITask[]>([])
  const [tasksCount, setTasksCount] = React.useState<number>(0)
  const [limit, setLimit] = React.useState<number>(10)
  const [offset, setOffset] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    getTasks()
  }, [offset])

  React.useEffect(() => {
    getTasks()
  }, [limit])

  const getTasks = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'search/search_tasks/list');
    let res = await api.get(
      {limit: limit, offset: offset}, () => {}, {}
    );
    if (res.status === 200) {
      setTasks(res.body.result.map(
        (task: any) => {
          return {
            id: task.id,
            task_id: task.task_id,
            filename: task.filename,
            status: task.status,
          } as ITask
        }
      ))
      setTasksCount(res.body.count)
    };
    setLoading(false)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" color="primary">
        <Link href='/tasks/0'>Create task</Link>
      </Typography>
      {loading
        ? <CircularProgress />
        : <>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Task id</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Filename</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow
                        key={`row-key-${task.id}`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Link href={`/tasks/${task.id}`}>{task.task_id}</Link>
                        </TableCell>
                        <TableCell align="right">{task.status}</TableCell>
                        <TableCell align="right">
                          <a href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${task.filename}`} target="_blank">{task.filename.split('/')[task.filename.split('/').length - 1]}</a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tasksCount}
                rowsPerPage={limit}
                page={offset / limit | 0}
                onPageChange={
                  (event: unknown, newPage: number) => {
                    setOffset(newPage * limit)
                  }
                }
                onRowsPerPageChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => {
                    setLimit(parseInt(event.target.value, 10))
                  }
                }
              />
            </Paper>
          </>
      }
    </Box>
  )
}
