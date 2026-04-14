from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.text import slugify

# --- 1. BASIC STRUCTURE ---
class Category(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        verbose_name_plural = "Categories"
    def __str__(self): return self.name

class Course(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="courses")
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, null=True, blank=True, max_length=255, help_text="URL ke liye (e.g. linux-roadmap)")
    icon = models.CharField(max_length=100, default="🚀")
    level = models.CharField(max_length=50, choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')])
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self): return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ['order']
    def __str__(self): return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    # 🔥 LESSON SLUG ADDED (Unique rkhna zaroori hai)
    slug = models.SlugField(unique=True, null=True, blank=True, max_length=255, help_text="Lesson ka unique URL")
    content = CKEditor5Field('Content', config_name='extends')
    video_url = models.URLField(blank=True, null=True, help_text="YouTube URL")
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']

    # 🔥 Smart Slug Generator for Lessons
    def save(self, *args, **kwargs):
        if not self.slug:
            # Course title aur Lesson title ko mila kar unique slug banega
            # e.g. "Linux" + "Intro" = "linux-intro"
            full_title = f"{self.module.course.title}-{self.title}"
            self.slug = slugify(full_title)
        super().save(*args, **kwargs)

    def __str__(self): return self.title

# --- 2. NEW MODELS ---
class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    link = models.URLField(blank=True)
    def __str__(self): return self.title

class DevOpsTool(models.Model):
    name = models.CharField(max_length=100)
    logo_icon = models.CharField(max_length=100, default="🛠️")
    def __str__(self): return self.name

class CloudProblem(models.Model):
    title = models.CharField(max_length=255)
    solution_summary = models.TextField()
    def __str__(self): return self.title

# --- 3. HOME SECTION LOGIC ---
class HomeSection(models.Model):
    SECTION_TYPES = [
        ('hero', '🚀 Hero Banner'),
        ('core_tools', '🔹 Core Tools'),
        ('containers', '🔹 Containers & Orchestration'),
        ('iac', '🔹 Infrastructure as Code (IaC)'),
        ('cicd', '🔹 CI/CD & Automation'),
        ('monitoring', '🔹 Monitoring & Logging'),
        ('databases', '🔹 Databases'),
        ('cloud', '🔹 Cloud Providers'),
        ('networking', '🔹 Networking & Security'),
        ('concepts', '🔹 DevOps General Concepts'),
        ('messaging', '🔹 Messaging & Streaming'),
        ('gitops', '🔹 GitOps / CD Tools'),
        ('secrets', '🔹 Secrets & Security'),
        ('service_mesh', '🔹 Service Mesh & Networking'),
        ('observability', '🔹 Observability (Advanced)'),
        ('artifacts', '🔹 Artifact & Package Management'),
        ('containers_adv', '🔹 Containers (Advanced)'),
        ('build_tools', '🔹 Build Tools'),
        ('os_infra', '🔹 OS & Infra Tools'),
        ('web_servers', '🔹 Web Servers & Proxies'),
        ('serverless', '🔹 Serverless & Cloud Native'),
        ('testing', '🔹 Testing & Quality'),
        ('data_eng', '🔹 Data Engineering & Workflow'),
        ('big_data', '🔹 Big Data & Processing'),
        ('mlops', '🔹 MLOps & AI Tools'),
        ('api_tools', '🔹 API & Backend Tools'),
        ('api_mgmt', '🔹 API Management & Testing'),
        ('queue_adv', '🔹 Queue + Streaming Advanced'),
        ('storage', '🔹 Storage & Object Storage'),
        ('obs_pro', '🔹 Observability Advanced (Pro Level)'),
        ('sec_adv', '🔹 Security (Advanced)'),
        ('platform_eng', '🔹 Platform Engineering'),
        ('versioning_adv', '🔹 Versioning & Artifact (Advanced)'),
        ('os_shell', '🔹 OS + Shell + CLI'),
        ('dev_tools_bonus', '🔹 Dev Tools (Bonus)'),
        ('data_platforms', '🔹 Modern Data Platforms'),
        ('data_integration', '🔹 Data Integration / ELT'),
        ('baas', '🔹 Modern Backend-as-a-Service'),
        ('feature_flags', '🔹 Feature Flags & Experimentation'),
        ('collaboration', '🔹 Collaboration & DevOps Tools'),
        ('cdn_edge', '🔹 CDN & Edge / Performance'),
        ('auth_identity', '🔹 Authentication & Identity'),
        ('payment_saas', '🔹 Payment / SaaS Infra'),
        ('obs_saas', '🔹 Observability SaaS'),
        ('community', '💬 Community Section'),
        ('newsletter', '📧 Newsletter Box'),
    ]
    title = models.CharField(max_length=255, help_text="Section ka heading")
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
    def __str__(self): 
        return f"{self.get_section_type_display()} - {self.title}"

class HomeSectionItem(models.Model):
    home_section = models.ForeignKey(HomeSection, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=255, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True, default="⚙️")
    link = models.URLField(blank=True, null=True)

    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    tool = models.ForeignKey(DevOpsTool, on_delete=models.SET_NULL, null=True, blank=True)
    problem = models.ForeignKey(CloudProblem, on_delete=models.SET_NULL, null=True, blank=True)
    
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        if self.course and not self.title:
            self.title = self.course.title
            self.icon = self.course.icon
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title if self.title else f"Item in {self.home_section.title}"

# --- 4. SITE CONFIG & NAVBAR ---
class NavbarMenu(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ['order']
    def __str__(self): return self.title

class SiteConfiguration(models.Model):
    llm_summary = models.TextField(blank=True)
    meta_keywords = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)
    author_name = models.CharField(max_length=100, blank=True)
    author_bio = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    linkedin_url = models.URLField(blank=True)
    def __str__(self): return "Site Configuration"