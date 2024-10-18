from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name = "home"),
    path('dashboard2/', views.dashboard2, name = "dashboard2"),
    path('dashboard3/', views.dashboard3, name = "dashboard3"),
    path('master/', views.master, name = "master"),
    path('datatable/', views.datatable, name = "datatable"),
    #API CRUD FOR PROJECT
    path('api/project/', views.ProjectView.as_view(), name="project_list_create_api"),  # GET & POST
    path('api/project/<int:pk>/', views.ProjectView.as_view(), name="project_detail_api")  # PUT & DELETE

]