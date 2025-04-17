from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publication_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    genre = models.CharField(max_length=100)
    short_description = models.TextField() 
    page_count = models.PositiveIntegerField()
    average_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    total_ratings = models.PositiveIntegerField(default=0)
    about = models.TextField(default='')

    def __str__(self):
        return self.title
    
class BookNote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note by {self.user.username} for {self.book.title}"

    class Meta:
        ordering = ['-created_at']

class BookRating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 11)]) 
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('book', 'user')  

    def __str__(self):
        return f"{self.user.username}'s rating for {self.book.title}"
    
class ReadingList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username}'s reading list - {self.book.title}"