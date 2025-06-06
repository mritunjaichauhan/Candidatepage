import { integer, pgTable, serial, text, timestamp, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const candidatesTable = pgTable('candidates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  job_id: integer('job_id'),
  resume_path: text('resume_path'),
  additional_info: text('additional_info'),
  
  // Step 1 fields
  full_name: text('full_name'),
  phone_number: text('phone_number'),
  phone_verified: boolean('phone_verified').default(false),
  email_verified: boolean('email_verified').default(false),
  primary_city: text('primary_city'),
  additional_cities: json('additional_cities'),
  work_radius: text('work_radius'),
  pincode: text('pincode'),
  open_to_relocate: boolean('open_to_relocate').default(false),
  calling_number: text('calling_number'),
  
  // Step 2 fields
  age: integer('age'),
  work_schedule: text('work_schedule'),
  education: text('education'),
  in_field_experience: text('in_field_experience'),
  experience: text('experience'),
  expected_ctc: text('expected_ctc'),
  open_to_gig: boolean('open_to_gig').default(false),
  open_to_full_time: boolean('open_to_full_time').default(false),
  has_license: boolean('has_license').default(false),
  license_types: json('license_types'),
  additional_vehicle: text('additional_vehicle'),
  additional_vehicle_type: text('additional_vehicle_type'),
  commercial_vehicle_type: text('commercial_vehicle_type'),
  
  // Step 3 fields
  languages: json('languages'),
  pan: text('pan'),
  pancard: text('pancard'),
  aadhar: text('aadhar'),
  aadharcard: text('aadharcard'),
  agree_terms: boolean('agree_terms').default(false),
  
  // Referral
  referral_code: text('referral_code'),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const influencersTable = pgTable('influencers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  unique_code: text('unique_code').notNull().unique(),
  referral_count: integer('referral_count').default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const influencerReferralsTable = pgTable('influencer_referrals', {
  id: serial('id').primaryKey(),
  influencer_id: integer('influencer_id')
    .notNull()
    .references(() => influencersTable.id, { onDelete: 'cascade' }),
  candidate_id: integer('candidate_id')
    .notNull()
    .references(() => candidatesTable.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const candidatesRelations = relations(candidatesTable, ({ many }) => ({
  referrals: many(influencerReferralsTable),
}));

export const influencersRelations = relations(influencersTable, ({ many }) => ({
  referrals: many(influencerReferralsTable),
}));

export const influencerReferralsRelations = relations(influencerReferralsTable, ({ one }) => ({
  influencer: one(influencersTable, {
    fields: [influencerReferralsTable.influencer_id],
    references: [influencersTable.id],
  }),
  candidate: one(candidatesTable, {
    fields: [influencerReferralsTable.candidate_id],
    references: [candidatesTable.id],
  }),
}));

// Types
export type InsertCandidate = typeof candidatesTable.$inferInsert;
export type SelectCandidate = typeof candidatesTable.$inferSelect;

export type InsertInfluencer = typeof influencersTable.$inferInsert;
export type SelectInfluencer = typeof influencersTable.$inferSelect;

export type InsertInfluencerReferral = typeof influencerReferralsTable.$inferInsert;
export type SelectInfluencerReferral = typeof influencerReferralsTable.$inferSelect; 