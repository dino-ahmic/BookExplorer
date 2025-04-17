from rest_framework import serializers
from base.models import Book, BookNote, BookRating, ReadingList
from django.contrib.auth.models import User

class BookSerializer(serializers.ModelSerializer):
    user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_user_rating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                rating = BookRating.objects.get(book=obj, user=request.user)
                return rating.rating
            except BookRating.DoesNotExist:
                return None
        return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class BookNoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = BookNote
        fields = ['id', 'book', 'content', 'created_at', 'updated_at', 'user', 'username']
        read_only_fields = ['created_at', 'updated_at', 'user', 'username']

class BookRatingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = BookRating
        fields = ['id', 'rating', 'created_at', 'username']
        read_only_fields = ['created_at', 'username']

class ReadingListSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = ReadingList
        fields = ['id', 'book', 'added_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user