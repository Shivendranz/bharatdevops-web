from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Wagtail Imports
from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

# Courses Views
from courses.views import (
    CategoryViewSet, 
    CourseViewSet, 
    ModuleViewSet, 
    LessonViewSet, 
    HomeSectionViewSet,  # Naya Home Section ViewSet
    register_user, 
    get_navbar_menu,
    llm_text_view,      
    site_info_api       
)

# Router configuration
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'home-sections', HomeSectionViewSet) # Home-sections register ho gaya

urlpatterns = [
    # 1. Modern Django Admin (Unfold UI)
    path('admin/', admin.site.urls),
    
    # 2. Wagtail CMS Portal (Admin panel for CMS)
    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    
    # 3. Global Control Center Endpoints (SEO & AI Tools)
    path('llm.txt', llm_text_view, name='llm-text'), 
    path('api/site-settings/', site_info_api, name='site-settings-api'), 
    
    # 4. API & Tools (Main Data Endpoints)
    path('api/', include(router.urls)), 
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path('api/register/', register_user, name='register'),
    path('api/navbar-menu/', get_navbar_menu, name='navbar-menu'),
    
    # 5. Authentication (JWT - Secure Login)
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 6. Wagtail Pages (CMS content handling)
    path('pages/', include(wagtail_urls)),
]

# Media aur Static files serving (Development mode only)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)