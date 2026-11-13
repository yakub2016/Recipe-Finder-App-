
import { useCallback, useState } from "react";

 export const usePullToRefresh = (
  fetchData: () => Promise<void>
) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await fetchData();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, refreshing]);

  return {
    refreshing,
    onRefresh,
  };
};


