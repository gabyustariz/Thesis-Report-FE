import { useQuery } from "react-query";
import { fetchData } from "@/services/api";
import { EXPERIMENT_URL } from "@/routes/routes";
import { DataItemRequest, Request } from "@/types/index";

const fetchExperiments = async (): Promise<DataItemRequest[]> => {
  const data = await fetchData<Request>(EXPERIMENT_URL);
  return data.items;
};

const useGetExperiments = () => {
  return useQuery<DataItemRequest[], Error>("experiments", fetchExperiments);
};

export default useGetExperiments;
