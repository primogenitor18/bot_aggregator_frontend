import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { ISearchResult } from './interfaces';

interface ISearchResultProps {
  data: ISearchResult;
}

export function SearchResult(props: ISearchResultProps) {
  return (
    <Box sx={{ minWidth: 275, maxWidth: 400 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            {props.data.providerName}
          </Typography>
          {props.data.data.map((sr) => {
            return (
              <>
                {Object.keys(sr).map((k: string) => {
                  return (
                    <Typography key={`result-key-${k}`} variant="body2">
                      {k}: {sr[k].toString()}
                    </Typography>
                  )
                })}
              </>
            )
          })}
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  )
}
