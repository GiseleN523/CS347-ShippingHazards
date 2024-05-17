from django.shortcuts import render
from .forms import RegistrationFormForPlayers
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy

class SignUpView(CreateView):
    form_class = RegistrationFormForPlayers
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

#Calls the authenticate on the data. 

