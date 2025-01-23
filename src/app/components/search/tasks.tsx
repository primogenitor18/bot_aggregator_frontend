"use client";

import Link from "next/link";

import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import ReplayIcon from "@mui/icons-material/Replay";

import { BaseApi } from "@/app/api/base";
import { Button, Modal, Tooltip } from "@mui/material";

import { TaskCreate } from "./taskInfo";

interface ITask {
  id: number;
  task_id: string;
  filename: string;
  status: string;
  created_at: Date;
  full_report: string;
}

export function Tasks() {
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [tasksCount, setTasksCount] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  React.useEffect(() => {
    getTasks();
  }, [offset]);

  React.useEffect(() => {
    getTasks();
  }, [limit]);

  const mockTasks: ITask[] = [
    {
      id: 1,
      task_id: "task_001",
      filename: "path/to/file_1.txt",
      status: "completed",
      created_at: new Date("2023-01-01"),
      full_report: "path/to/report_1.txt",
    },
    {
      id: 2,
      task_id: "task_002",
      filename: "path/to/file_2.txt",
      status: "pending",
      created_at: new Date("2023-01-02"),
      full_report: "",
    },
  ];

  // const getTasks = async () => {
  //   setLoading(true);
  //   const api = new BaseApi(1, "search/search_tasks/list");
  //   let res = await api.get({ limit: limit, offset: offset }, () => {}, {});
  //   if (res.status === 200) {
  //     setTasks(
  //       res.body.result.map((task: any) => {
  //         return {
  //           id: task.id,
  //           task_id: task.task_id,
  //           filename: task.filename,
  //           status: task.status,
  //           created_at: new Date(task.created_at),
  //           full_report: task.full_report,
  //         } as ITask;
  //       })
  //     );
  //     setTasksCount(res.body.count);
  //   }
  //   setLoading(false);
  // };

  const getTasks = async () => {
    setLoading(true);
    // Замените этот блок на фиктивные данные
    setTasks(mockTasks);
    setTasksCount(mockTasks.length);
    setLoading(false);
  };

  const restartTask = async (task_id: int) => {
    setLoading(true);
    const api = new BaseApi(1, "search/search_task/restart");
    let res = await api.post(
      { task_id: task_id },
      "application/json",
      () => {},
      {}
    );
    if (res.status === 200) {
      setTasks(
        tasks.map((task: ITask) => {
          if (task.id !== task_id) {
            return task;
          } else {
            return {
              ...task,
              status: "pending",
            } as ITask;
          }
        })
      );
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "20px",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" color="primary">
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Create Task
        </Button>
      </Typography>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TaskCreate onTaskCreated={handleCloseModal} />
        </Box>
      </Modal>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper sx={{ width: "800px", mb: 2 }}>
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minWidth: 650,
                  "& th": { fontWeight: "bold", textAlign: "center" },
                  "& td, & th": { padding: "8px 16px" },
                }}
                size="small"
                aria-label="tasks table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">Task id</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Task file</TableCell>
                    <TableCell align="center">Created date</TableCell>
                    <TableCell align="center">Report file</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow
                      key={`row-key-${task.id}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Tooltip title="Click to restart the task">
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => {
                              restartTask(task.id);
                            }}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Link href={`/tasks/${task.id}`}>{task.task_id}</Link>
                      </TableCell>
                      <TableCell align="center">{task.status}</TableCell>
                      <TableCell align="center">
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${task.filename}`}
                          target="_blank"
                        >
                          {
                            task.filename.split("/")[
                              task.filename.split("/").length - 1
                            ]
                          }
                        </a>
                      </TableCell>
                      <TableCell align="center">
                        {task.created_at.toUTCString()}
                      </TableCell>
                      <TableCell align="center">
                        {task.full_report ? (
                          <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${task.full_report}`}
                            target="_blank"
                          >
                            Report
                          </a>
                        ) : (
                          <></>
                        )}
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
              page={(offset / limit) | 0}
              onPageChange={(event: unknown, newPage: number) => {
                setOffset(newPage * limit);
              }}
              onRowsPerPageChange={(
                event: React.ChangeEvent<HTMLInputElement>
              ) => {
                setLimit(parseInt(event.target.value, 10));
              }}
            />
          </Paper>
        </>
      )}
    </Box>
  );
}
