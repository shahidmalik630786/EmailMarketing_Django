from django.shortcuts import render, HttpResponse, get_object_or_404
from rest_framework import viewsets, status
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.core.cache import cache

# Create your views here.


def home(request):
    return render(request, "index.html")

def dashboard2(request):
    return render(request, "dashboard2.html")

def dashboard3(request):
    return render(request, "dashboard3.html")

def master(request):
    return render(request, "master.html")

def datatable(request):
    return render(request, "datatable.html")




class ProjectView(APIView):
    def get(self, request, *args, **kwargs):
        # Get query parameters for page and page_size
        page = request.GET.get('page', 1)  # Default to page 1
        page_size = request.GET.get('page_size', 10)  # Default page size is 10
        search_value = request.GET.get('search[value]', '') 

        cache_key = f'project_list_page_{page}_size_{page_size}_search_{search_value}'
        data = cache.get(cache_key)
        if data is None:
            projects = Project.objects.values('id', 'name')

            if search_value:
                projects = projects.filter(name__icontains=search_value)
            
            paginator = Paginator(projects, page_size)

            try:
                paginated_projects = paginator.page(page)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ProjectSerializer(paginated_projects, many=True)

            data = ({
                "data": serializer.data,
                "total": paginator.count,
                "recordsFiltered": paginator.count,
            })
            # cache.set(cache_key, data, timeout=10)
        return Response(data)
    
    def post(self, request):
        serializer = ProjectSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        print(request,"******************")
        project = get_object_or_404(Project, pk=pk)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        project = get_object_or_404(Project, pk=pk)
        project.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)
    

    
        
