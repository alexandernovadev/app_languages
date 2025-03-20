import { BACKURL } from "@/api/backurl";

/**
 * @Deprecated
 *
 */
export const incrementSeenWord = async (ID: string) => {
  try {
    const response = await fetch(`${BACKURL}/api/words/${ID}/increment-seen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to increment word seen count: ${response.statusText}`
      );
    }

    console.info("Word seen count incremented successfully");
  } catch (error) {
    console.error("Error incrementing word seen count:", error);
  }
};
