from django.urls import path
from django.views.generic.base import TemplateView
from django.http import HttpResponse

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("portal", views.portal, name="portal"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("chart", views.chart, name="chart"),
    path("temperature-chart", views.temperature_chart, name="temperature_chart"),
    path("wind-chart", views.wind_chart, name="wind_chart"),
    path("health", lambda req: HttpResponse(status=200)),
]
