from django.urls import path
from .views import SignUpView


urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("react_login/<str:username>/<str:password>", views.new_game, name="new_game"),
]