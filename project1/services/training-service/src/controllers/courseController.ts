import { Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';

export const getAllCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, level, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (category) query.category = category;
    if (level) query.level = level;

    const courses = await Course.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate('instructor.user', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: {
        courses,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: 'Error fetching courses' });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor.user', 'firstName lastName')
      .populate('enrolledStudents.user', 'firstName lastName')
      .populate('reviews.user', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');
      
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }
    
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, error: 'Error fetching course' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseData = {
      ...req.body,
      createdBy: req.user!.id,
      'instructor.user': req.user!.id,
      studentsCount: 0,
    };

    const course = await Course.create(courseData);
    
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, error: 'Error creating course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    // Check if user is instructor or admin
    const isInstructor = course.instructor.user.toString() === req.user!.id;
    if (!isInstructor && !req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, error: 'Error updating course' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    const isInstructor = course.instructor.user.toString() === req.user!.id;
    if (!isInstructor && !req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, error: 'Error deleting course' });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    if (course.maxStudents && course.studentsCount >= course.maxStudents) {
      res.status(400).json({ success: false, error: 'Course is full' });
      return;
    }

    const alreadyEnrolled = course.enrolledStudents.some(
      (student: any) => student.user.toString() === req.user!.id
    );
    
    if (alreadyEnrolled) {
      res.status(400).json({ success: false, error: 'Already enrolled' });
      return;
    }

    course.enrolledStudents.push({
      user: req.user!.id,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
    } as any);
    
    await course.save(); // This will trigger pre-save hook to update studentsCount
    
    res.json({ success: true, message: 'Enrolled successfully', data: course });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ success: false, error: 'Error enrolling in course' });
  }
};

export const dropCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    const enrollment = course.enrolledStudents.find(
      (student: any) => student.user.toString() === req.user!.id
    );
    
    if (!enrollment) {
      res.status(400).json({ success: false, error: 'Not enrolled' });
      return;
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (student: any) => student.user.toString() !== req.user!.id
    );
    
    await course.save();
    
    res.json({ success: true, message: 'Dropped course successfully' });
  } catch (error) {
    console.error('Drop course error:', error);
    res.status(500).json({ success: false, error: 'Error dropping course' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonIndex } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    const enrollment = course.enrolledStudents.find(
      (student: any) => student.user.toString() === req.user!.id
    );
    
    if (!enrollment) {
      res.status(400).json({ success: false, error: 'Not enrolled' });
      return;
    }

    // Add lesson to completed if not already there
    if (!enrollment.completedLessons.includes(lessonIndex)) {
      enrollment.completedLessons.push(lessonIndex);
    }
    
    // Calculate progress
    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / course.lessons.length) * 100
    );
    
    await course.save();
    
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: 'Error updating progress' });
  }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    // Check if user is enrolled
    const isEnrolled = course.enrolledStudents.some(
      (student: any) => student.user.toString() === req.user!.id
    );
    
    if (!isEnrolled) {
      res.status(400).json({ success: false, error: 'Must be enrolled to review' });
      return;
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      (review: any) => review.user.toString() === req.user!.id
    );
    
    if (existingReview) {
      res.status(400).json({ success: false, error: 'Already reviewed' });
      return;
    }

    course.reviews.push({
      user: req.user!.id,
      rating,
      comment,
      createdAt: new Date(),
    } as any);
    
    await course.save(); // This will trigger pre-save hook to update rating
    
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, error: 'Error adding review' });
  }
};

export const getCourseStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalCourses = await Course.countDocuments();
    const beginnerCourses = await Course.countDocuments({ level: 'beginner' });
    const intermediateCourses = await Course.countDocuments({ level: 'intermediate' });
    const advancedCourses = await Course.countDocuments({ level: 'advanced' });
    
    // Get user's enrolled courses (only if authenticated)
    let userEnrolled = 0;
    let userCompleted = 0;
    
    if (req.user?.id) {
      userEnrolled = await Course.countDocuments({
        'enrolledStudents.user': req.user.id
      });
      
      userCompleted = await Course.countDocuments({
        'enrolledStudents.user': req.user.id,
        'enrolledStudents.progress': 100
      });
    }

    res.json({
      success: true,
      data: {
        total: totalCourses,
        beginner: beginnerCourses,
        intermediate: intermediateCourses,
        advanced: advancedCourses,
        userEnrolled,
        userCompleted,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'Error fetching course stats' });
  }
};
