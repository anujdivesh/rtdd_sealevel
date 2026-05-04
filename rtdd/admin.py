from django.contrib import admin
from .models import Holding, Observation, Station, TidePrediction, Timezone
# Register your models here.

try:
    from rest_framework.authtoken.models import Token
    from django.contrib.admin.sites import AlreadyRegistered

    try:
        admin.site.register(Token)
    except AlreadyRegistered:
        pass
except Exception:
    # DRF may not be installed in some minimal environments.
    Token = None  # type: ignore

class StationAdmin(admin.ModelAdmin):
    list_display = ('stn_num', 'disp_name',
                    'country', 'stn_name'
                    )


class TimezoneAdmin(admin.ModelAdmin):
    list_display = ('name',)


class HoldingAdmin(admin.ModelAdmin):
    list_display = ("filename", "date_created")
    search_fields = ("filename",)


class ObservationAdmin(admin.ModelAdmin):
    list_display = (
        "stn_num",
        "utc",
        "wtr_level",
        "wtr_temp",
        "air_temp",
        "wind_spd",
        "pressure",
        "seq",
    )
    list_filter = ("stn_num",)
    search_fields = ("stn_num",)
    ordering = ("-utc",)


class TidePredictionAdmin(admin.ModelAdmin):
    list_display = ("stn_num", "utc", "prediction", "date_created")
    list_filter = ("stn_num",)
    search_fields = ("stn_num",)
    ordering = ("-utc",)

admin.site.register(Station, StationAdmin)
admin.site.register(Timezone, TimezoneAdmin)
admin.site.register(Holding, HoldingAdmin)
admin.site.register(Observation, ObservationAdmin)
admin.site.register(TidePrediction, TidePredictionAdmin)
