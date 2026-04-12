"use server";

import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

import connectDB from "@/lib/db";
import UserModel from "@/models/userModel";
import PostModel from "@/models/postModel";
import AudioModel from "@/models/audioModel";
import VideoModel from "@/models/videoModel";
import CommentModel from "@/models/commentModel";

export async function seedDB() {
  try {
    connectDB();

    console.log("Database seeding started...");

    console.log("Creating admin...");
    const admin = new UserModel({
      name: "test admin",
      email: faker.internet
        .email({firstName: "test", lastName: "admin"})
        .toLowerCase(),
      username: faker.internet.username({firstName: "test", lastName: "admin"}),
      password: await bcrypt.hash("test@admin", 10),
      mobileNumber: faker.phone.number({style: "international"}),
      profileImage: {
        public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
        url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        blurHash:
          "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
      },
      coverImage: {
        public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
        url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        blurHash:
          "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
      },
      dob: faker.date
        .past({years: 30, refDate: "2000-01-01"})
        .toISOString()
        .split("T")[0],
      gender: faker.person.sex(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
      addressline: faker.location.streetAddress(),
      role: "admin",
    });
    await admin.save();
    console.log("Created admin.");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const user = new UserModel({
        name: firstName + lastName,
        email: faker.internet.email({firstName, lastName}).toLowerCase(),
        username: faker.internet.username({firstName, lastName}),
        password: await bcrypt.hash(firstName, 10),
        mobileNumber: faker.phone.number({style: "international"}),
        profileImage: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          blurHash:
            "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
        },
        coverImage: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          blurHash:
            "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
        },
        dob: faker.date
          .past({years: 30, refDate: "2000-01-01"})
          .toISOString()
          .split("T")[0],
        gender: faker.person.sex(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zip: faker.location.zipCode(),
        addressline: faker.location.streetAddress(),
        role: "user",
      });
      users.push(await user.save());
    }
    console.log(`Seeded ${users.length} users.`);

    console.log("Seeding posts...");
    const posts = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = faker.helpers.arrayElement(users);

      const post = new PostModel({
        user: randomUser._id,
        title: faker.lorem.paragraph(),
        image: Array.from({length: faker.number.int({min: 1, max: 5})}).map(
          () => ({
            public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
            url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
            blurHash:
              "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
          }),
        ),
        public: true,
      });
      posts.push(await post.save());
    }
    console.log(`Seeded ${posts.length} posts.`);

    console.log("Seeding audios...");
    const audios = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = faker.helpers.arrayElement(users);

      const audio = new AudioModel({
        user: randomUser._id,
        title: faker.lorem.paragraph(),
        audio: {
          url: "https://github.com/anars/blank-audio/blob/master/1-minute-of-silence.mp3",
          public_id: "audio_public_id",
        },
        thumbnail: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          blurHash:
            "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
        },
        public: true,
      });
      audios.push(await audio.save());
    }
    console.log(`Seeded ${audios.length} audios.`);

    console.log("Seeding videos...");
    const videos = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = faker.helpers.arrayElement(users);

      const video = new VideoModel({
        user: randomUser._id,
        title: faker.lorem.paragraph(),
        video: {
          public_id:
            "social-app-nextjs/8ccb1504-72bb-422c-bce1-249c97287396_y2eefg.mp4",
          url: "https://res.cloudinary.com/dzqgzsnoc/video/upload/v1734673644/social-app-nextjs/8ccb1504-72bb-422c-bce1-249c97287396_y2eefg.mp4",
        },
        thumbnail: {
          public_id: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          url: "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          blurHash:
            "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScvPgogICAgICA8L2ZpbHRlcj4KCiAgICAgIDxpbWFnZSBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyBmaWx0ZXI9J3VybCgjYiknIHg9JzAnIHk9JzAnIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGhyZWY9J2RhdGE6aW1hZ2Uvd2VicDtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQU1DQUlBQUFEa2hhcldBQUFCd2tsRVFWUjQybVZRM1dyVVFCUStjMlltazJTTEp1dml1dFZGQkxXMDNvaDRKUWppaFY1WUJHL0VkL0VseEN0ZndXZFFuMERCbHVwYWJRdUxsTEkwcEd3M21XUTNtY3g0NGc5YjhKdGh6Z3p6bmZPZDc3QWdYa05Fem9VRFJBYU5iUmlEckRTUTdjSVNFY0NVd3NXcnR3V1JESGg2eW5CRjJLd0tJbEVlRi9jZlhILzk2bTBZaExXaGZIUUF5cFBmZHZlZWJyNFU1Y0pjdnRRWnJQZVROTy9lOUxNOC81RnNkZU03R3h2clVraFNPd01MOEZGWW5ROVgxMTQ4ZjR6SWFKbkd2UC9ROTZUVVd0TlQrUW9jRUh4ZkxlWWxYUVR0NUNUZi9ycmZqYVA1dkJJQ3FIWnlQUEdrNXlsaU8wUWtZMFJsditWRVp4aU9UNlo3Yjk0QjFBQWNXdXc4Mlh4R29hb001NjJ1ZGN1MmhBcUhMRG5zWGdtUmVkYWFJT3lNOTI4Z0YyUlZTU0Mrc1E1aGFRWDE3TUF4TEkwdEs2TXJwL01jM0lFU3JxallPT1ZIVTBUT0VNOG9JQWhyYXAxT0FNNnB5QTg4MlpZQlU5ZVFhdTRMMnovL3QzdHJiWnNnRmdwaWNmZmhvMTd4Yy92TGQ2MVA2YXVvY0hEQkgvVFlQMWQvQnVXM0NXR3Y3eGlraDVQQ01iY3lERUl6MDFHbUY1KzNkbWltVkJVWjBFbnMwV2dFQUt4MzdaNVVJWEpsVURKWE9XZWdhZExacVRuNkJQOGhYcjMxQys3anZ2alBreFZQQUFBQUFFbEZUa1N1UW1DQycvPiAKICAgIDwvc3ZnPgogIA==",
        },
        public: true,
      });
      videos.push(await video.save());
    }
    console.log(`Seeded ${videos.length} videos.`);

    console.log("Seeding comments...");
    const comments = [];
    for (let i = 0; i < 300; i++) {
      const randomPost = faker.helpers.arrayElement(posts);
      const randomUser = faker.helpers.arrayElement(users);

      const comment = new CommentModel({
        postedBy: randomUser._id,
        postId: randomPost._id,
        message: faker.lorem.sentence(),
      });
      comments.push(await comment.save());
    }
    console.log(`Seeded ${comments.length} comments.`);

    console.log("Database seeding complete!");
  } catch (error: any) {
    throw new Error(`Failed to seed database: ${error.message}`);
  }
}
