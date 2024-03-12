import { Group } from "../types/types";

export const GetGroupsResponse = async (): Promise<Group[]> => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(1000);
  const response = await fetch(
    "https://raw.githubusercontent.com/3all/vkTest/master/groups.json"
  );
  if (response.status === 200) {
    const data = await response.json();
    if (data && data.length > 0) {
      return data;
    } else {
      throw new Error("rezult: 0"); 
    }
  } else {
    throw new Error("Failed to fetch data");
  }
};
