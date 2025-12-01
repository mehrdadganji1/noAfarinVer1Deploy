import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import MemberProfile from '../models/MemberProfile';

/**
 * @route   POST /api/seed/member-profiles
 * @desc    Create MemberProfiles for existing club members
 * @access  Admin
 */
export const seedMemberProfiles = async (req: Request, res: Response) => {
  try {
    console.log('🌱 Starting MemberProfile seeding...');

    // Find all club members
    const clubMembers = await User.find({
      role: { $in: [UserRole.CLUB_MEMBER] }
    });

    console.log(`📊 Found ${clubMembers.length} club members`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of clubMembers) {
      try {
        // Check if profile already exists
        const existingProfile = await MemberProfile.findOne({ userId: user._id });
        
        if (existingProfile) {
          console.log(`⏭️  Skipping ${user.email} - profile already exists`);
          skipped++;
          continue;
        }

        // Create new profile
        await MemberProfile.create({
          userId: user._id,
          bio: `عضو باشگاه نوآفرینان از ${user.membershipInfo?.memberSince?.toLocaleDateString('fa-IR') || 'تاریخ نامشخص'}`,
          headline: 'عضو باشگاه نوآفرینان',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          telegram: '',
          skills: [],
          interests: [],
          languages: [{ name: 'فارسی', proficiency: 'native' }],
          availability: {
            status: 'available',
            lookingFor: [],
            preferredRoles: []
          },
          visibility: {
            profile: 'public',
            email: false,
            phone: false,
            projects: true,
            achievements: true,
            skills: true
          },
          stats: {
            profileViews: 0,
            connectionsCount: 0,
            endorsementsReceived: 0,
            lastActiveAt: new Date()
          },
          featuredProjects: [],
          featuredAchievements: []
        });

        console.log(`✅ Created profile for ${user.email}`);
        created++;
      } catch (error) {
        console.error(`❌ Error creating profile for ${user.email}:`, error);
        errors++;
      }
    }

    console.log('🎉 Seeding complete!');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);

    res.status(200).json({
      success: true,
      message: 'Member profiles seeded successfully',
      data: {
        total: clubMembers.length,
        created,
        skipped,
        errors
      }
    });
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed member profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
