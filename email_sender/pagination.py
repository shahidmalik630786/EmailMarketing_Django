from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Generalwords, Erledigt

class GeneralWordsPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.get_total_count()
        return Response({
            'draw': self.request.query_params.get('draw', '1'),
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  # Change this if you're implementing filtering
            'data': data,
            'totalPages': self.get_total_pages(total_count),  # Return total pages
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_count(self):
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
        return Erledigt.objects.count()

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