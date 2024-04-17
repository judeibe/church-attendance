import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { List } from "@/components/list";
import { PeopleListItem } from "@/components/people-list-item";

// List of 50 people
const people: { fullName: string; age: "adult" | "child" }[] = Array.from(
  { length: 50 },
  (_, i) => ({
    fullName: `Person ${i + 1}`,
    age: i % 2 === 0 ? "adult" : "child",
  }),
);

export default async function PeoplePage() {
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
