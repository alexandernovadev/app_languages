import { format } from "date-fns";

export const formatDateV1 = (isoString: string) => {
  const date = new Date(isoString);
  return format(date, "MMMM d (EEEE) - yyyy ⏰ hh:mm:ss a");
};
