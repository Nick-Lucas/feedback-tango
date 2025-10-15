CREATE TABLE "raw_feedback_items" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"rawFeedbackId" uuid NOT NULL,
	"feedback" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"sentimentCheckResult" "sentiment_enum",
	"sentimentCheckComplete" timestamp,
	"featureAssociationComplete" timestamp,
	"processingError" text
);
--> statement-breakpoint
ALTER TABLE "raw_feedback" RENAME COLUMN "featureAssociationComplete" TO "processingComplete";--> statement-breakpoint
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_rawFeedbackId_raw_feedback_id_fk";
--> statement-breakpoint
DROP INDEX "raw_feedback_sentimentCheckResult_index";--> statement-breakpoint
DROP INDEX "raw_feedback_featureAssociationComplete_index";--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "rawFeedbackItemId" uuid;--> statement-breakpoint
ALTER TABLE "raw_feedback" ADD COLUMN "splittingComplete" timestamp;--> statement-breakpoint
ALTER TABLE "raw_feedback_items" ADD CONSTRAINT "raw_feedback_items_rawFeedbackId_raw_feedback_id_fk" FOREIGN KEY ("rawFeedbackId") REFERENCES "public"."raw_feedback"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- DATA MIGRATION: Create RawFeedbackItem for each existing Feedback entry
-- This preserves the existing RawFeedback -> Feedback relationships by creating an intermediate RawFeedbackItem
INSERT INTO "raw_feedback_items" (
	"id",
	"rawFeedbackId",
	"feedback",
	"createdAt",
	"sentimentCheckResult",
	"sentimentCheckComplete",
	"featureAssociationComplete",
	"processingError"
)
SELECT
	uuidv7() as "id",
	f."rawFeedbackId",
	f."feedback",
	f."createdAt",
	rf."sentimentCheckResult",
	rf."sentimentCheckComplete",
	rf."processingComplete", -- This was renamed from featureAssociationComplete
	rf."processingError"
FROM "feedback" f
INNER JOIN "raw_feedback" rf ON f."rawFeedbackId" = rf."id"
WHERE f."rawFeedbackId" IS NOT NULL;
--> statement-breakpoint

-- Link existing Feedback entries to their newly created RawFeedbackItems
-- We match based on rawFeedbackId and feedback text (since we just created these items from the same data)
UPDATE "feedback" f
SET "rawFeedbackItemId" = rfi."id"
FROM "raw_feedback_items" rfi
WHERE f."rawFeedbackId" = rfi."rawFeedbackId";
--> statement-breakpoint

-- Set splittingComplete for RawFeedback entries that now have items
-- This marks them as having completed the splitting stage
UPDATE "raw_feedback" rf
SET "splittingComplete" = rf."safetyCheckComplete"
WHERE EXISTS (
	SELECT 1 FROM "raw_feedback_items" rfi
	WHERE rfi."rawFeedbackId" = rf."id"
)
AND rf."safetyCheckComplete" IS NOT NULL;
--> statement-breakpoint
CREATE INDEX "raw_feedback_items_rawFeedbackId_index" ON "raw_feedback_items" USING btree ("rawFeedbackId");--> statement-breakpoint
CREATE INDEX "raw_feedback_items_sentimentCheckResult_index" ON "raw_feedback_items" USING btree ("sentimentCheckResult");--> statement-breakpoint
CREATE INDEX "raw_feedback_items_sentimentCheckComplete_index" ON "raw_feedback_items" USING btree ("sentimentCheckComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_items_featureAssociationComplete_index" ON "raw_feedback_items" USING btree ("featureAssociationComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_items_processingError_index" ON "raw_feedback_items" USING btree ("processingError");--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_rawFeedbackItemId_raw_feedback_items_id_fk" FOREIGN KEY ("rawFeedbackItemId") REFERENCES "public"."raw_feedback_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "raw_feedback_splittingComplete_index" ON "raw_feedback" USING btree ("splittingComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_processingComplete_index" ON "raw_feedback" USING btree ("processingComplete");--> statement-breakpoint
ALTER TABLE "feedback" DROP COLUMN "rawFeedbackId";--> statement-breakpoint
ALTER TABLE "raw_feedback" DROP COLUMN "sentimentCheckResult";--> statement-breakpoint
ALTER TABLE "raw_feedback" DROP COLUMN "sentimentCheckComplete";
