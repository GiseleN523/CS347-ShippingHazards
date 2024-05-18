from django.urls import path
from .views import SignUpView, react_login, react_signup

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("react_login/<str:username>/<str:password>/", react_login, name="react_login"),
    path("react_signup/<str:username>/<str:password1>/<str:password2>/<str:screen_name>/", react_signup, name="react_signup"),
]