from django.db import migrations
from django.utils import timezone
import random

def seed_ratings(apps, schema_editor):
    Book = apps.get_model('base', 'Book')
    BookRating = apps.get_model('base', 'BookRating')
    User = apps.get_model('auth', 'User')
    
    # Get all books and users
    books = Book.objects.all()
    users = User.objects.filter(username__in=['john_doe', 'jane_smith', 'bob_wilson'])
    
    # Create ratings for each user and book
    for user in users:
        for book in books:
            # Generate a random rating between 1 and 10
            rating = random.randint(1, 10)
            
            BookRating.objects.create(
                user=user,
                book=book,
                rating=rating,
                created_at=timezone.now()
            )
            
            # Update book's average rating and total ratings
            book_ratings = BookRating.objects.filter(book=book)
            total_ratings = book_ratings.count()
            average_rating = sum(r.rating for r in book_ratings) / total_ratings
            
            book.average_rating = round(average_rating, 1)
            book.total_ratings = total_ratings
            book.save()

def remove_ratings(apps, schema_editor):
    BookRating = apps.get_model('base', 'BookRating')
    Book = apps.get_model('base', 'Book')
    
    # Delete all ratings
    BookRating.objects.all().delete()
    
    # Reset book rating statistics
    Book.objects.all().update(average_rating=0, total_ratings=0)

class Migration(migrations.Migration):
    dependencies = [
        ('base', '0005_book_average_rating_book_total_ratings_bookrating'), 
    ]

    operations = [
        migrations.RunPython(seed_ratings, remove_ratings),
    ]