CREATE TABLE `memory` (
	`id` text PRIMARY KEY NOT NULL,
	`memory_lane_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`image` text NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`memory_lane_id`) REFERENCES `memory_lane`(`id`) ON UPDATE no action ON DELETE cascade
);
