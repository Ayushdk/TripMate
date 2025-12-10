import React, { Suspense } from "react";
import BookingsClient from "./BookingsClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <BookingsClient />
    </Suspense>
  );
}
