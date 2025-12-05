import { Request, Response } from 'express';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت پروفایل'
    });
  }
};

// Update basic profile info
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی پروفایل'
    });
  }
};

// Get profile completion percentage
export const getProfileCompletion = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    let completion = 0;
    const totalFields = 10;

    // Basic info (4 fields)
    if (user.firstName) completion++;
    if (user.lastName) completion++;
    if (user.phoneNumber) completion++;
    if (user.bio && user.bio.length > 20) completion++;

    // Education (1 field)
    if (user.educationHistory && user.educationHistory.length > 0) completion++;

    // Experience (1 field)
    if (user.workExperience && user.workExperience.length > 0) completion++;

    // Skills (1 field)
    if (user.skills && user.skills.length >= 3) completion++;

    // Certifications (1 field)
    if (user.certifications && user.certifications.length > 0) completion++;

    // Social links (1 field)
    if (user.socialLinks && (user.socialLinks.linkedin || user.socialLinks.github)) completion++;

    // Avatar (1 field)
    if (user.avatar) completion++;

    const percentage = Math.round((completion / totalFields) * 100);

    res.json({
      success: true,
      data: {
        completion: percentage,
        completedFields: completion,
        totalFields
      }
    });
  } catch (error: any) {
    console.error('Error getting profile completion:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در محاسبه تکمیل پروفایل'
    });
  }
};

// ==================== EDUCATION ====================

export const addEducation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const education = req.body;

    console.log('📚 Adding education:', { userId, education });

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (!user.educationHistory) {
      user.educationHistory = [];
    }

    // Convert date strings to Date objects with validation
    try {
      if (education.startDate) {
        const startDate = new Date(education.startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error('تاریخ شروع نامعتبر است');
        }
        education.startDate = startDate;
      }
      if (education.endDate) {
        const endDate = new Date(education.endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error('تاریخ پایان نامعتبر است');
        }
        education.endDate = endDate;
      }
    } catch (dateError: any) {
      console.error('❌ Date conversion error:', dateError);
      return res.status(400).json({
        success: false,
        error: dateError.message || 'فرمت تاریخ نامعتبر است'
      });
    }

    user.educationHistory.push(education);
    await user.save();

    console.log('✅ Education added successfully');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('❌ Error adding education:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'خطا در افزودن سابقه تحصیلی',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { userId, eduId } = req.params;
    const updates = req.body;

    console.log('📝 Updating education:', { userId, eduId, updates });

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    const eduIndex = user.educationHistory?.findIndex(
      (edu: any) => edu._id?.toString() === eduId
    );

    if (eduIndex === -1 || eduIndex === undefined) {
      console.error('❌ Education not found:', eduId);
      return res.status(404).json({
        success: false,
        error: 'سابقه تحصیلی یافت نشد'
      });
    }

    // Convert date strings to Date objects with validation
    try {
      if (updates.startDate) {
        const startDate = new Date(updates.startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error('تاریخ شروع نامعتبر است');
        }
        updates.startDate = startDate;
      }
      if (updates.endDate) {
        const endDate = new Date(updates.endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error('تاریخ پایان نامعتبر است');
        }
        updates.endDate = endDate;
      }
    } catch (dateError: any) {
      console.error('❌ Date conversion error:', dateError);
      return res.status(400).json({
        success: false,
        error: dateError.message || 'فرمت تاریخ نامعتبر است'
      });
    }

    if (user.educationHistory) {
      user.educationHistory[eduIndex] = {
        ...user.educationHistory[eduIndex],
        ...updates
      };
      await user.save();
    }

    console.log('✅ Education updated successfully');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('❌ Error updating education:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی سابقه تحصیلی',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { userId, eduId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (user.educationHistory) {
      user.educationHistory = user.educationHistory.filter(
        (edu: any) => edu._id?.toString() !== eduId
      );
      await user.save();
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error deleting education:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف سابقه تحصیلی'
    });
  }
};

// ==================== WORK EXPERIENCE ====================

export const addExperience = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const experience = req.body;

    console.log('💼 Adding experience:', { userId, experience });

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (!user.workExperience) {
      user.workExperience = [];
    }

    // Convert date strings to Date objects with validation
    try {
      if (experience.startDate) {
        const startDate = new Date(experience.startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error('تاریخ شروع نامعتبر است');
        }
        experience.startDate = startDate;
      }
      if (experience.endDate) {
        const endDate = new Date(experience.endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error('تاریخ پایان نامعتبر است');
        }
        experience.endDate = endDate;
      }
    } catch (dateError: any) {
      console.error('❌ Date conversion error:', dateError);
      return res.status(400).json({
        success: false,
        error: dateError.message || 'فرمت تاریخ نامعتبر است'
      });
    }

    user.workExperience.push(experience);
    await user.save();

    console.log('✅ Experience added successfully');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('❌ Error adding experience:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'خطا در افزودن سابقه کاری',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { userId, expId } = req.params;
    const updates = req.body;

    console.log('📝 Updating experience:', { userId, expId, updates });

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    const expIndex = user.workExperience?.findIndex(
      (exp: any) => exp._id?.toString() === expId
    );

    if (expIndex === -1 || expIndex === undefined) {
      console.error('❌ Experience not found:', expId);
      return res.status(404).json({
        success: false,
        error: 'سابقه کاری یافت نشد'
      });
    }

    // Convert date strings to Date objects with validation
    try {
      if (updates.startDate) {
        const startDate = new Date(updates.startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error('تاریخ شروع نامعتبر است');
        }
        updates.startDate = startDate;
      }
      if (updates.endDate) {
        const endDate = new Date(updates.endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error('تاریخ پایان نامعتبر است');
        }
        updates.endDate = endDate;
      }
    } catch (dateError: any) {
      console.error('❌ Date conversion error:', dateError);
      return res.status(400).json({
        success: false,
        error: dateError.message || 'فرمت تاریخ نامعتبر است'
      });
    }

    if (user.workExperience) {
      user.workExperience[expIndex] = {
        ...user.workExperience[expIndex],
        ...updates
      };
      await user.save();
    }

    console.log('✅ Experience updated successfully');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('❌ Error updating experience:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی سابقه کاری',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { userId, expId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (user.workExperience) {
      user.workExperience = user.workExperience.filter(
        (exp: any) => exp._id?.toString() !== expId
      );
      await user.save();
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف سابقه کاری'
    });
  }
};

// ==================== SKILLS ====================

export const addSkill = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const skill = req.body;

    console.log('🎯 Adding skill:', { userId, skill });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (!user.skills) {
      user.skills = [];
    }

    // Map frontend 'proficiency' to backend 'level'
    const skillToAdd = {
      name: skill.name,
      category: skill.category,
      level: skill.proficiency || skill.level || 'beginner',
    };

    console.log('📝 Skill to add:', skillToAdd);

    user.skills.push(skillToAdd as any);
    await user.save();

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error adding skill:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در افزودن مهارت'
    });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { userId, skillId } = req.params;
    const updates = req.body;

    console.log('📝 Updating skill:', { userId, skillId, updates });

    // Remove _id from updates to prevent conflicts
    const { _id, ...skillUpdates } = updates;

    // Map frontend 'proficiency' to backend 'level'
    const levelValue = skillUpdates.proficiency || skillUpdates.level || 'beginner';

    console.log('🔄 Mapped level:', levelValue);

    // Use atomic update with positional operator
    const user = await User.findOneAndUpdate(
      { _id: userId, 'skills._id': skillId },
      { 
        $set: { 
          'skills.$.name': skillUpdates.name,
          'skills.$.category': skillUpdates.category,
          'skills.$.level': levelValue
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.error('❌ User or skill not found');
      return res.status(404).json({
        success: false,
        error: 'کاربر یا مهارت یافت نشد'
      });
    }

    console.log('✅ Skill updated successfully');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('❌ Error updating skill:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی مهارت'
    });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { userId, skillId } = req.params;

    console.log('🗑️ Deleting skill:', { userId, skillId });

    // Use atomic update with $pull operator
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: { _id: skillId } } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.error('❌ User not found');
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    console.log('✅ Skill deleted successfully');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('❌ Error deleting skill:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف مهارت'
    });
  }
};

// ==================== CERTIFICATIONS ====================

export const addCertification = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const certification = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (!user.certifications) {
      user.certifications = [];
    }

    user.certifications.push(certification);
    await user.save();

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error adding certification:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در افزودن گواهینامه'
    });
  }
};

export const deleteCertification = async (req: Request, res: Response) => {
  try {
    const { userId, certId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    if (user.certifications) {
      user.certifications = user.certifications.filter(
        (cert: any) => cert._id?.toString() !== certId
      );
      await user.save();
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error deleting certification:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف گواهینامه'
    });
  }
};

// ==================== SOCIAL LINKS ====================

export const updateSocialLinks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { socialLinks } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { socialLinks } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error updating social links:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی لینک‌های اجتماعی'
    });
  }
};

// ==================== AVATAR ====================

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    console.log('📸 Avatar upload request:', {
      userId,
      hasFile: !!req.file,
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      contentType: req.headers['content-type']
    });

    // Validate userId first
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.error('❌ Invalid userId:', userId);
      return res.status(400).json({
        success: false,
        error: 'شناسه کاربر نامعتبر است'
      });
    }

    let avatarUrl: string;

    // Support both file upload and base64 string
    if (req.file) {
      // File upload via multer
      avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log('✅ File upload detected:', avatarUrl);
    } else if (req.body.avatar) {
      // Base64 string from frontend - save as file instead of storing in DB
      const base64Data = req.body.avatar;
      console.log('✅ Base64 avatar detected, length:', base64Data.length);
      
      // Extract the actual base64 data (remove data:image/xxx;base64, prefix)
      const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        console.error('❌ Invalid base64 format');
        return res.status(400).json({
          success: false,
          error: 'فرمت تصویر نامعتبر است'
        });
      }
      
      const extension = matches[1]; // png, jpg, etc.
      const imageData = matches[2]; // actual base64 data
      
      // Generate unique filename
      const filename = `avatar-${userId}-${Date.now()}.${extension}`;
      const filepath = path.join(uploadsDir, filename);
      
      // Write file to disk
      try {
        fs.writeFileSync(filepath, imageData, 'base64');
        console.log('✅ Avatar saved to file:', filepath);
      } catch (writeError: any) {
        console.error('❌ Error writing file:', writeError);
        return res.status(500).json({
          success: false,
          error: 'خطا در ذخیره فایل تصویر'
        });
      }
      
      // Store only the URL path, not the base64 data
      avatarUrl = `/uploads/avatars/${filename}`;
    } else {
      console.error('❌ No avatar data provided');
      return res.status(400).json({
        success: false,
        error: 'فایل یا داده عکس الزامی است'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar: avatarUrl } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    console.log('✅ Avatar uploaded successfully for user:', user.email);

    res.json({
      success: true,
      message: 'عکس پروفایل با موفقیت آپلود شد',
      data: { 
        user, 
        avatar: avatarUrl 
      }
    });
  } catch (error: any) {
    console.error('❌ Error uploading avatar:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'خطا در آپلود عکس پروفایل',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { avatar: 1 } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Error deleting avatar:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف عکس پروفایل'
    });
  }
};
