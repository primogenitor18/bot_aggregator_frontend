"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { SearchResult } from "./result";

import { IProviderInfo } from "./interfaces";

import { BaseApi } from "@/app/api/base";

import { INameDictMap } from "@/app/types/props";
import { FormControl, InputLabel } from "@mui/material";

interface ISearchData {
  socketMessages?: INameDictMap;
}

const mockProviders = [
  {
    name: "Provider 1",
    type: "Internet",
    country: "RU",
  },
  {
    name: "Provider 2",
    type: "Electricity",
    country: "UA",
  },
  {
    name: "Provider 3",
    type: "Telecommunications",
    country: "BY",
  },
  {
    name: "Provider 4",
    type: "Water",
    country: "KZ",
  },
  {
    name: "Provider 5",
    type: "Gas",
    country: "RU",
  },
  {
    name: "Provider 6",
    type: "Insurance",
    country: "UA",
  },
];

export function SearchData(props: ISearchData) {
  const [fts, setFts] = React.useState<string>("");
  const [startSearch, setStartSearch] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [providers, setProviders] = React.useState<IProviderInfo[]>([]);
  const [country, setCountry] = React.useState<string>("");
  const [searchType, setSearchType] = React.useState<string>("");

  // React.useEffect(() => {
  //   getProviders();
  // }, []);

  React.useEffect(() => {
    // Имитируем загрузку провайдеров
    setLoading(true);
    setTimeout(() => {
      setProviders(mockProviders); // Заменяем данные на моковые
      setLoading(false);
    }, 1000); // Задержка, как если бы данные загружались
  }, []);

  const handleSearch = () => {
    setStartSearch(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStartSearch(false);
    setFts(e.target.value);
  };

  // const getProviders = async () => {
  //   setLoading(true);
  //   const api = new BaseApi(1, "provider/list");
  //   try {
  //     const res: { status: number; body?: any } = await api.get(
  //       {},
  //       () => {},
  //       {}
  //     );
  //     if (res.status === 200 && Array.isArray(res.body)) {
  //       setProviders(res.body || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching providers:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Box
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "20px",

        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        width: "800px",
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
        padding: 2,
        boxShadow: 2,
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            sx={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="country-select-id">Country</InputLabel>
              <Select
                labelId="country-select-id"
                id="country-select-id"
                value={country}
                label="Country"
                onChange={(e: SelectChangeEvent) => {
                  setCountry(e.target.value);
                }}
              >
                <MenuItem value={"RU"}>Russia</MenuItem>
                <MenuItem value={"UA"}>Ukraine</MenuItem>
                <MenuItem value={"BY"}>Belarus</MenuItem>
                <MenuItem value={"KZ"}>Kazakhstan</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="search-type-select-id">Parameters</InputLabel>
              <Select
                labelId="search-type-select-id"
                id="search-type-select-id"
                value={searchType}
                label="Search type"
                onChange={(e: SelectChangeEvent) => {
                  setSearchType(e.target.value);
                }}
              >
                <MenuItem value={"name"}>Full name</MenuItem>
                <MenuItem value={"phone"}>Phone</MenuItem>
                <MenuItem value={"email"}>Email</MenuItem>
                <MenuItem value={"pasport"}>Passport</MenuItem>
                <MenuItem value={"inn"}>INN</MenuItem>
                <MenuItem value={"snils"}>Snils</MenuItem>
                <MenuItem value={"address"}>Address</MenuItem>
                <MenuItem value={"auto"}>Auto</MenuItem>
                <MenuItem value={"ogrn"}>OGRN</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "80%",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              value={fts}
              onChange={handleInputChange}
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={handleSearch}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          {providers.length ? (
            <Box
              sx={{
                marginTop: "10px",
                display: "flex",
                overflowX: "auto",
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
                    socketMessages={props.socketMessages}
                  />
                );
              })}
            </Box>
          ) : (
            ""
          )}
        </>
      )}
    </Box>
  );
}
