import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { defaultData } from "./exampleLinkook";
import Link from "next/link";

interface ISearchResultProps {
  fts: string;
  search: boolean;
}

export function SearchById(props: ISearchResultProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLinkookData = async (username: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/linkook?username=${username}`);

      if (!response.ok) {
        throw new Error("Error fetching Linkook data");
      }

      const result = await response.json();
      setData(result ?? defaultData);
    } catch (err) {
      toast.error("Error fetching Linkook data:");
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.search && props.fts) {
      getLinkookData(props.fts);
    }
  }, [props.fts, props.search]);

  return (
    <Box>
      {loading ? (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : data ? (
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Search Results for {data?.username ?? "Unknown"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Accounts found: {data?.accounts_found ?? 0} on{" "}
              {data?.sites_found ?? 0} sites
            </Typography>

            {data.related_usernames?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1">Related Usernames:</Typography>
                <List>
                  {data.related_usernames.map(
                    (username: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemText primary={username} />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            )}

            {data.related_emails?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1">Related Emails:</Typography>
                <List>
                  {data.related_emails.map((email: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={email} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {data.breached_emails?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1" color="error">
                  Breached Emails:
                </Typography>
                <List>
                  {data.breached_emails.map((email: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={email} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {data.found_accounts &&
              Object.keys(data.found_accounts).length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1">
                    Discovered Accounts:
                  </Typography>
                  <List>
                    {Object.entries(data.found_accounts).map(
                      ([platform, links]: [string, any], index: number) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={platform}
                            secondary={
                              Array.isArray(links) ? (
                                links.map((link, idx) => (
                                  <Typography
                                    key={idx}
                                    component="a"
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      display: "block",
                                      color: "primary.main",
                                    }}
                                  >
                                    {link}
                                  </Typography>
                                ))
                              ) : (
                                <Typography
                                  component="a"
                                  href={links}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ color: "primary.main" }}
                                >
                                  {links}
                                </Typography>
                              )
                            }
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
              )}
          </CardContent>
        </Card>
      ) : null}
    </Box>
  );
}
