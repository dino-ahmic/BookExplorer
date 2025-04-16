from django.db import migrations
from datetime import date

def seed_books(apps, schema_editor):
    Book = apps.get_model('base', 'Book')
    
    books_data = [
        {
            'title': "To Kill a Mockingbird",
            'author': "Harper Lee",
            'publication_date': date(1960, 7, 11),
            'isbn': "9780061120084",
            'genre': "Fiction",
            'short_description': "A novel about the serious issues of rape and racial inequality told through the eyes of a young girl.",
            'page_count': 281
        },
        {
            'title': "1984",
            'author': "George Orwell",
            'publication_date': date(1949, 6, 8),
            'isbn': "9780451524935",
            'genre': "Dystopian",
            'short_description': "A dystopian novel set in a totalitarian society under constant surveillance.",
            'page_count': 328
        },
        {
            'title': "Pride and Prejudice",
            'author': "Jane Austen",
            'publication_date': date(1813, 1, 28),
            'isbn': "9780141439518",
            'genre': "Romance",
            'short_description': "A classic novel about love, class, and social expectations in 19th-century England.",
            'page_count': 279
        },
        {
            'title': "The Great Gatsby",
            'author': "F. Scott Fitzgerald",
            'publication_date': date(1925, 4, 10),
            'isbn': "9780743273565",
            'genre': "Classic",
            'short_description': "A story of the mysterious Jay Gatsby and his unrelenting passion for Daisy Buchanan.",
            'page_count': 180
        },
        {
            'title': "The Catcher in the Rye",
            'author': "J.D. Salinger",
            'publication_date': date(1951, 7, 16),
            'isbn': "9780316769488",
            'genre': "Fiction",
            'short_description': "A novel about teenage rebellion and alienation, narrated by Holden Caulfield.",
            'page_count': 214
        },
        {
            'title': "The Hobbit",
            'author': "J.R.R. Tolkien",
            'publication_date': date(1937, 9, 21),
            'isbn': "9780547928227",
            'genre': "Fantasy",
            'short_description': "A fantasy novel about the adventures of Bilbo Baggins, a hobbit who embarks on a quest to help a group of dwarves reclaim their mountain home.",
            'page_count': 310
        },
        {
            'title': "Harry Potter and the Philosopher's Stone",
            'author': "J.K. Rowling",
            'publication_date': date(1997, 6, 26),
            'isbn': "9780747532699",
            'genre': "Fantasy",
            'short_description': "The first book in the Harry Potter series, following a young wizard's first year at Hogwarts School of Witchcraft and Wizardry.",
            'page_count': 223
        },
        {
            'title': "The Da Vinci Code",
            'author': "Dan Brown",
            'publication_date': date(2003, 3, 18),
            'isbn': "9780307474278",
            'genre': "Thriller",
            'short_description': "A mystery thriller involving a Harvard professor's quest to uncover religious secrets while evading a mysterious killer.",
            'page_count': 454
        },
        {
            'title': "The Alchemist",
            'author': "Paulo Coelho",
            'publication_date': date(1988, 1, 1),
            'isbn': "9780062315007",
            'genre': "Fiction",
            'short_description': "A philosophical novel about a young Andalusian shepherd who travels to Egypt in search of treasure and his personal legend.",
            'page_count': 197
        },
        {
            'title': "The Lord of the Rings",
            'author': "J.R.R. Tolkien",
            'publication_date': date(1954, 7, 29),
            'isbn': "9780618640157",
            'genre': "Fantasy",
            'short_description': "An epic high-fantasy novel that follows the quest to destroy a powerful ring and defeat the Dark Lord Sauron.",
            'page_count': 1178
        },
        {
            'title': "The Hunger Games",
            'author': "Suzanne Collins",
            'publication_date': date(2008, 9, 14),
            'isbn': "9780439023481",
            'genre': "Young Adult",
            'short_description': "In a dystopian future, a young woman fights for survival in a televised competition where teenagers must fight to the death.",
            'page_count': 374
        },
        {
            'title': "The Girl with the Dragon Tattoo",
            'author': "Stieg Larsson",
            'publication_date': date(2005, 8, 1),
            'isbn': "9780307454546",
            'genre': "Crime Thriller",
            'short_description': "A journalist and a young computer hacker investigate a decades-old disappearance, uncovering dark secrets.",
            'page_count': 672
        },
        {
            'title': "The Road",
            'author': "Cormac McCarthy",
            'publication_date': date(2006, 9, 26),
            'isbn': "9780307387899",
            'genre': "Post-apocalyptic",
            'short_description': "A father and son journey through a post-apocalyptic America, struggling to survive while maintaining their humanity.",
            'page_count': 287
        },
        {
            'title': "Life of Pi",
            'author': "Yann Martel",
            'publication_date': date(2001, 9, 11),
            'isbn': "9780156027328",
            'genre': "Adventure",
            'short_description': "A young man survives a shipwreck and spends 227 days on a lifeboat with a Bengal tiger.",
            'page_count': 460
        },
        {
            'title': "The Kite Runner",
            'author': "Khaled Hosseini",
            'publication_date': date(2003, 5, 29),
            'isbn': "9781594631931",
            'genre': "Historical Fiction",
            'short_description': "A story of friendship, betrayal, and redemption set against the backdrop of Afghanistan's tumultuous history.",
            'page_count': 371
        },
        {
            'title': "Gone Girl",
            'author': "Gillian Flynn",
            'publication_date': date(2012, 6, 5),
            'isbn': "9780307588371",
            'genre': "Psychological Thriller",
            'short_description': "A psychological thriller about a woman's disappearance and the dark secrets that emerge during the investigation.",
            'page_count': 432
        },
        {
            'title': "The Martian",
            'author': "Andy Weir",
            'publication_date': date(2011, 9, 27),
            'isbn': "9780553418026",
            'genre': "Science Fiction",
            'short_description': "An astronaut must survive alone on Mars using his wit and engineering skills after being accidentally left behind.",
            'page_count': 369
        },
        {
            'title': "The Silent Patient",
            'author': "Alex Michaelides",
            'publication_date': date(2019, 2, 5),
            'isbn': "9781250301697",
            'genre': "Psychological Thriller",
            'short_description': "A woman shoots her husband and never speaks again, becoming the focus of a criminal psychotherapist's investigation.",
            'page_count': 325
        },
        {
            'title': "Dune",
            'author': "Frank Herbert",
            'publication_date': date(1965, 8, 1),
            'isbn': "9780441172719",
            'genre': "Science Fiction",
            'short_description': "A complex science fiction epic set on a desert planet, involving politics, religion, and giant sandworms.",
            'page_count': 412
        },
        {
            'title': "The Handmaid's Tale",
            'author': "Margaret Atwood",
            'publication_date': date(1985, 6, 1),
            'isbn': "9780385490818",
            'genre': "Dystopian",
            'short_description': "In a dystopian future, women are stripped of their rights and forced into reproductive servitude.",
            'page_count': 311
        }
    ]

    for book_data in books_data:
        Book.objects.create(**book_data)

def remove_books(apps, schema_editor):
    Book = apps.get_model('base', 'Book')
    Book.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_books, remove_books),
    ]