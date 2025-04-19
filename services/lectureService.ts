import { BACKURL } from "@/api/backurl";
import { LectureResponse } from "@/store/useLectureStore";
import { getAuthHeaders } from "./utils/headers";

const handleResponse = async (res: Response) => {
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Error in response");
  }
  return data.data;
};

export const lectureService = {
  fetchLectures: async (page = 1, limit = 10): Promise<LectureResponse> => {
    const res = await fetch(
      `${BACKURL}/api/lectures?page=${page}&limit=${limit}`,
      {
        headers: await getAuthHeaders(),
      }
    );
    return await handleResponse(res);
  },
};
