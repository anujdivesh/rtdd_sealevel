from django.contrib import admin
from .models import  Station, Timezone
# Register your models here.

class StationAdmin(admin.ModelAdmin):
    list_display = ('stn_num', 'disp_name',
                    'country', 'stn_name'
                    )


class TimezoneAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(Station, StationAdmin)
admin.site.register(Timezone, TimezoneAdmin)
