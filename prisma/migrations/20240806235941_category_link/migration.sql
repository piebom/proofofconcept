/*
  Warnings:

  - You are about to drop the column `Category` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "Category";

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_id_fkey" FOREIGN KEY ("id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
