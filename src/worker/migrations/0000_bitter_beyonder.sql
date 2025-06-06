CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"job_id" integer,
	"resume_path" text,
	"additional_info" text,
	"full_name" text,
	"phone_number" text,
	"phone_verified" boolean DEFAULT false,
	"email_verified" boolean DEFAULT false,
	"primary_city" text,
	"additional_cities" json,
	"work_radius" text,
	"pincode" text,
	"open_to_relocate" boolean DEFAULT false,
	"calling_number" text,
	"age" integer,
	"work_schedule" text,
	"education" text,
	"in_field_experience" text,
	"experience" text,
	"expected_ctc" text,
	"open_to_gig" boolean DEFAULT false,
	"open_to_full_time" boolean DEFAULT false,
	"has_license" boolean DEFAULT false,
	"license_types" json,
	"additional_vehicle" text,
	"additional_vehicle_type" text,
	"commercial_vehicle_type" text,
	"languages" json,
	"pan" text,
	"pancard" text,
	"aadhar" text,
	"aadharcard" text,
	"agree_terms" boolean DEFAULT false,
	"referral_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "candidates_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "influencer_referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"influencer_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"unique_code" text NOT NULL,
	"referral_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "influencers_email_unique" UNIQUE("email"),
	CONSTRAINT "influencers_unique_code_unique" UNIQUE("unique_code")
);
--> statement-breakpoint
ALTER TABLE "influencer_referrals" ADD CONSTRAINT "influencer_referrals_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "influencer_referrals" ADD CONSTRAINT "influencer_referrals_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;