ALTER TABLE "feedback" ADD COLUMN "email" text;--> statement-breakpoint
CREATE INDEX "feedback_projectId_index" ON "feedback" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "feedback_featureId_index" ON "feedback" USING btree ("featureId");--> statement-breakpoint
CREATE INDEX "feedback_sentiment_index" ON "feedback" USING btree ("sentiment");--> statement-breakpoint
CREATE INDEX "feedback_rawFeedbackItemId_index" ON "feedback" USING btree ("rawFeedbackItemId");