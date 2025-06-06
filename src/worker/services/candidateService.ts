import { eq, desc } from 'drizzle-orm';
import { createDB } from '../db';
import { 
  candidatesTable, 
  influencersTable, 
  influencerReferralsTable,
  InsertCandidate, 
  SelectCandidate 
} from '../schema';

export class CandidateService {
  private db;

  constructor(databaseUrl: string) {
    this.db = createDB(databaseUrl);
  }

  async create(candidateData: InsertCandidate) {
    const [candidate] = await this.db.insert(candidatesTable).values(candidateData).returning();
    return candidate;
  }

  async findByPhone(phone: string): Promise<SelectCandidate | undefined> {
    const [candidate] = await this.db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.phone, phone))
      .limit(1);
    return candidate;
  }

  async findByEmail(email: string): Promise<SelectCandidate | undefined> {
    const [candidate] = await this.db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.email, email))
      .limit(1);
    return candidate;
  }

  async findByAadhar(aadhar: string): Promise<SelectCandidate | undefined> {
    const [candidate] = await this.db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.aadhar, aadhar))
      .limit(1);
    return candidate;
  }

  async findById(id: number): Promise<SelectCandidate | undefined> {
    const [candidate] = await this.db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, id))
      .limit(1);
    return candidate;
  }

  async update(id: number, updateData: Partial<InsertCandidate>): Promise<SelectCandidate> {
    const [candidate] = await this.db
      .update(candidatesTable)
      .set(updateData)
      .where(eq(candidatesTable.id, id))
      .returning();
    return candidate;
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(candidatesTable)
      .where(eq(candidatesTable.id, id));
  }

  async getAll(): Promise<SelectCandidate[]> {
    return await this.db
      .select()
      .from(candidatesTable)
      .orderBy(desc(candidatesTable.created_at));
  }

  async getByReferralCode(referralCode: string): Promise<SelectCandidate[]> {
    return await this.db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.referral_code, referralCode));
  }

  async createWithReferral(candidateData: InsertCandidate, influencerCode?: string) {
    return await this.db.transaction(async (tx) => {
      // Insert the candidate
      const [candidate] = await tx.insert(candidatesTable).values(candidateData).returning();
      
      // If there's an influencer code, create the referral relationship
      if (influencerCode) {
        // Find the influencer by code
        const [influencer] = await tx
          .select()
          .from(influencersTable)
          .where(eq(influencersTable.unique_code, influencerCode))
          .limit(1);
        
        if (influencer) {
          // Insert into the junction table
          await tx.insert(influencerReferralsTable).values({
            influencer_id: influencer.id,
            candidate_id: candidate.id,
          });
          
          // Update the referral count
          await tx
            .update(influencersTable)
            .set({ referral_count: (influencer.referral_count || 0) + 1 })
            .where(eq(influencersTable.id, influencer.id));
        }
      }
      
      return candidate;
    });
  }
} 