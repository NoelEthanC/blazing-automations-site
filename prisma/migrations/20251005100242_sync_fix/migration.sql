/*
  Warnings:

  - Made the column `updatedAt` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `resource_downloads` ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'mate',
    ADD COLUMN `status` ENUM('PENDING', 'CONFIRMED') NOT NULL DEFAULT 'PENDING',
    MODIFY `expiresAt` DATETIME(3) NULL DEFAULT (current_timestamp() + interval 1 day);

-- AlterTable
ALTER TABLE `users` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `tokenExpiry` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `leads_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `videoUrl` VARCHAR(191) NULL,
    `category` ENUM('TUTORIALS_GUIDES', 'CASE_STUDIES', 'SYSTEM_PROMPTS') NULL DEFAULT 'TUTORIALS_GUIDES',
    `tags` TEXT NULL,
    `featured` BOOLEAN NULL DEFAULT false,
    `published` BOOLEAN NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `readingTime` INTEGER NULL DEFAULT 0,
    `viewsCount` INTEGER NULL DEFAULT 0,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `seoKeywords` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `authorId` VARCHAR(191) NULL,

    UNIQUE INDEX `blog_posts_slug_key`(`slug`),
    INDEX `blog_posts_authorId_fkey`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
