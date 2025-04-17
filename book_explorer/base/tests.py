from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date
from base.models import Book, BookNote, BookRating, ReadingList

class ModelTests(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )

        # Create test book
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            publication_date=date(2023, 1, 1),
            isbn="1234567890123",
            genre="Fiction",
            short_description="Test description",
            page_count=200,
            average_rating=0.0,
            total_ratings=0
        )

        # Create test note
        self.note = BookNote.objects.create(
            user=self.user,
            book=self.book,
            content="Test note content"
        )

        # Create test rating
        self.rating = BookRating.objects.create(
            user=self.user,
            book=self.book,
            rating=8
        )

        # Create test reading list entry
        self.reading_list = ReadingList.objects.create(
            user=self.user,
            book=self.book
        )

    def test_book_model(self):
        self.assertEqual(str(self.book), "Test Book")
        self.assertEqual(self.book.author, "Test Author")
        self.assertEqual(self.book.isbn, "1234567890123")

    def test_book_note_model(self):
        self.assertEqual(self.note.content, "Test note content")
        self.assertEqual(self.note.user, self.user)
        self.assertEqual(self.note.book, self.book)

    def test_book_rating_model(self):
        self.assertEqual(self.rating.rating, 8)
        self.assertEqual(self.rating.user, self.user)
        self.assertEqual(self.rating.book, self.book)

    def test_reading_list_model(self):
        self.assertEqual(self.reading_list.user, self.user)
        self.assertEqual(self.reading_list.book, self.book)

class APITests(APITestCase):
    def setUp(self):
        # Clear existing data
        Book.objects.all().delete()
        BookRating.objects.all().delete()
        BookNote.objects.all().delete()
        User.objects.all().delete()
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Create test book
        self.book = Book.objects.create(
            title="Test Book",
            author="Test Author",
            publication_date=date(2023, 1, 1),
            isbn="1234567890123",
            genre="Fiction",
            short_description="Test description",
            page_count=200
        )

    def test_get_books_list(self):
        response = self.client.get('/api/books/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_get_book_detail(self):
        response = self.client.get(f'/api/books/{self.book.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test Book")

    def test_book_notes_crud(self):
        # Test creating a note (authenticated)
        self.client.force_authenticate(user=self.user)
        create_response = self.client.post(
            f'/api/books/{self.book.id}/notes/create/',
            {'content': 'Test note content'}
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        # Get the created note's ID
        note_id = create_response.data['id']

        # Test getting notes
        get_response = self.client.get(f'/api/books/{self.book.id}/notes/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(get_response.data) > 0)

        # Test updating a note
        update_response = self.client.put(
            f'/api/notes/{note_id}/update/',
            {'content': 'Updated content'}
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data['content'], 'Updated content')

        # Test deleting a note
        delete_response = self.client.delete(f'/api/notes/{note_id}/delete/')
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

    def test_rate_book(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/books/{self.book.id}/rate/',
            {'rating': 8}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        rating = BookRating.objects.filter(book=self.book, user=self.user).first()
        self.assertIsNotNone(rating)
        self.assertEqual(rating.rating, 8)

    def test_reading_list_operations(self):
        self.client.force_authenticate(user=self.user)
        
        # Test adding to reading list
        add_response = self.client.post(f'/api/reading-list/add/{self.book.id}/')
        self.assertEqual(add_response.status_code, status.HTTP_201_CREATED)

        # Test getting reading list
        get_response = self.client.get('/api/reading-list/')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(get_response.data) > 0)

        # Test removing from reading list
        remove_response = self.client.delete(f'/api/reading-list/remove/{self.book.id}/')
        self.assertEqual(remove_response.status_code, status.HTTP_204_NO_CONTENT)

    def test_authentication_required(self):
        # Test creating note without authentication
        response = self.client.post(
            f'/api/books/{self.book.id}/notes/create/',
            {'content': 'Test note content'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_rating(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/books/{self.book.id}/rate/',
            {'rating': 11}  # Invalid rating > 10
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_book_filtering(self):
        response = self.client.get('/api/books/', {'title': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

        response = self.client.get('/api/books/', {'author': 'Test Author'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def tearDown(self):
        # Clean up after each test
        Book.objects.all().delete()
        BookRating.objects.all().delete()
        BookNote.objects.all().delete()
        User.objects.all().delete()