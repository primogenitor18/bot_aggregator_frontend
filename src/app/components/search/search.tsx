"use client"

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { SearchResult } from './result';

import { IProviderInfo } from './interfaces';

import { BaseApi } from '@/app/api/base';

export function SearchData() {
  const [fts, setFts] = React.useState<string>('')
  const [startSearch, setStartSearch] = React.useState<boolean>(true)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [providers, setProviders] = React.useState<IProviderInfo[]>([])
  const [country, setCountry] = React.useState<string>('RU')
  const [searchType, setSearchType] = React.useState<string>('name')

  React.useEffect(() => {getProviders()}, [])

  React.useEffect(() => {
    if (!fts) { return }
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        setStartSearch(true)
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [fts]);

  const getProviders = async () => {
    setLoading(true)
    const api = new BaseApi(1, 'provider/list');
    let res = await api.get(
      {}, () => {}, {}
    );
    if (res.status === 200) {
      setProviders(res.body)
    };
    setLoading(false)
  }

  return (
    <Box
      sx={{
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
      }}
    >
      {loading
        ? <CircularProgress />
        : <>
            <Box sx={{ display: 'flex', marginBottom: '20px' }}>
              <Select
                sx={{ width: '200px', marginLeft: '5px', marginRight: '5px' }}
                id='country-select-id'
                value={country}
                label="Country"
                onChange={
                  (e: SelectChangeEvent) => {
                    setCountry(e.target.value)
                  }
                }
              >
                <MenuItem value={'RU'}>Russia</MenuItem>
                <MenuItem value={'UA'}>Ukraine</MenuItem>
                <MenuItem value={'BY'}>Belarus</MenuItem>
                <MenuItem value={'KZ'}>Kazakhstan</MenuItem>
              </Select>
              <Select
                sx={{ width: '200px', marginLeft: '5px', marginRight: '5px' }}
                id='search-type-select-id'
                value={searchType}
                label="Search type"
                onChange={
                  (e: SelectChangeEvent) => {
                    setSearchType(e.target.value)
                  }
                }
              >
                <MenuItem value={'name'}>Full name</MenuItem>
                <MenuItem value={'phone'}>Phone</MenuItem>
                <MenuItem value={'email'}>Email</MenuItem>
                <MenuItem value={'pasport'}>Passport</MenuItem>
                <MenuItem value={'inn'}>INN</MenuItem>
                <MenuItem value={'snils'}>Snils</MenuItem>
                <MenuItem value={'address'}>Address</MenuItem>
                <MenuItem value={'auto'}>Auto</MenuItem>
                <MenuItem value={'ogrn'}>OGRN</MenuItem>
              </Select>
            </Box>
            <Paper
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
                value={fts}
                onChange={
                  (e: React.ChangeEvent) => {
                    setStartSearch(false)
                    setFts(e.target.value)
                  }
                }
              />
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={
                  () => {
                    setStartSearch(true)
                  }
                }
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            {providers.length
              ? <Box
                  sx={{
                    marginTop: '10px',
                    display: 'flex',
                  }}
                >
                  {providers.map((provider) => {
                    return (
                      <SearchResult
                        fts={fts}
                        provider={provider.name}
                        search={startSearch}
                        searchType={searchType}
                        country={country}
                        key={`provider-result-key-${provider.name}`}
                      />
                    )
                  })}
                </Box>
              : ''
            }
          </>
      }
    </Box>
  );
}
