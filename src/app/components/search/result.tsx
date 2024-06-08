import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';

import { BaseApi } from '@/app/api/base';

import { ISearchResult, IProviderSearchResult } from './interfaces';

interface ISearchResultProps {
  fts: string
  search: boolean
  provider: string
  searchType: string
  country: string
}

interface IProviderUserInfo {
  queryCountAll: number
  queryCountApiLimit: number
}

export function SearchResult(props: ISearchResultProps) {
  const [searchData, setSearchData] = React.useState<ISearchResult>(
    {
      providerName: props.provider,
      data: [],
    }
  )
  const [progress, setProgress] = React.useState<boolean>(false)
  const [providerInfo, setProviderInfo] = React.useState<IProviderUserInfo>(
    { queryCountAll: 0, queryCountApiLimit: 0 }
  )

  React.useEffect(() => { getProviderInfo() }, [])

  React.useEffect(() => {
    if ( props.fts === '' || !props.search ) { return }
    getSearchData()
  }, [props.fts])

  React.useEffect(() => {
    if ( props.fts === '' || !props.search ) { return }
    getSearchData()
  }, [props.search])

  const getProviderInfo = async () => {
    const api = new BaseApi(1, 'provider/get_info');
    let res = await api.get(
      { provider: props.provider }, () => {}, {}
    );
    if (res.status === 200) {
      setProviderInfo(
        {
          queryCountAll: res?.body?.query_count_all,
          queryCountApiLimit: res?.body?.query_count_api_limit,
        }
      )
    };
  }

  const getSearchData = async () => {
    setProgress(true)
    const api = new BaseApi(1, 'search/fts');
    let res = await api.post(
      {
        fts: props.fts,
        provider: props.provider,
        search_type: props.searchType,
        country: props.country,
      },
      'application/json',
      () => {},
      {},
    );
    if (res.status === 200) {
      setSearchData(res?.body)
      await getProviderInfo()
    };
    setProgress(false)
  }
  
  return (
    <Box sx={{ minWidth: 275, maxWidth: 400 }}>
      <Card variant="outlined">
        <CardHeader title={props.provider} />
        <Box>
          {progress
            ? <LinearProgress />
            : ''
          }
        </Box>
        <CardContent>
          <Typography>Completed requests: {providerInfo.queryCountAll}</Typography>
          <Typography>Remaining requests: {providerInfo.queryCountApiLimit}</Typography>
          <Divider sx={{ marginTop: '5px', marginBottom: '5px' }} />
          {searchData.data?.map((sr) => {
            return (
              <>
                {Object.keys(sr).map((k: string) => {
                  if (sr[k].toString()) {
                    return (
                      <Typography key={`result-key-${k}`} variant="body2">
                        {k}: {(k !== 'link') ? sr[k].toString() : <a href={sr[k].toString()} target="_blank">{sr[k].toString()}</a>}
                      </Typography>
                    )
                  } else {
                    return <></>
                  }
                })}
                <Divider sx={{ marginTop: '5px', marginBottom: '5px' }} />
              </>
            )
          })}
        </CardContent>
      </Card>
    </Box>
  )
}
