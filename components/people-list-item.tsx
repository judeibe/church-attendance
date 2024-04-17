import { cn } from "@/lib/utils";

interface PersonListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  fullName: string;
  age: "adult" | "child";
}

export function PeopleListItem({
  fullName,
  age,
  className,
  ...props
}: PersonListItemProps) {
  return (
    <article
      key={fullName}
      className="flex items-start space-x-6 px-6 py-4 hover:bg-gray-50"
    >
      <div
        className={cn(
          "flex flex-wrap items-center text-sm font-medium leading-6",
          className,
        )}
        {...props}
      >
        <h2 className="font-semibold">{fullName}</h2>
        <svg
          width="2"
          height="2"
          fill="currentColor"
          className="mx-2 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="1" cy="1" r="1" />
        </svg>
        <p className="text-gray-500">{age}</p>
      </div>
    </article>
  );
}
