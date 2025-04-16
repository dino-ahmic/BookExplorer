from django.db import migrations
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password

def seed_users_and_notes(apps, schema_editor):
    # Get the models from apps registry
    Book = apps.get_model('base', 'Book')
    BookNote = apps.get_model('base', 'BookNote')
    User = apps.get_model('auth', 'User')
    
    # Create users
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': make_password('testpass123'),  # Hash the password
            'first_name': 'John',
            'last_name': 'Doe'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': make_password('testpass123'),  # Hash the password
            'first_name': 'Jane',
            'last_name': 'Smith'
        },
        {
            'username': 'bob_wilson',
            'email': 'bob@example.com',
            'password': make_password('testpass123'),  # Hash the password
            'first_name': 'Bob',
            'last_name': 'Wilson'
        }
    ]

    created_users = []
    for user_data in users_data:
        # Create user with hashed password
        user = User.objects.create(**user_data)
        created_users.append(user)

    # Create notes for different books
    notes_data = [
        # Notes for "To Kill a Mockingbird" (assuming it's the first book)
        {
            'book_id': 1,
            'user_id': created_users[0].id, 
            'content': "A powerful exploration of racial injustice. The character development of Scout is particularly impressive.",
            'created_at': timezone.now() - timedelta(days=10)
        },
        {
            'book_id': 1,
            'user_id': created_users[0].id,
            'content': "The courtroom scenes are particularly moving. Atticus Finch is an inspiring character.",
            'created_at': timezone.now() - timedelta(days=5)
        },
        {
            'book_id': 1,
            'user_id': created_users[1].id,
            'content': "The perspective of a child narrator adds innocence to this serious topic.",
            'created_at': timezone.now() - timedelta(days=8)
        },

        # Notes for "1984"
        {
            'book_id': 2,
            'user_id': created_users[1].id,
            'content': "The concept of doublethink is particularly relevant in today's political climate.",
            'created_at': timezone.now() - timedelta(days=15)
        },
        {
            'book_id': 2,
            'user_id': created_users[2].id,
            'content': "The surveillance state depicted here feels eerily prophetic.",
            'created_at': timezone.now() - timedelta(days=3)
        },

        # Notes for "The Great Gatsby"
        {
            'book_id': 4,
            'user_id': created_users[0].id,
            'content': "The symbolism of the green light is a masterful literary device.",
            'created_at': timezone.now() - timedelta(days=20)
        },
        {
            'book_id': 4,
            'user_id': created_users[1].id,
            'content': "Fitzgerald's portrayal of the American Dream is both beautiful and tragic.",
            'created_at': timezone.now() - timedelta(days=12)
        },
        {
            'book_id': 4,
            'user_id': created_users[2].id,
            'content': "The party scenes perfectly capture the excess of the Roaring Twenties.",
            'created_at': timezone.now() - timedelta(days=7)
        }
    ]

    for note_data in notes_data:
        book = Book.objects.get(id=note_data['book_id'])
        BookNote.objects.create(
            book_id=note_data['book_id'],
            user_id=note_data['user_id'], 
            content=note_data['content'],
            created_at=note_data['created_at'],
            updated_at=note_data['created_at']
        )

def remove_users_and_notes(apps, schema_editor):
    # Get the models
    BookNote = apps.get_model('base', 'BookNote')
    User = apps.get_model('auth', 'User')
    
    # Delete all notes and users
    BookNote.objects.all().delete()
    User.objects.filter(username__in=['john_doe', 'jane_smith', 'bob_wilson']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('base', '0003_booknote'), 
    ]

    operations = [
        migrations.RunPython(seed_users_and_notes, remove_users_and_notes),
    ]