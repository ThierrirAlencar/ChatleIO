/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_Name_key" ON "User"("Name");
