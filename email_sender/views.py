from django.shortcuts import render, HttpResponse, get_object_or_404
from rest_framework import viewsets, status
from .models import Project, Settings, Emails, Hardblacklist, Generalwords, Erledigt, Skipdomain, Fehlerhaft, Keywords, BlacklistKeywords, ImpressumNichtGefunden, ParkingKeywords
from .serializers import ProjectSerializer, SettingsSerializer, SettingsSerializerUpdate, EmailSerializer, HardblacklistSerializer, SettingsSerializerdata, GeneralwordsSerializer, ErledigtSerializer, SkipdomainSerializer, FehlerhaftSerializer, KeywordsSerializer, BlacklistKeywordsSerializer, ImpressumNichtGefundenSerializer, ParkingKeywordsSerializer, SettingsSerializerData
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.core.cache import cache
from .pagination import GeneralWordsPageNumberPagination, ErledigtPageNumberPagination, SkipDomainPageNumberPagination, FehlerhaftPageNumberPagination, KeywordsPageNumberPagination, BlacklistKeywordsPageNumberPagination, ImpressumNichtGefundenPageNumberPagination, ParkingKeywordsPageNumberPagination, HardblacklistPageNumberPagination, EmailPageNumberPagination, SettingsPageNumberPagination, ProjectPageNumberPagination
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

def skipdomain(request):
    return render(request, "skipdomain.html")

def fehlerhaft(request):
    return render(request, "fehlerhaft.html")

def keywords(request):
    return render(request, "keywords.html")

def blacklistkeywords(request):
    return render(request, "blacklistkeywords.html")

def impressumnichtgefunden(request):
    return render(request, "impressumnichtgefunden.html")

def parkingkeywords(request):
    return render(request, "parkingkeywords.html")



#PROJECT API
class ProjectView(APIView):
    def get(self, request, *args, **kwargs):
        queryset = Project.objects.all()
        # generalwordid = request.GET.get('generalwordid', None)
        # if generalwordid:
        #         queryset = queryset.filter(id=generalwordid)
        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(name__icontains=search_value)

        paginator = ProjectPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = ProjectSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
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
            # default_value = request.session.get('stored_data', None)
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
        # Base queryset
        queryset = Settings.objects.all()

        projekt_id = request.GET.get('project_id', None)
        if projekt_id:
            queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(absender_name__icontains=search_value)
        
        paginator = SettingsPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = SettingsSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
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
                'absender_email', 'smtp_email', 'smtp_name', 'smtp_password', 'smtp_server', 'smtp_port', 
                'arbeitsaufgabe', 'betreff_aufgabe', 'token_limit', 'api_key', 'absender_homepage', 
                'bcc_email_1', 'bcc_email_2', 'wait_time', 'send_start_hour', 'send_end_hour', 
                'max_workers', 'debug', 'projekt_id', 'ssl_tls'
            ).first() 

            if not settings:
                return Response({'error': 'Settings not found'}, status=404)
            
            serializer = SettingsSerializerData(settings)
            return Response(serializer.data)

        except Settings.DoesNotExist:
            return Response({'error': 'Settings not found'}, status=404)
        
# class SettingsViewProjectId(APIView):
#     """To display project id on settings template"""
#     def get(self, request, *args, **kwargs):
#         try:
#             default_value = request.session.get('project_id', None)
#             settings = Settings.objects.all()
#             if not settings:
#                 return Response({'error': 'Settings not found'}, status=404)
            
#             serializer = SettingsSerializerdata(settings, many = True)
#             return Response({
#                 'default_value': default_value,
#                 'settings': serializer.data
#             })
#             # return Response(serializer.data)
#         except Settings.DoesNotExist:
#             return Response({'error': 'Settings not found'}, status=404)

    
#EMAIL API
class EmailView(APIView):
    """CRUD for Email"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Emails.objects.all()

        projekt_id = request.GET.get('project_id', None)
        if projekt_id:
            queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(ceo_name__icontains=search_value)

        print(queryset, "******queryset*****")

        paginator = EmailPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = EmailSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
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


# class EmailViewProjectId(APIView):
#     """To display project id on email templat"""
#     def get(self, request, *args, **kwargs):
#         try:
#             emails = Emails.objects.all()
#             if not emails:
#                 return Response({'error': 'Emails not found'}, status=404)
            
#             serializer = EmailSerializer(emails, many = True)
#             return Response(serializer.data)
#         except Emails.DoesNotExist:
#             return Response({'error': 'Emails not found'}, status=404)


#HARDBLACKLIST API
class HardblacklistView(APIView):
    """CRUD for hardblacklist"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Hardblacklist.objects.all()

        projekt_id = request.GET.get('project_id', None)
        if projekt_id:
                queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(domain__icontains=search_value)

        paginator = HardblacklistPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = HardblacklistSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
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


# class HardblacklistViewProjectId(APIView):
#     """To display project id on hardblacklist templat"""
#     def get(self, request, *args, **kwargs):
#         try:
#             hardblacklist = Hardblacklist.objects.all()
#             if not hardblacklist:
#                 return Response({'error': 'Emails not found'}, status=404)
            
#             serializer = HardblacklistSerializer(hardblacklist, many = True)
#             return Response(serializer.data)
#         except Hardblacklist.DoesNotExist:
#             return Response({'error': 'Emails not found'}, status=404)
        

#GENERALS WORD API
class GeneralWordView(APIView):
    """CRUD for hardblacklist"""

    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Generalwords.objects.all()

        # generalwordid = request.GET.get('generalwordid', None)
        # if generalwordid:
        #         queryset = queryset.filter(id=generalwordid)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(word__icontains=search_value)

        paginator = GeneralWordsPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = GeneralwordsSerializer(paginated_queryset, many=True)
        
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


# class GeneralwordViewProjectId(APIView):
#     """To display project id on hardblacklist templat"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = Generalwords.objects.all()
#             if not queryset:
#                 return Response({'error': 'Emails not found'}, status=404)
            
#             serializer = GeneralwordsSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except Generalwords.DoesNotExist:
#             return Response({'error': 'Emails not found'}, status=404)
        

#Erledigt WORD API
class ErledigtView(APIView):
    """CRUD for Erledigt"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Erledigt.objects.all()

        projekt_id = request.GET.get('projekt_id', None)
        if projekt_id:
                queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(domain__icontains=search_value)

        paginator = ErledigtPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = ErledigtSerializer(paginated_queryset, many=True)
        
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
    """ to pre fill the form while updating Erledigt"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Erledigt.objects.filter(id=pk).values('id', 'domain', 'ceo_name', 'email_text', 'projekt_id', 'timestamp').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = ErledigtSerializer(queryset)
            return Response(serializer.data)

        except Erledigt.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)


# class ErledigtViewProjectId(APIView):
#     """To display project id on Erledigt templat"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = Erledigt.objects.all()
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = ErledigtSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except Erledigt.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)
        

#Skip Domain API
class SkipDomainView(APIView):
    """CRUD for skip domain"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = Skipdomain.objects.all()

        projekt_id = request.GET.get('projekt_id', None)
        if projekt_id:
                queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(domain__icontains=search_value)

        paginator = SkipDomainPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = SkipdomainSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = SkipdomainSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(Skipdomain, pk=pk)
        serializer = SkipdomainSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(Skipdomain, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class SkipDomainUpdateView(APIView):
    """ to pre fill the form while updating skip domain"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Skipdomain.objects.filter(id=pk).values('domain', 'projekt_id').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = SkipdomainSerializer(queryset)
            return Response(serializer.data)

        except Skipdomain.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)
    

# class SkipDomainViewProjectId(APIView):
#     """To display project id on skip domain"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = Skipdomain.objects.all()
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = SkipdomainSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except Skipdomain.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)
        

#Fehlerhaft API
class FehlerhaftView(APIView):
    """CRUD for Fehlerhaft"""
    def get(self, request, *args, **kwargs):
        queryset = Fehlerhaft.objects.values('id', 'domain', 'projekt_id')

        projekt_id = request.GET.get('projekt_id', None)
        if projekt_id:
                queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(domain__icontains=search_value)

        paginator = FehlerhaftPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = FehlerhaftSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = FehlerhaftSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(Fehlerhaft, pk=pk)
        serializer = FehlerhaftSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(Fehlerhaft, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class FehlerhaftUpdateView(APIView):
    """ to pre fill the form while updating skip domain"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Fehlerhaft.objects.filter(id=pk).values('domain', 'projekt_id').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = FehlerhaftSerializer(queryset)
            return Response(serializer.data)

        except Fehlerhaft.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)
    

# class FehlerhaftViewProjectId(APIView):
#     """To display project id on skip domain"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = Fehlerhaft.objects.values('id', 'domain', 'projekt_id')
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = FehlerhaftSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except Fehlerhaft.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)
        

#Keyword API
class KeywordsView(APIView):
    """CRUD for Keyword"""
    def get(self, request, *args, **kwargs):
        queryset = Keywords.objects.values('id', 'keyword')

        # projekt_id = request.GET.get('projekt_id', None)
        # if projekt_id:
        #         queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(keyword__icontains=search_value)

        paginator = KeywordsPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = KeywordsSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = KeywordsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(Keywords, pk=pk)
        serializer = KeywordsSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(Keywords, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class KeywordsUpdateView(APIView):
    """ to pre fill the form while updating Keyword"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Keywords.objects.filter(id=pk).values('id', 'keyword').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = KeywordsSerializer(queryset)
            return Response(serializer.data)

        except Keywords.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)
    

# class KeywordsViewProjectId(APIView):
#     """To display project id on Keyword"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = Keywords.objects.values('id', 'keyword')
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = KeywordsSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except Keywords.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)
        

#Blacklist Keywords API
class BlacklistKeywordsView(APIView):
    """CRUD for Blacklist Keyword"""
    def get(self, request, *args, **kwargs):
        queryset = BlacklistKeywords.objects.values('id', 'keyword')

        # projekt_id = request.GET.get('projekt_id', None)
        # if projekt_id:
        #         queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(keyword__icontains=search_value)

        paginator = BlacklistKeywordsPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = BlacklistKeywordsSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = BlacklistKeywordsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(BlacklistKeywords, pk=pk)
        serializer = BlacklistKeywordsSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(BlacklistKeywords, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class BlacklistKeywordsUpdateView(APIView):
    """ to pre fill the form while updating Blacklist Keyword"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = BlacklistKeywords.objects.filter(id=pk).values('id', 'keyword').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = BlacklistKeywordsSerializer(queryset)
            return Response(serializer.data)

        except BlacklistKeywords.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)
    

# class BlacklistKeywordsViewProjectId(APIView):
#     """To display project id on Blacklist Keyword"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = BlacklistKeywords.objects.values('id', 'keyword')
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = BlacklistKeywordsSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except BlacklistKeywords.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)
        

#ParkingKeywords API
class ParkingKeywordsView(APIView):
    """CRUD for Blacklist Keyword"""
    def get(self, request, *args, **kwargs):
        queryset = ParkingKeywords.objects.values('id', 'keyword')

        # projekt_id = request.GET.get('projekt_id', None)
        # if projekt_id:
        #         queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(keyword__icontains=search_value)

        paginator = ParkingKeywordsPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = ParkingKeywordsSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = ParkingKeywordsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(ParkingKeywords, pk=pk)
        serializer = ParkingKeywordsSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(ParkingKeywords, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class ParkingKeywordsUpdateView(APIView):
    """ to pre fill the form while updating Blacklist Keyword"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = ParkingKeywords.objects.filter(id=pk).values('id', 'keyword').first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = ParkingKeywordsSerializer(queryset)
            return Response(serializer.data)

        except ParkingKeywords.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)
    

# class ParkingKeywordsViewProjectId(APIView):
#     """To display project id on Blacklist Keyword"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = ParkingKeywords.objects.values('id', 'keyword')
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = ParkingKeywordsSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except ParkingKeywords.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)
        

#Impressumnichtgefunden API
class ImpressumnichtgefundenView(APIView):
    """CRUD for Impressumnichtgefunden"""
    def get(self, request, *args, **kwargs):
        # Base queryset
        queryset = ImpressumNichtGefunden.objects.all()

        projekt_id = request.GET.get('projekt_id', None)
        if projekt_id:
                queryset = queryset.filter(projekt_id=projekt_id)

        search_value = request.GET.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(domain__contains=search_value)

        paginator = ImpressumNichtGefundenPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = ImpressumNichtGefundenSerializer(paginated_queryset, many=True)
        
        return paginator.get_paginated_response(serializer.data)

    
    def post(self, request):
        serializer = ImpressumNichtGefundenSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mag": "Data added sucessfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None):
        queryset = get_object_or_404(ImpressumNichtGefunden, pk=pk)
        serializer = ImpressumNichtGefundenSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Data updated successfully"}, status = status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = get_object_or_404(ImpressumNichtGefunden, pk=pk)
        queryset.delete()
        return Response({"msg":"Data deleted Successfully"}, status = status.HTTP_204_NO_CONTENT)


class ImpressumNichtGefundenUpdateView(APIView):
    """ to pre fill the form while updating Impressumnichtgefunden"""
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = ImpressumNichtGefunden.objects.filter(id=pk).values("id", "domain", "projekt_id", "timestamp").first() 

            if not queryset:
                return Response({'error': 'Data not found'}, status=404)
            
            serializer = ImpressumNichtGefundenSerializer(queryset)
            return Response(serializer.data)

        except ImpressumNichtGefunden.DoesNotExist:
            return Response({'error': 'Data not found'}, status=404)


# class ImpressumNichtGefundenViewProjectId(APIView):
#     """To display project id on Impressumnichtgefunden templat"""
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = ImpressumNichtGefunden.objects.all()
#             if not queryset:
#                 return Response({'error': 'Data not found'}, status=404)
            
#             serializer = ImpressumNichtGefundenSerializer(queryset, many = True)
#             return Response(serializer.data)
#         except ImpressumNichtGefunden.DoesNotExist:
#             return Response({'error': 'Data not found'}, status=404)