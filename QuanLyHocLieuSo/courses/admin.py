from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Category, Course, Lesson, Material, User, Comment, Like, Topic, Note, Question, Answer, Exam, \
    ExamQuestion, ExamChoice, ExamResult, Order, Enrollment, LearningProgress, TeacherFeedback, ChatRoom, Message


class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Thông tin bổ sung', {'fields': ('avatar', 'role')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {'fields': ('avatar', 'role')}),
    )


class ExamChoiceInline(admin.TabularInline):
    model = ExamChoice
    extra = 4


class ExamQuestionAdmin(admin.ModelAdmin):
    inlines = [ExamChoiceInline]
    list_display = ['content', 'exam', 'point']
    list_filter = ['exam']
    search_fields = ['content']


class ExamQuestionInline(admin.StackedInline):
    model = ExamQuestion
    extra = 0
    show_change_link = True


class ExamAdmin(admin.ModelAdmin):
    inlines = [ExamQuestionInline]
    list_display = ['title', 'lesson', 'duration', 'pass_score', 'active']
    list_filter = ['lesson__course', 'active']


class ExamResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'score', 'is_passed', 'completed_at']
    list_filter = ['is_passed', 'exam']


class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'course', 'total_amount', 'status', 'created_date']
    list_filter = ['status', 'payment_method']
    search_fields = ['user__username', 'transaction_id']


class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'is_completed', 'created_date']
    list_filter = ['is_completed', 'course']


class LearningProgressAdmin(admin.ModelAdmin):
    list_display = ['student', 'material', 'progress_percent', 'is_completed']


class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'course']
    filter_horizontal = ['participants']


admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(Topic)
admin.site.register(Material)
admin.site.register(Comment)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Like)
admin.site.register(Note)
admin.site.register(Exam, ExamAdmin)
admin.site.register(ExamQuestion, ExamQuestionAdmin)
admin.site.register(ExamResult, ExamResultAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
admin.site.register(LearningProgress, LearningProgressAdmin)
admin.site.register(TeacherFeedback)
admin.site.register(ChatRoom, ChatRoomAdmin)
admin.site.register(Message)