from django.urls import path
from .import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('books/', views.getBooks, name='get-books'),
    path('books/<int:pk>/', views.getBookById, name='get-book-by-id'),
    path('books/add/', views.addBook, name='add-book'),
    path('books/update/<int:pk>/', views.updateBook, name='update-book'),
    path('books/delete/<int:pk>/', views.deleteBook, name='delete-book'),

    path('books/<int:book_id>/notes/', views.get_book_notes, name='get-book-notes'),
    path('books/<int:book_id>/notes/create/', views.create_book_note, name='create-book-note'),
    path('notes/<int:note_id>/update/', views.update_note, name='update-note'),
    path('notes/<int:note_id>/delete/', views.delete_note, name='delete-note'),

    path('books/<int:book_id>/rate/', views.rate_book, name='rate-book'),

    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]