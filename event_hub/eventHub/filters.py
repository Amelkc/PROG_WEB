import django_filters
from .models import Event

class EventFilter(django_filters.FilterSet):
    #filter by date
    start = django_filters.DateFilter(field_name='start_datetime', lookup_expr='date')
    end = django_filters.DateFilter(field_name='end_datetime', lookup_expr='date')
    #filter by date range on startdatetime "?date_from=...&date_to=.."
    date_from = django_filters.DateFilter(field_name='start_datetime', lookup_expr='date__gte')
    date_to   = django_filters.DateFilter(field_name='start_datetime', lookup_expr='date__lte')

    class Meta:
        model = Event
        fields = ['status', 'start', 'end', 'date_from', 'date_to']