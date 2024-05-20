from django.urls import path
from .views import SignUpView, react_login, react_signup, react_change_password

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("react_login/<str:username>/<str:password>/", react_login, name="react_login"),
    path("react_signup/<str:username>/<str:password1>/<str:password2>/<str:screen_name>/", react_signup, name="react_signup"),
    path("react_change_password/<str:username>/<str:current_password>/<str:new_password1>/<str:new_password2>", react_change_password, name="react_change_password")
]