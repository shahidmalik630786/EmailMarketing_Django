from django.shortcuts import render, HttpResponse, get_object_or_404
from rest_framework import viewsets, status
from .models import Project, Settings, Emails, Hardblacklist, Generalwords, Erledigt
from .serializers import ProjectSerializer, SettingsSerializer, SettingsSerializerUpdate, EmailSerializer, HardblacklistSerializer, SettingsSerializerdata, GeneralwordsSerializer, ErledigtSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.core.cache import cache
from .pagination import GeneralWordsPageNumberPagination, ErledigtPageNumberPagination
from django.db.models import Q

# Create your views here.


def home(request):
    return render(request, "index.html")

def dashboard2(request):
    return render(request, "dashboard2.html")

def dashboard3(request):
    return render(request, "dashboard3.html")

def master(request):
    return render(request, "master.html")

def project(request):
    return render(request, "project.html")

def settings(request):
    return render(request, "settings.html")

def emails(request):
    return render(request, "emails.html")

def hardblacklist(request):
    return render(request, "hardblacklist.html")

def generalwords(request):
    return render(request, "generalwords.html")

def erledigt(request):
    return render(request, "erledigt.html")


#PROJECT API
class ProjectView(APIView):
    def get(self, request, *args, **kwargs):
        page = request.GET.get('page', 1)  # Default to page 1
        page_size = request.GET.get('page_size', 10)  # Default page size is 10
        search_value = request.GET.get('search[value]', '') 
        project_id = request.GET.get('id', None)
        draw = request.GET.get('draw', 1)

        cache_key = f'project_list_page_{page}_size_{page_size}_search_{search_value}'
        data = cache.get(cache_key)
        if data is None:
            settings = Project.objects.values('id', 'name')
            total_records = settings.count()
            if project_id:
                settings = settings.filter(id=project_id)

            if search_value:
                settings = settings.filter(absender_name__icontains=search_value)
            
            paginator = Paginator(settings, page_size)

            try:
                paginated_settings = paginator.page(page)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ProjectSerializer(paginated_settings, many=True)

            data = ({
                "draw": int(draw),
                "recordsTotal": total_records,
                "data": serializer.data,
                "total": paginator.count,
                "recordsFiltered": paginator.count,
            })
        return Response(data)
    
    def post(self, request):
        serializer = ProjectSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
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


class ProjectUpdateView(APIView):
    """ to pre fill the form while updating project"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            project = Project.objects.filter(id=pk).values("id", "name").first() 
            if not project:
                return Response({'error': 'project not found'}, status=404)
            
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        except Emails.DoesNotExist:
            return Response({'error': 'project not found'}, status=404)


class ProjectViewProjectId(APIView):
    """To display project id on settings template"""
    def get(self, request, *args, **kwargs):
        try:
            project = Project.objects.all()
            if not project:
                return Response({'error': 'project not found'}, status=404)
            serializer = ProjectSerializer(project, many = True)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)
    
        

#SETTINGS API
class SettingsView(APIView):
    """CRUD for settings"""
    def get(self, request, *args, **kwargs):
        # Get query parameters for page and page_size
        page = request.GET.get('page', 1)  # Default to page 1
        page_size = request.GET.get('page_size', 10)  # Default page size is 10
        search_value = request.GET.get('search[value]', '') 
        project_id = request.GET.get('project_id', None)
        draw = request.GET.get('draw', 1)

        cache_key = f'project_list_page_{page}_size_{page_size}_search_{search_value}'
        data = cache.get(cache_key)
        if data is None:
            settings = Settings.objects.values('id', 'absender_name', 'absender_firma', "absender_strasse", "absender_plz", 'absender_email', 'smtp_email', 'send_start_hour', 'send_end_hour')
            total_records = settings.count()
            if project_id:
                settings = settings.filter(projekt_id=project_id)

            if search_value:
                settings = settings.filter(absender_name__icontains=search_value)
            
            paginator = Paginator(settings, page_size)

            try:
                paginated_settings = paginator.page(page)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer = SettingsSerializer(paginated_settings, many=True)

            data = ({
                "draw": int(draw),
                "recordsTotal": total_records,
                "data": serializer.data,
                "total": paginator.count,
                "recordsFiltered": paginator.count,
            })
        return Response(data)
    
    def post(self, request):
        serializer = SettingsSerializerUpdate(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        project = get_object_or_404(Settings, pk=pk)
        serializer = SettingsSerializerUpdate(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        settings = get_object_or_404(Settings, pk=pk)
        settings.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)
    


class SettingsViewUpdate(APIView):
    """ to pre fill the form while updating settings"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            # Fetch the settings by primary key (pk)
            settings = Settings.objects.filter(id=pk).values(
                'absender_name', 'absender_firma', 'absender_strasse', 'absender_plz', 'absender_telefon', 
                'absender_email', 'smtp_email', 'smtp_name', 'smtp_server', 'smtp_port', 
                'arbeitsaufgabe', 'betreff_aufgabe', 'token_limit', 'absender_homepage', 
                'bcc_email_1', 'bcc_email_2', 'wait_time', 'send_start_hour', 'send_end_hour', 
                'max_workers', 'debug', 'projekt_id', 'ssl_tls'
            ).first() 

            if not settings:
                return Response({'error': 'Settings not found'}, status=404)
            
            serializer = SettingsSerializerUpdate(settings)
            return Response(serializer.data)

        except Settings.DoesNotExist:
            return Response({'error': 'Settings not found'}, status=404)
        
class SettingsViewProjectId(APIView):
    """To display project id on settings template"""
    def get(self, request, *args, **kwargs):
        try:
            settings = Settings.objects.all()
            if not settings:
                return Response({'error': 'Settings not found'}, status=404)
            
            serializer = SettingsSerializerdata(settings, many = True)
            return Response(serializer.data)
        except Settings.DoesNotExist:
            return Response({'error': 'Settings not found'}, status=404)

    
#EMAIL API
class EmailView(APIView):
    """CRUD for Email"""
    def get(self, request, *args, **kwargs):
        page = request.GET.get('page', 1) 
        page_size = request.GET.get('page_size', 10)  
        search_value = request.GET.get('search[value]', '') 
        project_id = request.GET.get('project_id', None)
        draw = request.GET.get('draw', 1)

        cache_key = f'project_list_page_{page}_size_{page_size}_search_{search_value}'
        data = cache.get(cache_key)
        if data is None:
            emails = Emails.objects.values("id", "email", "projekt_id", "ceo_name", "domain")
            total_records = emails.count()
            if project_id:
                emails = emails.filter(projekt_id=project_id)

            if search_value:
                emails = emails.filter(ceo_name__icontains=search_value)
            
            paginator = Paginator(emails, page_size)

            try:
                paginated_emails = paginator.page(page)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer = EmailSerializer(paginated_emails, many=True)

            data = ({
                "draw": int(draw),
                "recordsTotal": total_records,
                "data": serializer.data,
                "total": paginator.count,
                "recordsFiltered": paginator.count,
            })
        return Response(data)
    
    def post(self, request):
        serializer = EmailSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        project = get_object_or_404(Emails, pk=pk)
        serializer = EmailSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        email = get_object_or_404(Emails, pk=pk)
        email.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)



class EmailUpdateView(APIView):
    """ to pre fill the form while updating email"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            email = Emails.objects.filter(id=pk).values("id", "email", "projekt_id", "ceo_name", "domain").first() 
            if not email:
                return Response({'error': 'Emails not found'}, status=404)
            
            serializer = EmailSerializer(email)
            return Response(serializer.data)
        except Emails.DoesNotExist:
            return Response({'error': 'Emails not found'}, status=404)


class EmailViewProjectId(APIView):
    """To display project id on email templat"""
    def get(self, request, *args, **kwargs):
        try:
            emails = Emails.objects.all()
            if not emails:
                return Response({'error': 'Emails not found'}, status=404)
            
            serializer = EmailSerializer(emails, many = True)
            return Response(serializer.data)
        except Emails.DoesNotExist:
            return Response({'error': 'Emails not found'}, status=404)


#HARDBLACKLIST API
class HardblacklistView(APIView):
    """CRUD for hardblacklist"""
    def get(self, request, *args, **kwargs):
        page = request.GET.get('page', 1) 
        page_size = request.GET.get('page_size', 10)  
        search_value = request.GET.get('search[value]', '') 
        project_id = request.GET.get('project_id', None)
        draw = request.GET.get('draw', 1)

        cache_key = f'project_list_page_{page}_size_{page_size}_search_{search_value}'
        data = cache.get(cache_key)
        if data is None:
            emails = Hardblacklist.objects.values("id", "domain", "projekt_id")
            total_records = emails.count()
            if project_id:
                emails = emails.filter(projekt_id=project_id)

            if search_value:
                emails = emails.filter(domain__icontains=search_value)
            
            paginator = Paginator(emails, page_size)

            try:
                paginated_emails = paginator.page(page)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            serializer = HardblacklistSerializer(paginated_emails, many=True)

            data = ({
                "draw": int(draw),
                "recordsTotal": total_records,
                "data": serializer.data,
                "total": paginator.count,
                "recordsFiltered": paginator.count,
            })
        return Response(data)
    
    def post(self, request):
        serializer = HardblacklistSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        project = get_object_or_404(Hardblacklist, pk=pk)
        serializer = HardblacklistSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        hardblacklist = get_object_or_404(Hardblacklist, pk=pk)
        hardblacklist.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class HardblacklistUpdateView(APIView):
    """ to pre fill the form while updating hardblacklist"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            hardblacklist = Hardblacklist.objects.filter(id=pk).values("id", "domain", "projekt_id").first() 

            if not hardblacklist:
                return Response({'error': 'Settings not found'}, status=404)
            
            serializer = HardblacklistSerializer(hardblacklist)
            return Response(serializer.data)

        except Hardblacklist.DoesNotExist:
            return Response({'error': 'Settings not found'}, status=404)


class HardblacklistViewProjectId(APIView):
    """To display project id on hardblacklist templat"""
    def get(self, request, *args, **kwargs):
        try:
            hardblacklist = Hardblacklist.objects.all()
            if not hardblacklist:
                return Response({'error': 'Emails not found'}, status=404)
            
            serializer = HardblacklistSerializer(hardblacklist, many = True)
            return Response(serializer.data)
        except Hardblacklist.DoesNotExist:
            return Response({'error': 'Emails not found'}, status=404)
        

#GENERALS WORD API
class GeneralWordView(APIView):
    """CRUD for hardblacklist"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Generalwords.objects.all()

        # Apply filters
        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(word__icontains=search_value)

        # Paginate queryset
        paginator = GeneralWordsPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        # Serialize data
        serializer = GeneralwordsSerializer(paginated_queryset, many=True)
        
        # Return paginated response
        return paginator.get_paginated_response(serializer.data)

    
    def post(self, request):
        serializer = GeneralwordsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        project = get_object_or_404(Generalwords, pk=pk)
        serializer = GeneralwordsSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        generalwords = get_object_or_404(Generalwords, pk=pk)
        generalwords.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class GeneralwordUpdateView(APIView):
    """ to pre fill the form while updating hardblacklist"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Generalwords.objects.filter(id=pk).values("id", "word").first() 

            if not queryset:
                return Response({'error': 'Settings not found'}, status=404)
            
            serializer = GeneralwordsSerializer(queryset)
            return Response(serializer.data)

        except Generalwords.DoesNotExist:
            return Response({'error': 'Settings not found'}, status=404)


class GeneralwordViewProjectId(APIView):
    """To display project id on hardblacklist templat"""
    def get(self, request, *args, **kwargs):
        try:
            queryset = Generalwords.objects.all()
            if not queryset:
                return Response({'error': 'Emails not found'}, status=404)
            
            serializer = GeneralwordsSerializer(queryset, many = True)
            return Response(serializer.data)
        except Generalwords.DoesNotExist:
            return Response({'error': 'Emails not found'}, status=404)
        

#GENErledigtERALS WORD API
class ErledigtView(APIView):
    """CRUD for hardblacklist"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Erledigt.objects.all()

        projekt_id = request.GET.get('projekt_id', None)
        if projekt_id:
                queryset = queryset.filter(projekt_id=projekt_id)

        # Apply filters
        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(projekt_id__icontains=search_value)

        # Paginate queryset
        paginator = ErledigtPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        # Serialize data
        serializer = ErledigtSerializer(paginated_queryset, many=True)
        
        # Return paginated response
        return paginator.get_paginated_response(serializer.data)

    
    def post(self, request):
        serializer = ErledigtSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(Erledigt, pk=pk)
        serializer = ErledigtSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(Erledigt, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class ErledigtUpdateView(APIView):
    """ to pre fill the form while updating erledigt"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Erledigt.objects.filter(id=pk).values('id', 'domain', 'ceo_name', 'email_text', 'projekt_id', 'timestamp').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = ErledigtSerializer(queryset)
            return Response(serializer.data)

        except Erledigt.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)


class ErledigtViewProjectId(APIView):
    """To display project id on hardblacklist templat"""
    def get(self, request, *args, **kwargs):
        try:
            queryset = Erledigt.objects.all()
            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = ErledigtSerializer(queryset, many = True)
            return Response(serializer.data)
        except Erledigt.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)