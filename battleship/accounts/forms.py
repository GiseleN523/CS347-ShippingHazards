from django import forms
from django.contrib.auth.forms import UserCreationForm
from shdatabase.models import Player


class RegistrationFormForPlayers(UserCreationForm):
    screen_name = forms.CharField(max_length=100)

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            player = Player.objects.create(user=user, screen_name=self.cleaned_data['screen_name'])
        return user