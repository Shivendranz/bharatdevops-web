from django.contrib.auth.models import User
from django.db.models import Q 
from django.http import HttpResponse, JsonResponse 
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Models Import
from .models import (
    Category, Course, Module, Lesson, 
    NavbarMenu, SiteConfiguration, HomeSection
)

# Serializers Import
from .serializers import (
    CategorySerializer, 
    CourseSerializer, 
    ModuleSerializer, 
    LessonSerializer, 
    NavbarMenuSerializer,
    HomeSectionSerializer
)

# =========================================================
# 1. VIEWSETS (Dynamic Content)
# =========================================================

class HomeSectionViewSet(viewsets.ModelViewSet):
    """Admin se layout sections fetch karne ke liye"""
    queryset = HomeSection.objects.filter(is_active=True).order_by('order')
    serializer_class = HomeSectionSerializer
    permission_classes = [AllowAny]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CourseViewSet(viewsets.ModelViewSet):
    """
    🔥 lookup_field='slug' URL mein ID ki jagah 'linux' use karne deta hai.
    """
    queryset = Course.objects.all().order_by('order')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug' 

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all().order_by('order')
    serializer_class = ModuleSerializer
    permission_classes = [AllowAny]

class LessonViewSet(viewsets.ModelViewSet):
    """
    🔥 UPDATE: lookup_field='slug' add kiya gaya hai taaki 
    Lesson Detail page 500 Error na de aur Slug se data fetch kare.
    """
    queryset = Lesson.objects.all().order_by('order')
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'  # <--- Ye line 500 Error fix karegi
    
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    def get_queryset(self):
        queryset = Lesson.objects.all().order_by('order')
        query = self.request.query_params.get('search', None)
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | Q(content__icontains=query)
            )
        return queryset

# =========================================================
# 2. CUSTOM ENDPOINTS (Navigation & Auth)
# =========================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_navbar_menu(request):
    links = NavbarMenu.objects.all().order_by('order')
    serializer = NavbarMenuSerializer(links, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password:
        return Response({'error': 'Username/Password missing!'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists!'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        User.objects.create_user(username=username, password=password, email=email)
        return Response({'message': 'Swagat hai BharatDevOps mein!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# =========================================================
# 3. GLOBAL CONFIGURATION (LLM & SEO)
# =========================================================

def llm_text_view(request):
    """AI Bots ke liye plain text information"""
    config = SiteConfiguration.objects.first()
    if not config:
        return HttpResponse("BharatDevops: India's premier DevOps learning platform.", content_type="text/plain")
    
    content = f"Summary: {config.llm_summary}\nAuthor: {config.author_name}\nContact: {config.contact_email}"
    return HttpResponse(content, content_type="text/plain")

def site_info_api(request):
    """SEO aur Author details API"""
    config = SiteConfiguration.objects.first()
    if not config:
        return JsonResponse({"error": "Config missing"}, status=404)
    return JsonResponse({
        "seo": {"keywords": config.meta_keywords, "description": config.meta_description},
        "author": {"name": config.author_name, "bio": config.author_bio}
    })