import { format } from "date-fns";

export const formatDateV1 = (isoString: string) => {
  try {
    if (!isoString) throw new Error("Invalid date string MD");

    const date = new Date(isoString);
    if (isNaN(date.getTime())) throw new Error("Invalid date format xds");

    return format(date, "MMMM d (EEEE) - yyyy ⏰ hh:mm:ss a");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
