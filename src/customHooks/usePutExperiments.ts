import { useMutation } from "react-query";
import { putData } from "@/services/api";
import { EXPERIMENT_URL } from "@/routes/routes";

const usePutExperiment = () => {
  return useMutation(({ id, data }: { id: string; data: any }) =>
    putData(`${EXPERIMENT_URL}${id}`, data)
  );
};

export default usePutExperiment;
