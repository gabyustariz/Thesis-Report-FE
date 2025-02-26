import { useMutation, UseMutationResult } from "react-query";
import { postData } from "../services/api";

const usePostData = <T>(
  url: string,
  data: Record<string, any>
): UseMutationResult<T> => {
  return useMutation(() => postData<T>(url, data));
};

export default usePostData;
