import React, { Suspense } from "react";
import TripsClient from "./TripsClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <TripsClient />
    </Suspense>
  );
}
