ALTER TABLE "feedback" RENAME COLUMN "feedback" TO "content";--> statement-breakpoint
ALTER TABLE "raw_feedback_items" RENAME COLUMN "feedback" TO "content";--> statement-breakpoint
ALTER TABLE "raw_feedback" RENAME COLUMN "feedback" TO "content";