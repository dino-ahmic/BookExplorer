from django.urls import path
from .import views

urlpatterns = [
    path('books/', views.getBooks, name='get-books'),
    path('books/<int:pk>/', views.getBookById, name='get-book-by-id'),
    path('books/add/', views.addBook, name='add-book'),
    path('books/update/<int:pk>/', views.updateBook, name='update-book'),
    path('books/delete/<int:pk>/', views.deleteBook, name='delete-book'),
]