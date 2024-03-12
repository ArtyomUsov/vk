import { useEffect, useState } from "react";
import { GetGroupsResponse } from "../api/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Group } from "../types/types";

const GroupList = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [colorFilter, setColorFilter] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("");
  const [entryFilter, setEntryFilter] = useState("");

  const fetchAndSetGroups = async () => {
    const groupList: Group[] = await GetGroupsResponse();
    if (groupList) {
      setGroups(groupList);
      setFilteredGroups(groupList);
    }
  };

  useEffect(() => {
    fetchAndSetGroups();
  }, []);

  const handleColorFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setColorFilter(event.target.value as string);
    filterGroups(event.target.value as string, privacyFilter, entryFilter);
  };

  const handlePrivacyFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPrivacyFilter(event.target.value as string);
    filterGroups(colorFilter, event.target.value as string, entryFilter);
  };

  const handleEntryFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setEntryFilter(event.target.value as string);
    filterGroups(colorFilter, privacyFilter, event.target.value as string);
  };

  const filterGroups = (color: string, privacy: string, entry: string) => {
    let filtered = groups;
    if (color) {
      filtered = filtered.filter((group) => group.avatar_color === color);
    }
    if (privacy) {
      filtered = filtered.filter((group) =>
        privacy === "open" ? !group.closed : group.closed
      );
    }
    if (entry === "withFriends") {
      filtered = filtered.filter(
        (group) => group.friends && group.friends.length > 0
      );
    } else if (entry === "withoutFriends") {
      filtered = filtered.filter(
        (group) => !group.friends || group.friends.length === 0
      );
    }
    setFilteredGroups(filtered);
  };

  const resetFilters = () => {
    setColorFilter("");
    setPrivacyFilter("");
    setEntryFilter("");
    setFilteredGroups(groups);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <FormControl fullWidth>
                  <InputLabel id="color-select-label">цвет группы</InputLabel>
                  <Select
                    labelId="color-select-label"
                    id="color-simple-select"
                    value={colorFilter}
                    label="Color"
                    onChange={handleColorFilterChange}
                  >
                    <MenuItem value="">любой</MenuItem>
                    <MenuItem value="blue">blue</MenuItem>
                    <MenuItem value="orange">orange</MenuItem>
                    <MenuItem value={"red"}>red</MenuItem>
                    <MenuItem value={"yellow"}>yellow</MenuItem>
                    <MenuItem value={"white"}>white</MenuItem>
                    <MenuItem value={"purple"}>purple</MenuItem>
                    <MenuItem value={"green"}>green</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="center">
                <FormControl fullWidth>
                  <InputLabel id="privacy-select-label">группы</InputLabel>
                  <Select
                    labelId="privacy-select-label"
                    id="privacy-simple-select"
                    value={privacyFilter}
                    label="Privacy"
                    onChange={handlePrivacyFilterChange}
                  >
                    <MenuItem value="">все</MenuItem>
                    <MenuItem value="open">открытые</MenuItem>
                    <MenuItem value="closed">закрытые</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="center">
                <FormControl fullWidth>
                  <InputLabel id="entry-select-label">участники</InputLabel>
                  <Select
                    labelId="entry-select-label"
                    id="entry-simple-select"
                    value={entryFilter}
                    label="Entry"
                    onChange={handleEntryFilterChange}
                  >
                    <MenuItem value="all">все</MenuItem>
                    <MenuItem value="withFriends">с друзьями</MenuItem>
                    <MenuItem value="withoutFriends">без друзей</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="success"
                  onClick={resetFilters}
                >
                  сброс
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGroups.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">
                  {" "}
                  <Avatar
                    sx={{
                      bgcolor: item.avatar_color,
                      width: 100,
                      height: 100,
                      color: "black",
                      border: 1,
                    }}
                    alt={item.name}
                  >
                    {item.name}
                  </Avatar>
                </TableCell>
                <TableCell align="center">
                  группа:
                  {item.closed ? "закрытая" : "открытая"}
                </TableCell>
                <TableCell align="center">
                  подписчиков: {item.members_count}
                </TableCell>
                <TableCell align="center">
                  <Accordion>
                    <AccordionSummary
                      disabled={!item.friends || item.friends.length === 0}
                    >
                      друзей в группе:{item.friends ? item.friends.length : "0"}
                    </AccordionSummary>
                    {item.friends &&
                      item.friends.length > 0 &&
                      item.friends.map((friend) => (
                        <AccordionDetails>
                          {friend.first_name} {friend.last_name}
                        </AccordionDetails>
                      ))}
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupList;
