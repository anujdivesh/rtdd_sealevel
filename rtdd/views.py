from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import loader


def index(request):
    return HttpResponse("Hello, world. You're at the rtdd index.")


@login_required
def portal(request):
    template = loader.get_template("rtdd/portal.html")
    context = {}
    return  HttpResponse(template.render(context, request))

def dashboard(request):
    template = loader.get_template("rtdd/dashboard.html")
    context = {}
    return  HttpResponse(template.render(context, request))


def chart(request):
    template = loader.get_template("rtdd/chart.html")
    context = {}
    return HttpResponse(template.render(context, request))

def temperature_chart(request):
    template = loader.get_template("rtdd/temperature-chart.html")
    context = {}
    return HttpResponse(template.render(context, request))

def wind_chart(request):
    template = loader.get_template("rtdd/wind-chart.html")
    context = {}
    return HttpResponse(template.render(context, request))
