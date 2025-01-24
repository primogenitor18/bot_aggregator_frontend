"use client";

import Link from "next/link";

import { useParams } from "next/navigation";

import * as React from "react";

import toast, { Toaster } from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { BaseApi } from "@/app/api/base";
import { DeleteForever, UploadFile } from "@mui/icons-material";

interface ReportResponse {
  files: string[];
}

export function TaskCreate({ onTaskCreated }: { onTaskCreated?: () => void }) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const createTask = async () => {
    if (!file) return;
    setLoading(true);
    const api = new BaseApi(1, "search/search_task/create");
    let formData = new FormData();
    formData.append("file", file);

    try {
      let res = await api.post(formData, "multipart/form-data", () => {}, {});
      if (res.status === 200) {
        toast.success("File uploaded successfully!");
        if (onTaskCreated) onTaskCreated();
      } else {
        toast.error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFile />}
        >
          {file ? "Change File" : "Select File"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>

      {file && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.paper",
            padding: 1,
            borderRadius: "8px",
            boxShadow: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%",
            }}
          >
            {file.name}
          </Typography>
          <IconButton
            aria-label="remove file"
            color="error"
            onClick={removeFile}
          >
            <DeleteForever />
          </IconButton>
        </Box>
      )}

      <Box>
        <Button
          variant="outlined"
          disabled={!file || loading}
          onClick={createTask}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Box>
    </Box>
  );
}

interface TaskReportProps {
  id: number;
}

export function TaskReport({ id }: TaskReportProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<string[]>([]);

  React.useEffect(() => {
    getReport();
  }, [id]);

  const getReport = async () => {
    setLoading(true);
    const api = new BaseApi(1, "search/search_task/report");
    const res = (await api.get({ task_id: id }, () => {}, {})) as unknown as {
      status: number;
      body: ReportResponse;
    };
    if (res.status === 200) {
      setFiles(res.body.files);
    }
    setLoading(false);
  };

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            padding: "20px",
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
          }}
        >
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <Typography variant="body1">Files not found</Typography>
      ) : (
        <List>
          {files.map((file: string) => (
            <ListItem key={`list-file-key-${file}`}>
              <a
                href={`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/${file}`}
                target="_blank"
              >
                {file.split("/")[file.split("/").length - 1]}
              </a>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

// export function TaskInfo() {
//   return (
//     <Box>
//       <Box sx={{ display: "flex", padding: "20px" }}>
//         <ArrowBackIcon color="primary" />
//         <Typography variant="h6" color="primary">
//           <Link href="/tasks">Return</Link>
//         </Typography>
//       </Box>
//       <TaskReport />
//     </Box>
//   );
// }
