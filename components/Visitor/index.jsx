"use client";

import { useEffect, useState } from "react";
import {
  useGetVisitorCount,
  useIncrementVisitorCount,
} from "@/hooks/useAuth";

export default function Visitor() {
  const [visitorCount, setVisitorCount] = useState(0);

  const { data: visitorCountData, isLoading, refetch } = useGetVisitorCount();

  const { mutateAsync: incrementVisitor } = useIncrementVisitorCount();

  useEffect(() => {
    const updateVisitor = async () => {
      try {
        if (visitorCountData?.count !== undefined) {
          setVisitorCount(visitorCountData.count);
        }
        const hasVisited = sessionStorage.getItem("hasVisited");
        if (!hasVisited) {
          const incremented = await incrementVisitor();
          setVisitorCount(incremented.count);

          sessionStorage.setItem("hasVisited", "true");

          await refetch();
        }
      } catch (error) {
        console.error("Error updating visitor count:", error);
      }
    };
    updateVisitor();
  }, [visitorCountData, incrementVisitor, refetch]);

  return (
    <div>
      <h4>Visitors: {isLoading ? "Loading..." : visitorCount}</h4>
    </div>
  );
}
