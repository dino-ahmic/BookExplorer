from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from base.models import Book, BookNote, BookRating, ReadingList
from .serializers import BookSerializer, BookNoteSerializer, UserSerializer, UserRegistrationSerializer, BookRatingSerializer, ReadingListSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def getBooks(request):
    books = Book.objects.all()
    
    # Filtering
    title_query = request.query_params.get('title', None)
    author_query = request.query_params.get('author', None)
    genre_query = request.query_params.get('genre', None)
    
    if title_query:
        books = books.filter(title__icontains=title_query)
    if author_query:
        books = books.filter(author__icontains=author_query)
    if genre_query:
        books = books.filter(genre__icontains=genre_query)
    
    # Sorting
    sort_by = request.query_params.get('sort', 'title')
    sort_order = request.query_params.get('order', 'asc')
    
    if sort_order == 'desc':
        sort_by = f'-{sort_by}'
    
    books = books.order_by(sort_by)
    
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getBookById(request, pk):
    try:
        book = Book.objects.get(id=pk)
        serializer = BookSerializer(book, context={'request': request})
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_book_notes(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        notes = BookNote.objects.filter(book=book)
        serializer = BookNoteSerializer(notes, many=True)
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_book_note(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = BookNoteSerializer(data={
        'content': request.data.get('content'),
        'book': book.id,
    })
    
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_note(request, note_id):
    try:
        note = BookNote.objects.get(id=note_id, user=request.user)
        serializer = BookNoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except BookNote.DoesNotExist:
        return Response(
            {"error": "Note not found or you don't have permission to edit it"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_note(request, note_id):
    try:
        note = BookNote.objects.get(id=note_id, user=request.user)
        note.delete()
        return Response({"message": "Note deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except BookNote.DoesNotExist:
        return Response(
            {"error": "Note not found or you don't have permission to delete it"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        rating = int(request.data.get('rating'))
        
        if not 1 <= rating <= 10:
            return Response(
                {"error": "Rating must be between 1 and 10"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_rating = BookRating.objects.filter(book=book, user=request.user).first()
        
        if existing_rating:
            old_rating = existing_rating.rating
            existing_rating.rating = rating
            existing_rating.save()
            
            total_rating = book.average_rating * book.total_ratings
            new_total = total_rating - old_rating + rating
            book.average_rating = new_total / book.total_ratings
            book.save()
            
            serializer = BookRatingSerializer(existing_rating)
            return Response(serializer.data)
        
        new_rating = BookRating.objects.create(
            book=book,
            user=request.user,
            rating=rating
        )
        
        total_rating = book.average_rating * book.total_ratings
        book.total_ratings += 1
        book.average_rating = (total_rating + rating) / book.total_ratings
        book.save()
        
        serializer = BookRatingSerializer(new_rating)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reading_list(request):
    reading_list = ReadingList.objects.filter(user=request.user)
    serializer = ReadingListSerializer(reading_list, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_reading_list(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        reading_list_item, created = ReadingList.objects.get_or_create(
            user=request.user,
            book=book
        )
        if created:
            return Response({"message": "Book added to reading list"}, status=status.HTTP_201_CREATED)
        return Response({"message": "Book already in reading list"}, status=status.HTTP_200_OK)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_reading_list(request, book_id):
    try:
        reading_list_item = ReadingList.objects.get(
            user=request.user,
            book_id=book_id
        )
        reading_list_item.delete()
        return Response({"message": "Book removed from reading list"}, status=status.HTTP_204_NO_CONTENT)
    except ReadingList.DoesNotExist:
        return Response({"error": "Book not found in reading list"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )