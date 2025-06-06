import { eq, desc } from 'drizzle-orm';
import { createDB } from '../db';
import { 
  influencersTable, 
  candidatesTable,
  influencerReferralsTable,
  InsertInfluencer, 
  SelectInfluencer,
  SelectCandidate
} from '../schema';

export class InfluencerService {
  private db;

  constructor(databaseUrl: string) {
    this.db = createDB(databaseUrl);
  }

  async create(influencerData: InsertInfluencer): Promise<SelectInfluencer> {
    try {
      // Validate required fields at service level as well
      if (!influencerData.name || !influencerData.email || !influencerData.phone || !influencerData.unique_code) {
        throw new Error('Missing required fields: name, email, phone, and unique_code are required');
      }

      const [influencer] = await this.db.insert(influencersTable).values(influencerData).returning();
      return influencer;
    } catch (error) {
      console.error('Database error in influencer creation:', error);
      
      // Re-throw with more specific error information
      if (error instanceof Error) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
          if (error.message.includes('email')) {
            throw new Error('Email address already exists');
          }
          if (error.message.includes('unique_code')) {
            throw new Error('Unique code already exists');
          }
          throw new Error('Duplicate value constraint violation');
        }
        if (error.message.includes('null value in column')) {
          throw new Error('Required field is missing');
        }
      }
      
      throw error;
    }
  }

  async findByUniqueCode(uniqueCode: string): Promise<SelectInfluencer | undefined> {
    const [influencer] = await this.db
      .select()
      .from(influencersTable)
      .where(eq(influencersTable.unique_code, uniqueCode))
      .limit(1);
    return influencer;
  }

  async findByCode(code: string): Promise<SelectInfluencer | undefined> {
    // Alias for findByUniqueCode for compatibility
    return this.findByUniqueCode(code);
  }

  async findByEmail(email: string): Promise<SelectInfluencer | undefined> {
    const [influencer] = await this.db
      .select()
      .from(influencersTable)
      .where(eq(influencersTable.email, email))
      .limit(1);
    return influencer;
  }

  async findById(id: number): Promise<SelectInfluencer | undefined> {
    const [influencer] = await this.db
      .select()
      .from(influencersTable)
      .where(eq(influencersTable.id, id))
      .limit(1);
    return influencer;
  }

  async update(id: number, updateData: Partial<InsertInfluencer>): Promise<SelectInfluencer> {
    const [influencer] = await this.db
      .update(influencersTable)
      .set(updateData)
      .where(eq(influencersTable.id, id))
      .returning();
    return influencer;
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(influencersTable)
      .where(eq(influencersTable.id, id));
  }

  async getAll(): Promise<SelectInfluencer[]> {
    return await this.db
      .select()
      .from(influencersTable)
      .orderBy(desc(influencersTable.created_at));
  }

  async getReferrals(uniqueCode: string): Promise<SelectCandidate[]> {
    try {
      // First try to get referrals from the influencer_referrals join table
      const result = await this.db
        .select({
          id: candidatesTable.id,
          name: candidatesTable.name,
          email: candidatesTable.email,
          phone: candidatesTable.phone,
          job_id: candidatesTable.job_id,
          resume_path: candidatesTable.resume_path,
          additional_info: candidatesTable.additional_info,
          full_name: candidatesTable.full_name,
          phone_number: candidatesTable.phone_number,
          phone_verified: candidatesTable.phone_verified,
          email_verified: candidatesTable.email_verified,
          primary_city: candidatesTable.primary_city,
          additional_cities: candidatesTable.additional_cities,
          work_radius: candidatesTable.work_radius,
          pincode: candidatesTable.pincode,
          open_to_relocate: candidatesTable.open_to_relocate,
          calling_number: candidatesTable.calling_number,
          age: candidatesTable.age,
          work_schedule: candidatesTable.work_schedule,
          education: candidatesTable.education,
          in_field_experience: candidatesTable.in_field_experience,
          experience: candidatesTable.experience,
          expected_ctc: candidatesTable.expected_ctc,
          open_to_gig: candidatesTable.open_to_gig,
          open_to_full_time: candidatesTable.open_to_full_time,
          has_license: candidatesTable.has_license,
          license_types: candidatesTable.license_types,
          additional_vehicle: candidatesTable.additional_vehicle,
          additional_vehicle_type: candidatesTable.additional_vehicle_type,
          commercial_vehicle_type: candidatesTable.commercial_vehicle_type,
          languages: candidatesTable.languages,
          pan: candidatesTable.pan,
          pancard: candidatesTable.pancard,
          aadhar: candidatesTable.aadhar,
          aadharcard: candidatesTable.aadharcard,
          agree_terms: candidatesTable.agree_terms,
          referral_code: candidatesTable.referral_code,
          created_at: candidatesTable.created_at,
          updated_at: candidatesTable.updated_at,
        })
        .from(candidatesTable)
        .innerJoin(influencerReferralsTable, eq(candidatesTable.id, influencerReferralsTable.candidate_id))
        .innerJoin(influencersTable, eq(influencerReferralsTable.influencer_id, influencersTable.id))
        .where(eq(influencersTable.unique_code, uniqueCode));

      // If no referrals found in the join table, try checking the referral_code column directly
      if (result.length === 0) {
        return await this.db
          .select()
          .from(candidatesTable)
          .where(eq(candidatesTable.referral_code, uniqueCode));
      }
      
      return result;
    } catch (error) {
      console.error('Error getting referrals:', error);
      
      // Fallback to checking referral_code column directly
      try {
        return await this.db
          .select()
          .from(candidatesTable)
          .where(eq(candidatesTable.referral_code, uniqueCode));
      } catch (fallbackError) {
        console.error('Error in fallback referral query:', fallbackError);
        return [];
      }
    }
  }

  async updateReferralCount(uniqueCode: string): Promise<SelectInfluencer | undefined> {
    // First get the current influencer
    const influencer = await this.findByUniqueCode(uniqueCode);
    if (!influencer) return undefined;
    
    const [updatedInfluencer] = await this.db
      .update(influencersTable)
      .set({ referral_count: (influencer.referral_count || 0) + 1 })
      .where(eq(influencersTable.unique_code, uniqueCode))
      .returning();
    return updatedInfluencer;
  }
} 