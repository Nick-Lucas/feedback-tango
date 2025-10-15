CREATE TYPE "public"."sentiment_enum" AS ENUM('positive', 'constructive', 'negative');--> statement-breakpoint
ALTER TABLE "raw_feedback" DROP CONSTRAINT "raw_feedback_processedFeedbackId_feedback_id_fk";
--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "rawFeedbackId" uuid;--> statement-breakpoint
ALTER TABLE "raw_feedback" ADD COLUMN "sentimentCheckResult" "sentiment_enum";--> statement-breakpoint
ALTER TABLE "raw_feedback" ADD COLUMN "sentimentCheckComplete" timestamp;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_rawFeedbackId_raw_feedback_id_fk" FOREIGN KEY ("rawFeedbackId") REFERENCES "public"."raw_feedback"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "raw_feedback_sentimentCheckResult_index" ON "raw_feedback" USING btree ("sentimentCheckResult");--> statement-breakpoint
ALTER TABLE "raw_feedback" DROP COLUMN "processedFeedbackId";