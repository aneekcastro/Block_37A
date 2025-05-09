const db = require('./client');
const { hashPassword } = require('../utils/hash');
const { faker } = require('@faker-js/faker');

async function seed() {
  try {
    console.log('Seeding database...');

    await db.query('DELETE FROM comments');
    await db.query('DELETE FROM reviews');
    await db.query('DELETE FROM items');
    await db.query('DELETE FROM users');

    const users = [];
    for (let i = 0; i < 10; i++) {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password_hash = await hashPassword('password123');
      const { rows } = await db.query(
        `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
        [username, email, password_hash]
      );
      users.push(rows[0]);
    }

    const items = [];
    for (let i = 0; i < 30; i++) {
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const { rows } = await db.query(
        `INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *`,
        [name, description]
      );
      items.push(rows[0]);
    }

    const reviews = [];
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      const item = faker.helpers.arrayElement(items);
      const text = faker.lorem.sentences();
      const rating = faker.number.int({ min: 1, max: 5 });

      try {
        const { rows } = await db.query(
          `INSERT INTO reviews (user_id, item_id, text, rating) VALUES ($1, $2, $3, $4) RETURNING *`,
          [user.id, item.id, text, rating]
        );
        reviews.push(rows[0]);
      } catch (err) {
        console.log('Duplicate review skipped');
      }
    }

    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(users);
      const review = faker.helpers.arrayElement(reviews);
      const text = faker.lorem.sentence();

      await db.query(
        `INSERT INTO comments (review_id, user_id, text) VALUES ($1, $2, $3)`,
        [review.id, user.id, text]
      );
    }

    console.log('Database seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
