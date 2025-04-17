from django.contrib import admin
from .models import Book, BookNote, BookRating, ReadingList

admin.site.register(Book)
admin.site.register(BookNote)
admin.site.register(BookRating)
admin.site.register(ReadingList)
