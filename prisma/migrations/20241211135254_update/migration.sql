/*
  Warnings:

  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Room" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "RoomName" TEXT NOT NULL,
    "RoomOwner" INTEGER NOT NULL,
    CONSTRAINT "Room_RoomOwner_fkey" FOREIGN KEY ("RoomOwner") REFERENCES "User" ("Id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL
);
INSERT INTO "new_User" ("Id", "Name") SELECT "Id", "Name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
