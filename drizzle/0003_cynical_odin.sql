CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`pagePath` varchar(255) NOT NULL,
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `praise_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`nickname` varchar(100),
	`userInput` text,
	`themeId` varchar(50) NOT NULL,
	`themeName` varchar(100) NOT NULL,
	`generatedPraise` text NOT NULL,
	`isSaved` boolean NOT NULL DEFAULT false,
	`saveType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `praise_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `theme_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`themeId` varchar(50) NOT NULL,
	`themeName` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `theme_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_nicknames` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`nickname` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_nicknames_id` PRIMARY KEY(`id`)
);
