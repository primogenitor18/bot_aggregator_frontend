import * as React from "react";
import Box from "@mui/material/Box";

import { Auth } from "./components/auth/auth";
import { SearchData } from "./components/search/search";

const Home: React.FC = () => {
  return (
    <Box>
      <Auth>
        <SearchData />
      </Auth>
    </Box>
  );
};

export default Home;
