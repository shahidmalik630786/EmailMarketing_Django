from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Project, Settings, Emails, Generalwords, Erledigt, Skipdomain, Fehlerhaft, Keywords, BlacklistKeywords, ImpressumNichtGefunden, ParkingKeywords, Hardblacklist



class ProjectPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count),  
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        return Project.objects.count()


    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None
    

class SettingsPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count),  
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('project_id')
        return Settings.objects.filter(projekt_id=projekt_id).count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None


class EmailPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count),  
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('project_id')
        return Emails.objects.filter(projekt_id=projekt_id).count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None


class HardblacklistPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count),  
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('project_id')
        return Hardblacklist.objects.filter(projekt_id=projekt_id).count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None


class GeneralWordsPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count),  
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        # generalwordsid = self.request.query_params.get('generalwordid')
        # return Generalwords.objects.filter(id=generalwordsid).count()
        return Generalwords.objects.count()


    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None


class ErledigtPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('projekt_id')
        return Erledigt.objects.filter(projekt_id=projekt_id).count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None
    

class SkipDomainPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('projekt_id')
        return Skipdomain.objects.filter(projekt_id=projekt_id).count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None
    

class FehlerhaftPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('projekt_id')
        return Fehlerhaft.objects.filter(projekt_id=projekt_id).count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None
    

class KeywordsPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        # projekt_id = self.request.query_params.get('projekt_id')
        # return Keywords.objects.filter(projekt_id=projekt_id).count()
        return Keywords.objects.values('keyword').count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None
    
class BlacklistKeywordsPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        # projekt_id = self.request.query_params.get('projekt_id')
        # return Keywords.objects.filter(projekt_id=projekt_id).count()
        return BlacklistKeywords.objects.values('keyword').count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None


class ParkingKeywordsPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        # projekt_id = self.request.query_params.get('projekt_id')
        # return Keywords.objects.filter(projekt_id=projekt_id).count()
        return ParkingKeywords.objects.values('keyword').count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None


class ImpressumNichtGefundenPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count), 
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
        projekt_id = self.request.query_params.get('projekt_id')
        return ImpressumNichtGefunden.objects.filter(projekt_id=projekt_id).count()
        # return ImpressumNichtGefunden.objects.values('keyword').count()

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        if self.page.has_next():
            return self.page.next_page_number()
        return None

    def get_previous_page(self):
        if self.page.has_previous():
            return self.page.previous_page_number()
        return None