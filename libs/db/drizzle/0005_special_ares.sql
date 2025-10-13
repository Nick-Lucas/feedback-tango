CREATE TABLE "raw_feedback" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"projectId" uuid NOT NULL,
	"email" text,
	"feedback" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"safetyCheckComplete" timestamp,
	"featureAssociationComplete" timestamp,
	"processingError" text,
	"processedFeedbackId" uuid
);
--> statement-breakpoint
ALTER TABLE "raw_feedback" ADD CONSTRAINT "raw_feedback_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_feedback" ADD CONSTRAINT "raw_feedback_processedFeedbackId_feedback_id_fk" FOREIGN KEY ("processedFeedbackId") REFERENCES "public"."feedback"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "raw_feedback_safety_check_idx" ON "raw_feedback" USING btree ("safetyCheckComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_feature_association_idx" ON "raw_feedback" USING btree ("featureAssociationComplete");--> statement-breakpoint
CREATE INDEX "raw_feedback_project_idx" ON "raw_feedback" USING btree ("projectId");