from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView


urlpatterns = [
    # https://github.com/iMerica/dj-rest-auth/blob/545fd1f4c9ae570216989a8f5a563dd938e038af/docs/faq.rst#L20
    re_path(r'^password-reset/confirm/$', TemplateView.as_view(template_name="index.html"), name='password_reset_confirm'),
    re_path(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$', TemplateView.as_view(template_name="index.html"), name='password_reset_confirm'),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('dj_rest_auth.urls')),
    path('rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('accounts/', include('allauth.urls')),
]

urlpatterns += static('/media/', document_root=settings.MEDIA_ROOT)

urlpatterns.append(re_path(r'^.*', TemplateView.as_view(template_name='index.html')))

if settings.DEBUG:
    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    except:
        pass
