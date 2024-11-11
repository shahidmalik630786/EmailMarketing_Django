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
    path('skipdomain/', views.skipdomain, name = "skipdomain"),
    path('fehlerhaft/', views.fehlerhaft, name = "fehlerhaft"),
    path('keywords/', views.keywords, name = "keywords"),
    path('blacklistkeywords/', views.blacklistkeywords, name = "blacklistkeywords"),
    path('impressumnichtgefunden/', views.impressumnichtgefunden, name = "impressumnichtgefunden"),
    path('parkingkeywords/', views.parkingkeywords, name = "parkingkeywords"),


    #API CRUD FOR PROJECT
    path('api/project/', views.ProjectView.as_view(), name="project_list_create_api"),  
    path('api/project/<int:pk>/', views.ProjectView.as_view(), name="project_detail_api"),  
    
    path('api/project/data/<int:pk>/', views.ProjectUpdateView.as_view(), name="project_list_update_api"),  
    path('api/project/data/', views.ProjectViewProjectId.as_view(), name="project_list_update_api"),  


    #API CRUD FOR SETTINGS
    path('api/settings/', views.SettingsView.as_view(), name="settings_list_create_api"),  
    path('api/settings/<int:pk>/', views.SettingsView.as_view(), name="settings_detail_api"),  

    path('api/settings/data/<int:pk>/', views.SettingsViewUpdate.as_view(), name="settings_list_update_api"),  
    # path('api/settings/data/', views.SettingsViewProjectId.as_view(), name="settings_list_update_api"),  


    #API CRUD FOR Email
    path('api/emails/', views.EmailView.as_view(), name="emails_list_create_api"),  
    path('api/emails/<int:pk>/', views.EmailView.as_view(), name="emails_detail_api"),  

    path('api/emails/data/<int:pk>/', views.EmailUpdateView.as_view(), name="emails_list_update_api"),  
    # path('api/emails/data/', views.EmailViewProjectId.as_view(), name="emails_list_update_api"),  


    #API CRUD FOR Hardblacklist
    path('api/hardblacklist/', views.HardblacklistView.as_view(), name="hardblacklist_list_create_api"),  
    path('api/hardblacklist/<int:pk>/', views.HardblacklistView.as_view(), name="hardblacklist_detail_api"),  

    path('api/hardblacklist/data/<int:pk>/', views.HardblacklistUpdateView.as_view(), name="hardblacklist_list_update_api"),  
    # path('api/hardblacklist/data/', views.HardblacklistViewProjectId.as_view(), name="hardblacklist_list_update_api"),  


    #API CRUD FOR Generalwords
    path('api/generalwords/', views.GeneralWordView.as_view(), name="generalwords_list_create_api"),  
    path('api/generalwords/<int:pk>/', views.GeneralWordView.as_view(), name="generalwords_detail_api"),  

    path('api/generalwords/data/<int:pk>/', views.GeneralwordUpdateView.as_view(), name="generalwords_list_update_api"),  
    # path('api/generalwords/data/', views.GeneralwordViewProjectId.as_view(), name="generalwords_list_update_api"),  


    # API CRUD FOR Erledigt
    path('api/erledigt/', views.ErledigtView.as_view(), name="erledigt_list_create_api"),  
    path('api/erledigt/<int:pk>/', views.ErledigtView.as_view(), name="erledigt_detail_api"),  

    path('api/erledigt/data/<int:pk>/', views.ErledigtUpdateView.as_view(), name="erledigt_list_update_api"),  
    # path('api/erledigt/data/', views.ErledigtViewProjectId.as_view(), name="erledigt_list_update_api"),  


    # API CRUD FOR Skipdomain
    path('api/skipdomain/', views.SkipDomainView.as_view(), name="skipdomain_list_create_api"),  
    path('api/skipdomain/<int:pk>/', views.SkipDomainView.as_view(), name="skipdomain_detail_api"), 

    path('api/skipdomain/data/<int:pk>/', views.SkipDomainUpdateView.as_view(), name="skipdomain_list_update_api"),  
    # path('api/skipdomain/data/', views.SkipDomainViewProjectId.as_view(), name="skipdomain_list_update_api"),  


    # API CRUD FOR Fehlerhaft
    path('api/fehlerhaft/', views.FehlerhaftView.as_view(), name="fehlerhaft_list_create_api"),  
    path('api/fehlerhaft/<int:pk>/', views.FehlerhaftView.as_view(), name="fehlerhaft_detail_api"), 

    path('api/fehlerhaft/data/<int:pk>/', views.FehlerhaftUpdateView.as_view(), name="fehlerhaft_list_update_api"),  
    # path('api/fehlerhaft/data/', views.FehlerhaftViewProjectId.as_view(), name="fehlerhaft_list_update_api"),  


    # API CRUD FOR Keywords
    path('api/keywords/', views.KeywordsView.as_view(), name="keywords_list_create_api"),  
    path('api/keywords/<int:pk>/', views.KeywordsView.as_view(), name="keywords_detail_api"), 

    path('api/keywords/data/<int:pk>/', views.KeywordsUpdateView.as_view(), name="keywords_list_update_api"),  
    # path('api/keywords/data/', views.KeywordsViewProjectId.as_view(), name="keywords_list_update_api"),  


    # API CRUD FOR Blacklistkeywords
    path('api/blacklistkeywords/', views.BlacklistKeywordsView.as_view(), name="blacklistkeywords_list_create_api"),  
    path('api/blacklistkeywords/<int:pk>/', views.BlacklistKeywordsView.as_view(), name="blacklistkeywords_detail_api"), 

    path('api/blacklistkeywords/data/<int:pk>/', views.BlacklistKeywordsUpdateView.as_view(), name="blacklistkeywords_list_update_api"),  
    # path('api/blacklistkeywords/data/', views.BlacklistKeywordsViewProjectId.as_view(), name="blacklistkeywords_list_update_api"), 



    # API CRUD FOR Blacklistkeywords
    path('api/parkingkeywords/', views.ParkingKeywordsView.as_view(), name="parking_keywords_list_create_api"),  
    path('api/parkingkeywords/<int:pk>/', views.ParkingKeywordsView.as_view(), name="parking_keywords_detail_api"), 

    path('api/parkingkeywords/data/<int:pk>/', views.ParkingKeywordsUpdateView.as_view(), name="parking_keywords_list_update_api"),  
    # path('api/parkingkeywords/data/', views.ParkingKeywordsViewProjectId.as_view(), name="parking_keywords_list_update_api"), 


    # API CRUD FOR ImpressumNichtGefunden
    path('api/impressumnichtgefunden/', views.ImpressumnichtgefundenView.as_view(), name="impressumnichtgefunden_list_create_api"),  
    path('api/impressumnichtgefunden/<int:pk>/', views.ImpressumnichtgefundenView.as_view(), name="impressumnichtgefunden_detail_api"), 

    path('api/impressumnichtgefunden/data/<int:pk>/', views.ImpressumNichtGefundenUpdateView.as_view(), name="impressumnichtgefunden_list_update_api"),  
    # path('api/impressumnichtgefunden/data/', views.ImpressumNichtGefundenViewProjectId.as_view(), name="impressumnichtgefunden_list_update_api"), 

]