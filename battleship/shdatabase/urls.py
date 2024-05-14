from django.urls import path
from . import views

urlpatterns = [
    path("new-game/<int:player1_id>/<int:player2_id>/<int:num_ships>/<int:board_size>/<str:is_ai_game>", views.new_game, name="new_game"),
    path("confirm-ships/<int:game_id>/<int:player_id>/<ship_board>", views.confirm_ships, name="confirm_ships"),
    path("get-state/<int:game_id>/<int:player_id>", views.get_state, name="get_state"),
    path("fire-shot/<int:game_id>/<int:player_id>/<int:row>/<int:col>", views.fire_shot, name="fire_shot"),
    path("get-player-info/<int:player_id>", views.get_player_info, name="get_player_info")
]



#Example Paths
    # path("", views.StartingPageView.as_view(), name="starting-page"),
    # path("posts", views.AllPostView.as_view(), name="posts-page"),
    # path("posts/<slug:slug>", views.SinglePostView.as_view(),
    #       name="post-detail-page"),
    # path('search/', views.search_view, name='search_view'),
    # path('proposal', views.ProposalPageView.as_view(), name="proposal"),
    # path('music', views.MusicPageView.as_view(), name="music"),