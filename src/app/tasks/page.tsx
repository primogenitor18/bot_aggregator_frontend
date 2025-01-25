import Box from "@mui/material/Box";

import { Auth } from "@/app/components/auth/auth";
import { Tasks } from "@/app/components/search/tasks";

export default function TasksPage() {
  return (
    <Box>
      <Auth>
        <Tasks />
      </Auth>
    </Box>
  );
}
