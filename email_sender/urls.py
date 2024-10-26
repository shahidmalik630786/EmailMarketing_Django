from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name = "home"),
    path('dashboard2/', views.dashboard2, name = "dashboard2"),
    path('dashboard3/', views.dashboard3, name = "dashboard3"),
    path('master/', views.master, name = "master"),
    path('project/', views.project, name = "project"),
    path('settings/', views.settings, name = "settings"),
    path('emails/', views.emails, name = "emails"),
    path('hardblacklist/', views.hardblacklist, name = "hardblacklist"),
    path('generalwords/', views.generalwords, name = "generalwords"),
    path('erledigt/', views.erledigt, name = "erledigt"),


    #API CRUD FOR PROJECT
    path('api/project/', views.ProjectView.as_view(), name="project_list_create_api"),  
    path('api/project/<int:pk>/', views.ProjectView.as_view(), name="project_detail_api"),  
    
    path('api/project/data/<int:pk>/', views.ProjectUpdateView.as_view(), name="project_list_update_api"),  
    path('api/project/data/', views.ProjectViewProjectId.as_view(), name="project_list_update_api"),  


    #API CRUD FOR SETTINGS
    path('api/settings/', views.SettingsView.as_view(), name="settings_list_create_api"),  
    path('api/settings/<int:pk>/', views.SettingsView.as_view(), name="settings_detail_api"),  

    path('api/settings/data/<int:pk>/', views.SettingsViewUpdate.as_view(), name="settings_list_update_api"),  
    path('api/settings/data/', views.SettingsViewProjectId.as_view(), name="settings_list_update_api"),  


    #API CRUD FOR Email
    path('api/emails/', views.EmailView.as_view(), name="emails_list_create_api"),  
    path('api/emails/<int:pk>/', views.EmailView.as_view(), name="emails_detail_api"),  

    path('api/emails/data/<int:pk>/', views.EmailUpdateView.as_view(), name="emails_list_update_api"),  
    path('api/emails/data/', views.EmailViewProjectId.as_view(), name="emails_list_update_api"),  


    #API CRUD FOR Hardblacklist
    path('api/hardblacklist/', views.HardblacklistView.as_view(), name="hardblacklist_list_create_api"),  
    path('api/hardblacklist/<int:pk>/', views.HardblacklistView.as_view(), name="hardblacklist_detail_api"),  

    path('api/hardblacklist/data/<int:pk>/', views.HardblacklistUpdateView.as_view(), name="hardblacklist_list_update_api"),  
    path('api/hardblacklist/data/', views.HardblacklistViewProjectId.as_view(), name="hardblacklist_list_update_api"),  


    #API CRUD FOR Hardblacklist
    path('api/generalwords/', views.GeneralWordView.as_view(), name="generalwords_list_create_api"),  
    path('api/generalwords/<int:pk>/', views.GeneralWordView.as_view(), name="generalwords_detail_api"),  

    path('api/generalwords/data/<int:pk>/', views.GeneralwordUpdateView.as_view(), name="generalwords_list_update_api"),  
    path('api/generalwords/data/', views.GeneralwordViewProjectId.as_view(), name="generalwords_list_update_api"),  


    # API CRUD FOR Erledigt
    path('api/erledigt/', views.ErledigtView.as_view(), name="erledigt_list_create_api"),  
    path('api/erledigt/<int:pk>/', views.ErledigtView.as_view(), name="erledigt_detail_api"),  

    path('api/erledigt/data/<int:pk>/', views.ErledigtUpdateView.as_view(), name="erledigt_list_update_api"),  
    path('api/erledigt/data/', views.ErledigtViewProjectId.as_view(), name="erledigt_list_update_api"),  

]