import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default async function PeoplePage() {
  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">People</h1>
        <Button className="size-7 md:size-8 " variant="default" size="icon">
          <Icons.add className="size-5 md:size-6" />
          <span className="sr-only">Add Person</span>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"></div>
    </Fragment>
  );
}
