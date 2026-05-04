from django.urls import path

from . import api_views

urlpatterns = [
    path("stations/", api_views.stations, name="api_stations"),
    path("holdings/", api_views.holdings, name="api_holdings"),
    path("observations/", api_views.observations, name="api_observations"),
    path("get_obs", api_views.get_obs, name="api_get_obs"),
    path("get_latest_obs", api_views.get_latest_obs, name="api_get_latest_obs"),
    path("tide_prediction/", api_views.tide_prediction, name="api_tide_prediction"),
]
