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

import { TaskCreate, TaskReport } from "./taskInfo";

interface ITask {
  id: number;
  task_id: string;
  filename: string;
  status: string;
  created_at: Date;
  full_report: string;
}

interface ApiResponse<T = any> {
  status: number;
  body?: T;
  result?: T;
  count?: T;
}

export function Tasks() {
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [tasksCount, setTasksCount] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(
    null
  );

  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState<"report" | "create">(
    "create"
  );

  const handleOpenReportModal = (taskId: number | null) => {
    setSelectedTaskId(taskId);
    setModalType("report");
    setOpenModal(true);
  };

  const handleOpenCreateModal = () => {
    setModalType("create");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
    setOpenModal(false);
  };

  const handleNoFiles = () => {
    setModalType("create");
    setOpenModal(true);
  };

  React.useEffect(() => {
    getTasks();
  }, [offset, limit]);

  const getTasks = async () => {
    setLoading(true);
    const api = new BaseApi(1, "search/search_tasks/list");
    let res: ApiResponse = await api.get(
      { limit: limit, offset: offset },
      () => {},
      {}
    );
    if (res.status === 200) {
      setTasks(
        res.body.result.map((task: any) => {
          return {
            id: task.id,
            task_id: task.task_id,
            filename: task.filename,
            status: task.stastus,
            created_at: new Date(task.created_at),
            full_report: task.full_report,
          } as ITask;
        })
      );
      setTasksCount(res.body.count);
    }
    setLoading(false);
  };

  const restartTask = async (task_id: number) => {
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateModal}
        >
          Create Task
        </Button>
      </Typography>

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
                        <Button
                          variant="text"
                          color="primary"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleOpenReportModal(task.id)}
                        >
                          {task.task_id}
                        </Button>
                      </TableCell>
                      <TableCell align="center">{task.status}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="text"
                          color="primary"
                          component="a"
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${task.filename}`}
                          target="_blank"
                          sx={{ textTransform: "none" }}
                        >
                          {
                            task.filename.split("/")[
                              task.filename.split("/").length - 1
                            ]
                          }
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {task.created_at.toUTCString()}
                      </TableCell>
                      <TableCell align="center">
                        {task.full_report && (
                          <Button
                            variant="text"
                            color="primary"
                            component="a"
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${task.full_report}`}
                            target="_blank"
                            sx={{ textTransform: "none" }}
                          >
                            Report
                          </Button>
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {modalType === "create" && (
            <TaskCreate onTaskCreated={() => setOpenModal(false)} />
          )}
          {modalType === "report" && selectedTaskId && (
            <TaskReport id={selectedTaskId} onNoFiles={handleNoFiles} />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
