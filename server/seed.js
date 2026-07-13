/**
 * seed.js - Database seeder script.
 * Populates the database with sample books and an admin user.
 * Can be run standalone (npm run seed) or imported for automatic seeding.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';

dotenv.config();

// ─── Sample Books ─────────────────────────────────────────────────────────────
export const sampleBooks = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    language: 'English',
    description:
      'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices. Would you have done anything different, if you had the chance to undo your regrets?',
    price: 14.99,
    stock: 50,
    coverImageUrl: '/covers/midnight-library.png',
    rating: 4.5,
    numReviews: 12,
    featured: true,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    language: 'English',
    description:
      'Set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs, Dune tells the story of young Paul Atreides, whose family accepts the stewardship of the planet Arrakis.',
    price: 12.99,
    stock: 35,
    coverImageUrl: '/covers/dune.png',
    rating: 4.8,
    numReviews: 18,
    featured: true,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    language: 'English',
    description:
      'No matter your goals, Atomic Habits offers a proven framework for improving — every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    price: 16.99,
    stock: 80,
    coverImageUrl: '/covers/atomic-habits.png',
    rating: 4.9,
    numReviews: 24,
    featured: true,
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    language: 'English',
    description:
      'Ryland Grace is the sole survivor on a desperate last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn\'t know that. He can\'t even remember his own name, let alone the nature of his assignment or how to complete it.',
    price: 15.99,
    stock: 40,
    coverImageUrl: '/covers/project-hail-mary.png',
    rating: 4.7,
    numReviews: 15,
    featured: false,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    language: 'English',
    description:
      'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    price: 17.99,
    stock: 60,
    coverImageUrl: '/covers/sapiens.png',
    rating: 4.6,
    numReviews: 20,
    featured: true,
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    language: 'English',
    description:
      'This is the riveting first-person narrative of Kvothe, a young man who grows to be one of the most notorious magicians his world has ever seen. From his childhood in a troupe of traveling players, to years spent as a near-feral orphan in a crime-ridden city, to his daringly brazen yet successful bid to enter a legendary school of magic.',
    price: 13.99,
    stock: 45,
    coverImageUrl: '/covers/name-of-the-wind.png',
    rating: 4.7,
    numReviews: 16,
    featured: false,
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    language: 'English',
    description:
      'A portrait of the Jazz Age in all of its decadence and excess, The Great Gatsby captured the spirit of the author\'s generation and earned itself a permanent place in American mythology. Self-made, self-invented millionaire Jay Gatsby embodies some of Fitzgerald\'s—and his country\'s—most abiding obsessions: money, ambition, greed, and the promise of new beginnings.',
    price: 9.99,
    stock: 100,
    coverImageUrl: '/covers/midnight-library.png',
    rating: 4.3,
    numReviews: 30,
    featured: false,
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genre: 'Classic',
    language: 'English',
    description:
      'Crime and Punishment focuses on the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg who formulates a plan to kill an unscrupulous pawnbroker for her money.',
    price: 10.99,
    stock: 55,
    coverImageUrl: '/covers/sapiens.png',
    rating: 4.5,
    numReviews: 22,
    featured: false,
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    genre: 'Finance',
    language: 'English',
    description:
      'Timeless lessons on wealth, greed, and happiness. Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people.',
    price: 15.49,
    stock: 70,
    coverImageUrl: '/covers/atomic-habits.png',
    rating: 4.8,
    numReviews: 19,
    featured: true,
  },
  {
    title: 'Ender\'s Game',
    author: 'Orson Scott Card',
    genre: 'Science Fiction',
    language: 'English',
    description:
      'In order to develop a secure defense against a hostile alien race\'s next attack, government agencies breed child geniuses and train them as soldiers. A brilliant young boy, Andrew "Ender" Wiggin lives with his kind but distant parents, his sadistic brother Peter, and the person he loves most, his sister Valentine.',
    price: 11.99,
    stock: 30,
    coverImageUrl: '/covers/project-hail-mary.png',
    rating: 4.6,
    numReviews: 14,
    featured: false,
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    language: 'English',
    description:
      'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University. Educated is an account of the struggle for self-invention. It is a tale of fierce family loyalty and of the grief that comes from severing the closest of ties.',
    price: 13.49,
    stock: 65,
    coverImageUrl: '/covers/name-of-the-wind.png',
    rating: 4.7,
    numReviews: 21,
    featured: false,
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    language: 'English',
    description:
      'Paulo Coelho\'s masterpiece tells the magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.',
    price: 10.49,
    stock: 90,
    coverImageUrl: '/covers/midnight-library.png',
    rating: 4.4,
    numReviews: 35,
    featured: true,
  },
];

// ─── Exportable Seeder Logic ──────────────────────────────────────────────────
export const seedDatabase = async () => {
  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Review.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
  ]);
  console.log('🗑️   Cleared existing data');

  // Create admin user
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@bookstore.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log(`👤  Admin created: ${adminUser.email}`);

  // Create regular test user
  const testUser = await User.create({
    name: 'Jane Reader',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
  });
  console.log(`👤  Test user created: ${testUser.email}`);

  // Seed books
  const createdBooks = await Book.insertMany(sampleBooks);
  console.log(`📚  Seeded ${createdBooks.length} books`);

  // Add sample reviews to first 3 books
  const reviewData = [
    { book: createdBooks[0]._id, rating: 5, comment: 'A beautiful, philosophical story that makes you rethink your life choices. Absolutely loved it!' },
    { book: createdBooks[1]._id, rating: 5, comment: 'A landmark in science fiction. Herbert\'s world-building is unparalleled and the story is deeply political and human.' },
    { book: createdBooks[2]._id, rating: 5, comment: 'Changed how I think about building habits. Incredibly practical with science-backed advice. A must-read!' },
  ];

  for (const rd of reviewData) {
    const review = await Review.create({
      user: testUser._id,
      userName: testUser.name,
      ...rd,
    });
    await Book.findByIdAndUpdate(rd.book, { $push: { reviews: review._id } });
  }
  console.log('⭐  Seeded sample reviews');

  console.log('\n✨  Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin: admin@bookstore.com / admin123');
  console.log('  User:  jane@example.com / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// ─── Standalone Invocation ────────────────────────────────────────────────────
const isStandalone = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed.js');
if (isStandalone) {
  const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';
  mongoose.connect(URI)
    .then(async () => {
      console.log('✅ Connected to MongoDB for seeding');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ MONGODB connection refused:', err.message);
      process.exit(1);
    });
}
