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

function SearchResultItem(props: ISearchResultItem) {
  return (
    <>
      {Object.keys(props.sr).map((k: string) => {
        if (props.sr[k].toString()) {
          return (
            <Typography key={`result-key-${k}`} variant="body2">
              {k}:{" "}
              {k !== "link" ? (
                props.sr[k].toString()
              ) : (
                <a href={props.sr[k].toString()} target="_blank">
                  {props.sr[k].toString()}
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

  React.useEffect(() => {
    getProviderInfo();
  }, []);

  React.useEffect(() => {
    if (!acceptSearch) {
      return;
    }
    if (props.fts === "" || !props.search) {
      return;
    }
    getSearchData();
  }, [props.fts]);

  React.useEffect(() => {
    if (!acceptSearch) {
      return;
    }
    if (props.fts === "" || !props.search) {
      return;
    }
    getSearchData();
  }, [props.search]);

  const getProviderInfo = async () => {
    const api = new BaseApi(1, "provider/get_info");
    let res = await api.get({ provider: props.provider }, () => {}, {});
    if (res.status === 200) {
      setProviderInfo({
        queryCountAll: res?.body?.query_count_all,
        queryCountApiLimit: res?.body?.query_count_api_limit,
      });
    }
  };

  const getSearchData = async () => {
    setProgress(true);
    const api = new BaseApi(1, "search/fts");
    let res = await api.post(
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
    if (res.status === 200) {
      setSearchData(res?.body);
      await getProviderInfo();
    }
    setProgress(false);
  };

  return (
    <Box sx={{ minWidth: 275, maxWidth: 400 }}>
      <Card variant="outlined">
        <CardHeader
          title={
            <Box sx={{ display: "flex" }}>
              <Checkbox
                defaultChecked
                onChange={(e) => {
                  setAcceptSearch(e.target.checked);
                }}
              />
              <Typography variant="h5">{props.provider}</Typography>
            </Box>
          }
        />
        <Box>{progress ? <LinearProgress /> : ""}</Box>
        <CardContent>
          <Typography>
            Completed requests: {providerInfo.queryCountAll}
          </Typography>
          <Typography>
            Remaining requests: {providerInfo.queryCountApiLimit}
          </Typography>
          <Divider sx={{ marginTop: "5px", marginBottom: "5px" }} />
          {props.socketMessages && props.socketMessages[props.provider] ? (
            <>
              {props.socketMessages[props.provider].data?.map((sr, index) => {
                return (
                  <SearchResultItem
                    sr={sr}
                    key={`search-result-for-provider-${index}-socket`}
                  />
                );
              })}
            </>
          ) : (
            <>
              {searchData.data?.map((sr, index) => {
                return (
                  <SearchResultItem
                    sr={sr}
                    key={`search-result-for-provider-${index}`}
                  />
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
