from django.db import models
from django.utils import timezone

# Create your models here.
class Observation(models.Model):
    # NOTE: The underlying Postgres table has a composite PK (stn_num, utc).
    # Django doesn't support composite primary keys, so we use `seq` as the
    # model primary key since it's unique-indexed in the DB.
    seq = models.IntegerField(primary_key=True)

    stn_num = models.CharField(max_length=255)
    utc = models.DateTimeField()

    air_temp = models.FloatField(blank=True, null=True)
    air_temp_qual = models.TextField(blank=True, null=True)
    pressure = models.FloatField(blank=True, null=True)
    pressure_qual = models.TextField(blank=True, null=True)
    wind_dir = models.IntegerField(blank=True, null=True)
    wind_spd = models.FloatField(blank=True, null=True)
    wind_spd_max = models.FloatField(blank=True, null=True)
    wind_spd_qual = models.TextField(blank=True, null=True)
    wtr_temp = models.FloatField(blank=True, null=True)
    wtr_level = models.FloatField(blank=True, null=True)
    msg_num = models.IntegerField(blank=True, null=True)

    date_created = models.DateTimeField(default=timezone.now, blank=True, null=True)
    date_updated = models.DateTimeField(default=timezone.now, blank=True, null=True)

    air_temp_qc = models.IntegerField(default=0, blank=True, null=True)
    pressure_qc = models.IntegerField(default=0, blank=True, null=True)
    wind_dir_qc = models.IntegerField(default=0, blank=True, null=True)
    wind_spd_qc = models.IntegerField(default=0, blank=True, null=True)
    wind_spd_max_qc = models.IntegerField(default=0, blank=True, null=True)
    wtr_temp_qc = models.IntegerField(default=0, blank=True, null=True)
    wtr_level_qc = models.IntegerField(default=0, blank=True, null=True)

    instrument_num = models.IntegerField(blank=True, null=True)
    battery_voltage = models.FloatField(blank=True, null=True)
    enclosure_temperature = models.FloatField(blank=True, null=True)

    wla_1 = models.FloatField(blank=True, null=True)
    wla_2 = models.FloatField(blank=True, null=True)
    wla_3 = models.FloatField(blank=True, null=True)
    wla_4 = models.FloatField(blank=True, null=True)
    insert_datetime = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "observations"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=["stn_num", "utc"], name="observations_stn_num_utc_uniq"),
        ]
        indexes = [
            models.Index(fields=["stn_num"], name="idx_observations_stn_num"),
            models.Index(fields=["stn_num", "date_updated"], name="observations_update_ndx"),
            models.Index(fields=["utc"], name="observations_utc_ndx"),
        ]

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
    country = models.CharField(max_length=50, blank=True, null=True)
    date_open = models.DateField(blank=True, null=True)
    date_close = models.DateField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    elevation = models.FloatField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    user_id = models.CharField(max_length=100, blank=True, null=True)
    callsign = models.CharField(max_length=100, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    sensor_hierarchy = models.CharField(max_length=100, blank=True, null=True)
    active_sensor = models.IntegerField(blank=True, null=True)
    aac = models.CharField(max_length=100, blank=True, null=True)
    antt = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.ForeignKey(Timezone, on_delete=models.CASCADE, null=True, blank=True, db_column='timezone')
    network = models.CharField(max_length=3, choices=NETWORK_CHOICES, default='aus')


    class Meta:
        db_table = 'stations'


class Holding(models.Model):
    filename = models.CharField(primary_key=True, max_length=255)
    date_created = models.DateTimeField(default=timezone.now, blank=True, null=True)

    class Meta:
        db_table = 'holdings'
        managed = False


class TidePrediction(models.Model):
    # Underlying DB key is (stn_num, utc), but Django needs a single-column PK.
    # We use an `id` surrogate key and keep (stn_num, utc) unique.
    id = models.BigAutoField(primary_key=True)

    stn_num = models.CharField(max_length=255)
    utc = models.DateTimeField()
    prediction = models.FloatField()
    date_created = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "tide_prediction"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=["stn_num", "utc"], name="tide_prediction_stn_num_utc_uniq"),
        ]







