/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `resource_downloads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `resource_downloads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `resource_downloads` ADD COLUMN `expiresAt` DATETIME(3) NULL DEFAULT DATE_ADD(NOW(), INTERVAL 1 DAY),
    ADD COLUMN `token` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `resources` MODIFY `category` ENUM('MAKE_TEMPLATES', 'ZAPIER_TEMPLATES', 'N8N_TEMPLATES', 'AUTOMATION_GUIDES', 'TOOLS_RESOURCES', 'TEMPLATE', 'GUIDE', 'TOOL') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `resource_downloads_token_key` ON `resource_downloads`(`token`);
