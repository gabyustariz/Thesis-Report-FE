import { useMutation, UseMutationResult } from "react-query";
import { patchData } from "../services/api";

const usePatchData = <T>(
  url: string,
  data: Record<string, any>
): UseMutationResult<T> => {
  return useMutation(() => patchData<T>(url, data));
};

export default usePatchData;
