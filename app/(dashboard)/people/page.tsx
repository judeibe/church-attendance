import { Fragment } from "react";

import { getPeople } from "@/lib/data/people";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { List } from "@/components/list";
import { PeopleListItem } from "@/components/people-list-item";

export default async function PeoplePage() {
  const people = await getPeople();
  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">People</h1>
        <Button className="h-8 gap-1" variant="default" size="sm">
          <Icons.add className="size-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Person
          </span>
        </Button>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <List>
          {people.map((person) => (
            <PeopleListItem fullName={person.fullName} age={person.age} />
          ))}
        </List>
      </div>
    </Fragment>
  );
}
