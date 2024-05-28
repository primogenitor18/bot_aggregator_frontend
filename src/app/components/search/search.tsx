"use client"

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { SearchResult } from './result';

import { ISearchResult } from './interfaces';

import { BaseApi } from '@/app/api/base';

export function SearchData() {
  const [fts, setFts] = React.useState<string>('')
  const [searchData, setSearchData] = React.useState<ISearchResult[]>([])
  const [progress, setProgress] = React.useState<boolean>(false)

  const getSearchData = async () => {
    setProgress(true)
    const api = new BaseApi(1, 'search/fts');
    let res = await api.post(
      { fts: fts }, 'application/json', () => {}, {}
    );
    if (res.status === 200) {
      let resData: ISearchResult[] = res?.body?.map(
        (pr_res: any) => {
          return pr_res as ISearchResult
        }
      )
      setSearchData(resData)
    };
    setProgress(false)
  }

  return (
    <Box
      sx={{
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          value={fts}
          onChange={(e: React.ChangeEvent) => {setFts(e.target.value)}}
        />
        <IconButton
          type="button"
          sx={{ p: '10px' }}
          aria-label="search"
          onClick={
            () => {
              getSearchData()
            }
          }
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <Box>
        {progress
          ? <LinearProgress />
          : ''
        }
      </Box>
      {searchData.length
        ? <Box
          sx={{
            marginTop: '10px'
          }}
          >
          {searchData.map((sd: ISearchResult, index: number) => {
            return (
              <SearchResult key={`show-provider-data-${index}`} data={sd} />
            )
          })}
          </Box>
        : ''
      }
    </Box>
  );
}
