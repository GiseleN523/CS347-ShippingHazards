from django.shortcuts import render
from .forms import RegistrationFormForPlayers
from django.views.generic import CreateView
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.contrib.auth.models import User
from shdatabase.models import Player
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class SignUpView(CreateView):
    form_class = RegistrationFormForPlayers
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

def react_login(request, username, password):
    user = authenticate(username=username, password=password)
    
    if user is not None:
        return JsonResponse({'status': 'success', 'message': 'User authenticated.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid username or password.'})

def react_signup(request, username, password1, password2, screen_name):
    if not User.objects.filter(username=username).exists():
        if password1 == password2: 
            try: 
                validate_password(password1, username)
                user = User.objects.create_user(username=username, password=password1)
                player = Player.objects.create(user=user, screen_name=screen_name)
            except ValidationError as e:
                return JsonResponse({'status': 'error', 'message': e.messages})

            return JsonResponse({'status':'success', 'message':'Look at you go!! You can type the same password TWICE!!'})
        else:
            return JsonResponse({'status':'error', 'message': 'Passwords do not match'})
    else:
        return JsonResponse({'status':'error', 'message': 'User Already Exists. Please Login.'})

def react_change_password(request, username, current_password, new_password1, new_password2):
    user = authenticate(username=username, password=current_password)

    if user is not None:
            if new_password1 == new_password2:
                try:
                    validate_password(new_password1, user)
                    user.set_password(new_password1)
                    user.save()
                    return JsonResponse({'status': 'success', 'message': 'Your password has successfully changed!'})
                except ValidationError as e:
                    return JsonResponse({'status': 'error', 'message': e.messages})
            else:
                return JsonResponse({'status': 'error', 'message': 'Your new passwords do not match.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Your current password is incorrect.'})
