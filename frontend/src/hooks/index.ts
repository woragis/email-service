// Auth hooks
export {
  useMe,
  useRegister,
  useLogin,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  useRequestPasswordReset,
  useResetPassword,
  useVerifyEmail,
  useResendVerification,
  useDeleteAccount,
} from './auth';

// Blog hooks
export {
  useBlogPosts,
  useBlogPost,
  useBlogPostBySlug,
  useBlogCategories,
  useBlogCategory,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
  blogKeys,
} from './blog';

// Course hooks
export {
  useCourses,
  useCourse,
  useCourseWithModules,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useCourseModule,
  useCreateCourseModule,
  useUpdateCourseModule,
  useDeleteCourseModule,
  useCourseChapter,
  useCreateCourseChapter,
  useUpdateCourseChapter,
  useDeleteCourseChapter,
  courseKeys,
} from './course';

// Course Video hooks
export {
  useCourseVideos,
  useCourseVideo,
  useCourseVideoBySlug,
  useCourseVideoWithStats,
  useCreateCourseVideo,
  useUpdateCourseVideo,
  useDeleteCourseVideo,
  useVideoComments,
  useCreateVideoComment,
  useUpdateVideoComment,
  useDeleteVideoComment,
  useLikeVideoComment,
  useUnlikeVideoComment,
  useVideoRating,
  useVideoRatingStats,
  useCreateVideoRating,
  useDeleteVideoRating,
} from './courseVideo';

// Video hooks
export {
  useVideos,
  useVideo,
  useVideoBySlug,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo,
} from './video';
