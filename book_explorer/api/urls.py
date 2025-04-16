from django.urls import path
from .import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('books/', views.getBooks, name='get-books'),
    path('books/<int:pk>/', views.getBookById, name='get-book-by-id'),
    path('books/add/', views.addBook, name='add-book'),
    path('books/update/<int:pk>/', views.updateBook, name='update-book'),
    path('books/delete/<int:pk>/', views.deleteBook, name='delete-book'),

    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]