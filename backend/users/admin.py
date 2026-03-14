from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Fields to display in admin list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'profile_tag')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

    # Add profile image preview
    def profile_tag(self, obj):
        if obj.profile_url:
            return f'<img src="{obj.profile_url}" width="30" height="30" style="border-radius:50%"/>'
        return '-'
    profile_tag.allow_tags = True
    profile_tag.short_description = 'Profile'

    # Fields to edit in admin
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'profile_url')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'profile_url'),
        }),
    )