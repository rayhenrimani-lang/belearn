import type { Theme, Course, Lesson } from './api';
import {
  fetchThemes,
  fetchCourses,
  fetchCoursesByTheme,
  fetchCourseById,
  fetchLessonsByCourse,
  fetchLessonById,
} from './api';

export type { Theme, Course, Lesson };

/**
 * Legacy facade — delegates to `api.ts` (Hydra + normalization).
 */
class LearningApiService {
  async getThemes(): Promise<Theme[]> {
    return fetchThemes();
  }

  async getCourses(): Promise<Course[]> {
    return fetchCourses();
  }

  async getCoursesByTheme(themeId: number): Promise<Course[]> {
    return fetchCoursesByTheme(themeId);
  }

  async getCourse(courseId: number): Promise<Course> {
    return fetchCourseById(courseId);
  }

  async getLessons(courseId: number): Promise<Lesson[]> {
    return fetchLessonsByCourse(courseId);
  }

  async getLesson(lessonId: number): Promise<Lesson> {
    return fetchLessonById(lessonId);
  }
}

export const learningApi = new LearningApiService();

export const getThemes = () => learningApi.getThemes();
export const getCourses = () => learningApi.getCourses();
export const getCoursesByTheme = (themeId: number) => learningApi.getCoursesByTheme(themeId);
export const getCourse = (courseId: number) => learningApi.getCourse(courseId);
export const getLessons = (courseId: number) => learningApi.getLessons(courseId);
export const getLesson = (lessonId: number) => learningApi.getLesson(lessonId);
