from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Q, Count, Sum
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .models import Category, Course, Lesson, Material, User, Comment, Topic, Like, Note, Question, Answer, Exam, \
    ExamChoice, ExamResult, Order, Enrollment, LearningProgress, TeacherFeedback, ChatRoom, Message
from .serializers import CategorySerializer, CourseSerializer, LessonSerializer, MaterialSerializer, UserSerializer, \
    CommentSerializer, TopicSerializer, NoteSerializer, LikeSerializer, QuestionSerializer, AnswerSerializer, \
    ExamSerializer, OrderSerializer, EnrollmentSerializer, LearningProgressSerializer, TeacherFeedbackSerializer, \
    ChatRoomSerializer, MessageSerializer
from .perms import IsTeacher, IsOwner


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['retrieve', 'current_user']:
            return [permissions.IsAuthenticated()]
        if self.action == 'list':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):

        q = request.query_params.get('q')
        qs = self.queryset
        if q:
            if q.isdigit():
                qs = qs.filter(id=int(q))
            else:
                qs = qs.filter(Q(first_name__icontains=q) | Q(last_name__icontains=q))
        serializer = UserSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='current-user')
    def current_user(self, request):
        return Response(self.serializer_class(request.user, context={'request': request}).data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsTeacher()]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(active=True)
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsTeacher()]

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("q")
        category = self.request.query_params.get("category")

        if category:
            queries = queries.filter(category_id=category)

        if q:
            queries = queries.filter(subject__icontains=q)

        return queries

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.filter(active=True)
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsTeacher()]


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.filter(active=True)
    serializer_class = TopicSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsTeacher()]

    def get_queryset(self):
        queryset = Material.objects.filter(active=True)

        q = self.request.query_params.get('q')
        lesson = self.request.query_params.get('lesson')
        topic = self.request.query_params.get('topic')
        material_type = self.request.query_params.get('material_type')
        level = self.request.query_params.get('level')

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q) |
                Q(lesson__subject__icontains=q)
            )

        if lesson:
            queryset = queryset.filter(lesson_id=lesson)

        if topic:
            queryset = queryset.filter(topics__id=topic)

        if material_type:
            queryset = queryset.filter(material_type=material_type)

        if level:
            queryset = queryset.filter(level=level)

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.filter(active=True)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwner()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queries = self.queryset

        lesson_id = self.request.query_params.get('lesson')
        q = self.request.query_params.get('q')

        if lesson_id:
            queries = queries.filter(lesson_id=lesson_id)

        if q:
            queries = queries.filter(
                Q(title__icontains=q) |
                Q(content__icontains=q)
            )

        return queries.order_by('-created_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.filter(active=True)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwner()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queries = self.queryset
        question_id = self.request.query_params.get('question')

        if question_id:
            queries = queries.filter(question_id=question_id)

        return queries.order_by('created_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.filter(active=True)

    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            return [IsOwner()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queries = self.queryset

        lesson = self.request.query_params.get('lesson')
        material = self.request.query_params.get('material')
        question = self.request.query_params.get('question')
        answer = self.request.query_params.get('answer')

        if lesson:
            queries = queries.filter(lesson_id=lesson)
        if material:
            queries = queries.filter(material_id=material)
        if question:
            queries = queries.filter(question_id=question)
        if answer:
            queries = queries.filter(answer_id=answer)

        return queries.order_by('created_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.filter(material__isnull=False)
    serializer_class = NoteSerializer

    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            return [IsOwner()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exam.objects.filter(active=True)
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['post'], detail=True, url_path='submit')
    def submit_exam(self, request, pk=None):
        exam = self.get_object()
        user_answers = request.data.get('answers', {})

        score = 0.0
        total_correct = 0
        total_questions = exam.questions.count()

        for question in exam.questions.all():
            user_choice_id = user_answers.get(str(question.id))

            if user_choice_id:
                try:
                    selected_choice = ExamChoice.objects.get(pk=user_choice_id, question=question)
                    if selected_choice.is_correct:
                        score += question.point
                        total_correct += 1
                except ExamChoice.DoesNotExist:
                    continue

        is_passed = score >= exam.pass_score

        ExamResult.objects.update_or_create(
            student=request.user,
            exam=exam,
            defaults={
                'score': score,
                'total_correct': total_correct,
                'total_questions': total_questions,
                'is_passed': is_passed
            }
        )

        return Response({
            "score": score,
            "total_correct": total_correct,
            "total_questions": total_questions,
            "is_passed": is_passed,
            "message": f"Bạn đã làm đúng {total_correct}/{total_questions} câu."
        }, status=status.HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == User.STUDENT:
            return Order.objects.filter(user=self.request.user)
        return Order.objects.all()

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        serializer.save(user=self.request.user, total_amount=course.price)

    @action(methods=['post'], detail=True, url_path='confirm-payment')
    def confirm_payment(self, request, pk=None):
        order = self.get_object()
        order.status = Order.SUCCESS
        order.transaction_id = request.data.get('transaction_id', 'MOCK_TRANS_ID')
        order.save()

        Enrollment.objects.get_or_create(student=order.user, course=order.course)

        return Response({'status': 'Payment confirmed and Course enrolled'}, status=status.HTTP_200_OK)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.TEACHER:
            return Enrollment.objects.filter(course__teacher=user)
        return Enrollment.objects.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class LearningProgressViewSet(viewsets.ModelViewSet):
    queryset = LearningProgress.objects.all()
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LearningProgress.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(methods=['post'], detail=False, url_path='update-progress')
    def update_progress(self, request):
        material_id = request.data.get('material')
        percent = request.data.get('progress_percent')
        duration = request.data.get('study_duration')

        progress, created = LearningProgress.objects.update_or_create(
            student=request.user,
            material_id=material_id,
            defaults={
                'progress_percent': percent,
                'study_duration': duration
            }
        )
        return Response(LearningProgressSerializer(progress).data)


class TeacherFeedbackViewSet(viewsets.ModelViewSet):
    queryset = TeacherFeedback.objects.all()
    serializer_class = TeacherFeedbackSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsTeacher()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        if self.request.user.role == User.TEACHER:
            serializer.save(teacher=self.request.user)
        else:
            raise permissions.PermissionDenied("Đánh giá chỉ dành cho giảng viên!")


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=True)
    def messages(self, request, pk=None):
        room = self.get_object()
        messages = room.messages.all().order_by('created_date')
        return Response(MessageSerializer(messages, many=True).data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user

        enrolled_courses = Enrollment.objects.filter(student=user).values_list('course_id', flat=True)
        interested_categories = Course.objects.filter(id__in=enrolled_courses).values_list('category_id',
                                                                                           flat=True).distinct()
        suggested_courses = Course.objects.filter(
            category_id__in=interested_categories
        ).exclude(
            id__in=enrolled_courses
        ).annotate(
            student_count=Count('enrollments')
        ).order_by('-student_count')[:5]

        if not suggested_courses.exists():
            suggested_courses = Course.objects.filter(active=True).order_by('-created_date')[:5]

        return Response(CourseSerializer(suggested_courses, many=True, context={'request': request}).data)


class StatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, url_path='student-stats')
    def student_stats(self, request):
        user = request.user
        total_courses = Enrollment.objects.filter(student=user).count()
        total_duration = LearningProgress.objects.filter(student=user).aggregate(Sum('study_duration'))[
                             'study_duration__sum'] or 0
        completed_courses = Enrollment.objects.filter(student=user, is_completed=True).count()

        return Response({
            'total_courses': total_courses,
            'total_hours': round(total_duration / 3600, 1),
            'completed_courses': completed_courses
        })

    @action(methods=['get'], detail=False, url_path='admin-stats')
    def admin_stats(self, request):
        if request.user.role == 3:
            return Response({'error': 'Permission denied'}, status=403)
        revenue = Order.objects.filter(status=1).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        user_stats = User.objects.values('role').annotate(count=Count('id'))
        top_courses = Course.objects.annotate(students=Count('enrollments')).order_by('-students')[:5].values('subject',
                                                                                                              'students')

        return Response({
            'total_revenue': revenue,
            'user_demographics': user_stats,
            'top_courses': top_courses
        })


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Vui lòng nhập đầy đủ thông tin'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'role': user.role,
                'avatar': user.avatar.url if user.avatar else None,
                'first_name': user.first_name,
                'last_name': user.last_name
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Tài khoản hoặc mật khẩu không đúng'}, status=status.HTTP_400_BAD_REQUEST)