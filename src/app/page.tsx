import * as React from 'react';
import Box from '@mui/material/Box';

import { Auth } from './components/auth/auth';
import { SearchData } from './components/search/search';

export default function Home() {
  return (
    <Box>
      <Auth>
        <SearchData />
      </Auth>
    </Box>
  );
}
