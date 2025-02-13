import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";

import { BaseApi } from "@/app/api/base";

import { ISearchResult, IProviderSearchResult } from "./interfaces";

import { INameDictMap } from "@/app/types/props";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface ISearchResultProps {
  fts: string;
  search: boolean;
  provider: string;
  searchType: string;
  country: string;
  socketMessages?: INameDictMap;
}

interface IProviderUserInfo {
  queryCountAll: number;
  queryCountApiLimit: number;
}

interface ISearchResultItem {
  sr: any;
}

interface ApiResponse<T = any> {
  status: number;
  body?: T;
}

interface ProviderInfoResponse {
  query_count_all: number;
  query_count_api_limit: number;
}

function SearchResultItem(props: ISearchResultItem) {
  return (
    <>
      {Object.keys(props.sr).map((k: string) => {
        if (
          props.sr[k] !== null &&
          props.sr[k] !== undefined &&
          props.sr[k].toString()
        ) {
          return (
            <Typography key={`result-key-${k}`} variant="body2">
              {k}:{" "}
              {k !== "sourceUrl" ? (
                props.sr[k].toString()
              ) : (
                <a href={props.sr[k]} target="_blank" rel="noopener noreferrer">
                  {props.sr[k].toString().length > 30
                    ? props.sr[k].toString().slice(0, 30) + "..."
                    : props.sr[k].toString()}
                </a>
              )}
            </Typography>
          );
        } else {
          return <></>;
        }
      })}
      <Divider sx={{ marginTop: "5px", marginBottom: "5px" }} />
    </>
  );
}

export function SearchResult(props: ISearchResultProps) {
  const [searchData, setSearchData] = React.useState<ISearchResult>({
    providerName: props.provider,
    data: [],
  });
  const [progress, setProgress] = React.useState<boolean>(false);
  const [providerInfo, setProviderInfo] = React.useState<IProviderUserInfo>({
    queryCountAll: 0,
    queryCountApiLimit: 0,
  });
  const [acceptSearch, setAcceptSearch] = React.useState<boolean>(true);

  const [searchStart, setSearchStart] = React.useState<boolean>(false);
  const [inputChange, setInputChange] = React.useState<boolean>(false);

  const [firstLoad, setFirstLoad] = React.useState<boolean>(false);

  // React.useEffect(() => {
  //   getProviderInfo();
  // }, []);

  React.useEffect(() => {
    setFirstLoad(true);
  }, []);

  React.useEffect(() => {
    if (props.fts) {
      setInputChange(true);
      setFirstLoad(false);
    }
    if (props.search) {
      setSearchStart(true);
    }
    if (!acceptSearch || props.fts === "" || !props.search) return;
    getSearchData();
  }, [props.fts, props.search, acceptSearch]);

  const getProviderInfo = async () => {
    const api = new BaseApi(1, "provider/get_info");
    const res: ApiResponse = await api.get(
      { provider: props.provider },
      () => {},
      {}
    );
    if (res.status === 200 && res.body) {
      setProviderInfo({
        queryCountAll: res?.body?.query_count_all,
        queryCountApiLimit: res?.body?.query_count_api_limit,
      });
    }
  };

  const getSearchData = async () => {
    setProgress(true);

    try {
      const api = new BaseApi(1, "search/fts");
      let res: ApiResponse = await api.post(
        {
          fts: props.fts,
          provider: props.provider,
          search_type: props.searchType,
          country: props.country,
        },
        "application/json",
        () => {},
        {}
      );

      if (res.status === 200 && res.body) {
        setSearchData(res?.body);
        await getProviderInfo();
      }
    } catch (error) {
      setSearchStart(false);
      setFirstLoad(false);
      console.error(error);
    } finally {
      setProgress(false);
      setInputChange(false);
    }
  };

  const results: any =
    props.socketMessages?.[props.provider]?.data || searchData.data;

  return (
    <Box
      sx={{
        MaxWidth: "100%",
        display:
          (searchStart && searchData.data.length > 0) ||
          firstLoad ||
          inputChange
            ? "block"
            : "none",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: "block",
          padding: "10px 15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          width: "100%",
        }}
      >
        <CardHeader
          title={
            <Box
              sx={{ display: "flex", justifyContent: "center", padding: "5px" }}
            >
              <Checkbox
                sx={{ alignItems: "center" }}
                defaultChecked
                onChange={(e) => {
                  setAcceptSearch(e.target.checked);
                }}
              />
              <Typography variant="h5">{props.provider}</Typography>
            </Box>
          }
          sx={{ padding: "5px" }}
        />
        <Box>{progress ? <LinearProgress /> : ""}</Box>

        <CardContent sx={{ padding: "5px" }}>
          <Typography sx={{ display: "flex", justifyContent: "center" }}>
            Completed requests: {providerInfo.queryCountAll}
          </Typography>
          <Typography sx={{ display: "flex", justifyContent: "center" }}>
            Remaining requests: {providerInfo.queryCountApiLimit}
          </Typography>
          <Divider sx={{ marginTop: "5px", marginBottom: "5px" }} />

          {results.map((sr: ISearchResultItem, index: number) => (
            <Box
              key={`result-${index}`}
              sx={{
                backgroundColor: "#fff",
                padding: "8px",
                marginBottom: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <SearchResultItem sr={sr} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
