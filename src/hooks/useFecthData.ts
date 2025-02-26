import { useQuery, UseQueryResult } from "react-query";
import { fetchData } from "../services/api";

const useFetchData = <T>(
  url: string,
  params: Record<string, any>
): UseQueryResult<T> => {
  return useQuery(["fetchData", url, params], () => fetchData<T>(url, params));
};

export default useFetchData;
