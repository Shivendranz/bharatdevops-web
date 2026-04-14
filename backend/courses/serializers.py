from rest_framework import serializers
from .models import (
    Category, Course, Module, Lesson, NavbarMenu, 
    HomeSection, HomeSectionItem, Project, DevOpsTool, CloudProblem
)

# 1. Projects Serializer
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

# 2. DevOps Tools Serializer
class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevOpsTool
        fields = '__all__'

# 3. Cloud Problems Serializer
class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudProblem
        fields = '__all__'

# 🔥 4. UPDATED Lesson Serializer (ID Based Fix)
class LessonSerializer(serializers.ModelSerializer):
    next_lesson = serializers.SerializerMethodField()
    prev_lesson = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        # Yahan se 'order' field hata di gayi hai agar aap use nahi kar rahe
        fields = ['id', 'title', 'slug', 'content', 'video_url', 'next_lesson', 'prev_lesson']

    def get_next_lesson(self, obj):
        # A. Same module mein agla lesson (jiski ID current ID se badi ho)
        next_l = Lesson.objects.filter(module=obj.module, id__gt=obj.id).order_by('id').first()
        
        # B. Agar module khatam, toh agle module ka pehla lesson dhoondo
        if not next_l:
            next_mod = Module.objects.filter(course=obj.module.course, id__gt=obj.module.id).order_by('id').first()
            if next_mod:
                next_l = Lesson.objects.filter(module=next_mod).order_by('id').first()
        
        if next_l:
            return {"slug": next_l.slug, "title": next_l.title}
        return None

    def get_prev_lesson(self, obj):
        # A. Same module mein pichla lesson (jiski ID current ID se chhoti ho)
        prev_l = Lesson.objects.filter(module=obj.module, id__lt=obj.id).order_by('-id').first()
        
        # B. Agar piche koi lesson nahi, toh pichle module ka aakhri lesson
        if not prev_l:
            prev_mod = Module.objects.filter(course=obj.module.course, id__lt=obj.module.id).order_by('-id').first()
            if prev_mod:
                prev_l = Lesson.objects.filter(module=prev_mod).order_by('-id').first()
        
        if prev_l:
            return {"slug": prev_l.slug, "title": prev_l.title}
        return None

# 5. Module Serializer
class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = ['id', 'title', 'lessons'] # order hata diya

# 6. Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    modules = ModuleSerializer(many=True, read_only=True) 
    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'icon', 'level', 'category_name', 'modules']

# 7. Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'courses']

# 8. Home Section Item Serializer
class HomeSectionItemSerializer(serializers.ModelSerializer):
    course_id = serializers.ReadOnlyField(source='course.id')
    course_slug = serializers.ReadOnlyField(source='course.slug')
    
    course = CourseSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    tool = ToolSerializer(read_only=True)
    problem = ProblemSerializer(read_only=True)

    class Meta:
        model = HomeSectionItem
        fields = [
            'id', 'course_id', 'course_slug', 'course', 
            'project', 'tool', 'problem', 'title', 'icon', 'link'
        ]

# 9. Home Section Serializer
class HomeSectionSerializer(serializers.ModelSerializer):
    items = HomeSectionItemSerializer(many=True, read_only=True) 
    class Meta:
        model = HomeSection
        fields = ['id', 'title', 'section_type', 'is_active', 'items']

# 10. Navbar Menu Serializer
class NavbarMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavbarMenu
        fields = ['id', 'title', 'url']