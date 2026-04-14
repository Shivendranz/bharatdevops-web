from django.contrib import admin
from django.utils.html import format_html, mark_safe
from django.urls import reverse
from unfold.admin import ModelAdmin, TabularInline, StackedInline
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

from .models import (
    Category, Course, Module, Lesson, NavbarMenu, 
    SiteConfiguration, HomeSection, HomeSectionItem,
    Project, DevOpsTool, CloudProblem
)

# --- 🟢 INLINES ---

class HomeSectionItemInline(SortableInlineAdminMixin, TabularInline):
    model = HomeSectionItem
    # 🔥 Fields ka order set kar diya taaki Title/Icon/Link pehle dikhein
    fields = ('title', 'icon', 'link', 'course', 'project', 'tool', 'problem', 'order')
    extra = 1

class ModuleInline(StackedInline): 
    model = Module
    extra = 1
    tab = True

class LessonInline(TabularInline):
    model = Lesson
    extra = 1
    tab = True

# --- 🔵 SORTABLE ADMINS ---

@admin.register(HomeSection)
class HomeSectionAdmin(SortableAdminMixin, ModelAdmin):
    list_display = ('handle_drag', 'title', 'section_type', 'order', 'is_active', 'delete_action')
    list_display_links = ('title',)
    list_editable = ('order',) 
    
    ordering = ('order',) 
    
    list_filter = ('section_type', 'is_active')
    search_fields = ('title',)
    inlines = [HomeSectionItemInline]

    def handle_drag(self, obj):
        return mark_safe('<span class="drag-handle" style="cursor:move; font-size:18px;">⠿</span>')
    handle_drag.short_description = 'Move'

    def delete_action(self, obj):
        # dynamic reverse to handle possible namespace issues
        app_label = obj._meta.app_label
        model_name = obj._meta.model_name
        url = reverse(f'admin:{app_label}_{model_name}_delete', args=[obj.pk])
        return format_html(
            '<a href="{}" style="color: #ef4444; font-weight: 700; font-size: 11px; text-transform: uppercase; text-decoration: none;">✕ Delete</a>',
            url
        )
    delete_action.short_description = "Actions"

    class Media:
        js = (
            'admin/js/vendor/jquery/jquery.min.js',
            'admin/js/jquery.init.js',
            'adminsortable2/js/adminsortable2.js',
        )

@admin.register(Course)
class CourseAdmin(SortableAdminMixin, ModelAdmin): 
    list_display = ('handle_drag', 'title', 'category', 'level', 'delete_action')
    list_display_links = ('title',)
    list_filter = ('category', 'level')
    inlines = [ModuleInline]

    def handle_drag(self, obj):
        return mark_safe('<span style="cursor:move; font-size:18px;">⠿</span>')

    def delete_action(self, obj):
        url = reverse('admin:courses_course_delete', args=[obj.pk])
        return format_html('<a href="{}" style="color: #ef4444; font-weight: 700;">✕ Delete</a>', url)

@admin.register(Module)
class ModuleAdmin(SortableAdminMixin, ModelAdmin):
    list_display = ('handle_drag', 'title', 'course', 'delete_action')
    list_display_links = ('title',)
    inlines = [LessonInline]

    def handle_drag(self, obj):
        return mark_safe('<span style="cursor:move; font-size:18px;">⠿</span>')

    def delete_action(self, obj):
        url = reverse('admin:courses_module_delete', args=[obj.pk])
        return format_html('<a href="{}" style="color: #ef4444; font-weight: 700;">✕ Delete</a>', url)

@admin.register(Lesson)
class LessonAdmin(SortableAdminMixin, ModelAdmin):
    list_display = ('handle_drag', 'title', 'module', 'delete_action')
    list_display_links = ('title',)

    def handle_drag(self, obj):
        return mark_safe('<span style="cursor:move; font-size:18px;">⠿</span>')

    def delete_action(self, obj):
        url = reverse('admin:courses_lesson_delete', args=[obj.pk])
        return format_html('<a href="{}" style="color: #ef4444; font-weight: 700;">✕ Delete</a>', url)

# --- 🛠️ GENERAL ADMINS ---

@admin.register(Project, DevOpsTool, CloudProblem, Category, NavbarMenu, SiteConfiguration)
class GeneralAdmin(ModelAdmin):
    list_display = ('__str__', 'delete_action')
    
    def delete_action(self, obj):
        app_label = obj._meta.app_label
        model_name = obj._meta.model_name
        url = reverse(f'admin:{app_label}_{model_name}_delete', args=[obj.pk])
        return format_html('<a href="{}" style="color: #ef4444; font-weight: 700;">✕ Delete</a>', url)

admin.site.site_header = "BharatDevops Pro Admin"