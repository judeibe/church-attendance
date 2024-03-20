-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saint" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Saint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MeetingToSaint" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MeetingToSaint_AB_unique" ON "_MeetingToSaint"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetingToSaint_B_index" ON "_MeetingToSaint"("B");

-- AddForeignKey
ALTER TABLE "_MeetingToSaint" ADD CONSTRAINT "_MeetingToSaint_A_fkey" FOREIGN KEY ("A") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingToSaint" ADD CONSTRAINT "_MeetingToSaint_B_fkey" FOREIGN KEY ("B") REFERENCES "Saint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
