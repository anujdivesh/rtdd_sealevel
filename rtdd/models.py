from django.db import models

# Create your models here.
class Observation(models.Model):
    stn_num = models.CharField()
    utc = models.DateTimeField()
    air_temp = models.FloatField()
    air_temp_qual = models.CharField(max_length=5)
    pressure = models.FloatField()
    pressure_qual = models.CharField(max_length=5)
    wind_dir = models.IntegerField()
    wind_spd = models.FloatField()
    wind_spd_max = models.FloatField()
    wind_spd_qual = models.CharField(max_length=5)
    wtr_temp = models.FloatField()
    wtr_level = models.FloatField()
    msg_num = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    seq = models.IntegerField()
    air_temp_qc = models.IntegerField(default=0)
    pressure_qc = models.IntegerField(default=0)
    wind_dir_qc = models.IntegerField(default=0)
    wind_spd_qc = models.IntegerField(default=0)
    wind_spd_max_qc = models.IntegerField(default=0)
    wtr_temp_qc = models.IntegerField(default=0)
    wtr_level_qc = models.IntegerField(default=0)
    battery_voltage = models.FloatField()
    enclosure_temperature = models.FloatField()
    instrument_num = models.IntegerField()

class Timezone(models.Model):
    name = models.CharField(primary_key=True, max_length=100)


class Station(models.Model):
    NETWORK_CHOICES = [
        ('aus', 'Australia'),
        ('pac', 'Pacific'),
    ]

    stn_num = models.CharField(primary_key=True, max_length=100)
    stn_name = models.CharField(max_length=100)
    disp_name = models.CharField(default="", max_length=100)
    country = models.CharField(max_length=50, blank=True)
    network = models.CharField(max_length=3, choices=NETWORK_CHOICES)
    date_open = models.DateField(blank=True)
    date_close = models.DateField(blank=True)
    longitude = models.FloatField(blank=True)
    latitude = models.FloatField(blank=True)
    elevation = models.FloatField(blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    user_id = models.CharField(max_length=100, blank=True)
    callsign = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    sensor_hierarchy = models.CharField(max_length=100, blank=True)
    active_sensor = models.IntegerField(blank=True)
    aac = models.CharField(max_length=100, blank=True)
    antt = models.CharField(max_length=100, blank=True)
    timezone = models.ForeignKey(Timezone, on_delete=models.CASCADE, null=True, blank=True, db_column='timezone')
    network = models.CharField(
        max_length=3,
        choices=NETWORK_CHOICES,
        default='aus'  # Optional: set a default
    )


    class Meta:
        db_table = 'stations'







