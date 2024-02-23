import { Button } from "@/components/ui/button";
import { z } from "zod";
import { CalendarIcon } from "@/components/icons/calendar";

export default async function Meetings() {
  const meetings = await getMeetings();

  return (
    <div>
      <div className="flex items-center justify-between space-x-4 py-6">
        <div className="flex gap-2">
          <CalendarIcon className="h-6 w-6" />
          <h2 className="text-lg font-bold tracking-wide">Meetings</h2>
        </div>
        <div className="flex justify-end gap-4">
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm">Add Meeting</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {meetings.map(({ id, date, name, count }) => (
          <div className="rounded-lg border p-4" key={id}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{date.toDateString()}</h3>
                <p>{name}</p>
              </div>
              <div>
                <p>Total Attendees: {count}</p>
                <Button className="mt-2" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getMeetings() {
  const res = await fetch(
    "https://65d8252d27d9a3bc1d7c3d7f.mockapi.io/meetings",
  );

  const meetingSchema = z
    .object({
      id: z.coerce.number(),
      name: z.string(),
      date: z.coerce.date(),
      count: z.coerce.number(),
    })
    .array();

  const result = meetingSchema.safeParse(await res.json());
  if (!result.success) {
    console.log(result.error);
    throw new Error("Failed to fetch meetings");
  }
  return result.data;
}
