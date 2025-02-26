import { useMutation, UseMutationResult } from "react-query";
import { putData } from "../services/api";

const usePutData = <T>(
  url: string,
  data: Record<string, any>
): UseMutationResult<T> => {
  return useMutation(() => putData<T>(url, data));
};

export default usePutData;
