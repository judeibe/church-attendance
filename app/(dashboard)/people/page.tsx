import { Fragment } from "react";

export default async function PeoplePage() {
  return (
    <Fragment>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">People</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"></div>
    </Fragment>
  );
}
