from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet)
router.register('courses', views.CourseViewSet)
router.register('lessons', views.LessonViewSet)
router.register('topics', views.TopicViewSet)
router.register(r'materials', views.MaterialViewSet, basename='material')
router.register('users', views.UserViewSet)
router.register('questions', views.QuestionViewSet)
router.register('answers', views.AnswerViewSet)
router.register('comments', views.CommentViewSet)
router.register('likes', views.LikeViewSet)
router.register('notes', views.NoteViewSet)
router.register('exams', views.ExamViewSet)
router.register('orders', views.OrderViewSet)
router.register('enrollments', views.EnrollmentViewSet)
router.register('learning-progress', views.LearningProgressViewSet)
router.register('teacher-feedbacks', views.TeacherFeedbackViewSet)
router.register('chat-rooms', views.ChatRoomViewSet)
router.register('messages', views.MessageViewSet)
router.register('recommendations', views.RecommendationViewSet, basename='recommendations')
router.register('stats', views.StatsViewSet, basename='stats')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login')
]