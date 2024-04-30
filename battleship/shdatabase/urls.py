from django.urls import path
from . import views

urlpatterns = [
    path("newgame/<int:player1id>/<int:player2id>/<int:num_ships>", views.new_game, name="new_game")
]



#Example Paths
    # path("", views.StartingPageView.as_view(), name="starting-page"),
    # path("posts", views.AllPostView.as_view(), name="posts-page"),
    # path("posts/<slug:slug>", views.SinglePostView.as_view(),
    #       name="post-detail-page"),
    # path('search/', views.search_view, name='search_view'),
    # path('proposal', views.ProposalPageView.as_view(), name="proposal"),
    # path('music', views.MusicPageView.as_view(), name="music"),