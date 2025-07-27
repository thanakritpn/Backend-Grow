// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.postImage.createMany({
//     data: [
//       { post_id: 10, image_url: '/uploads/posts/1750158465957-21-Id1.jpg', created_at: new Date('2025-06-17T11:07:45.987Z') },
//       { post_id: 11, image_url: '/uploads/posts/1750158609506-21-Id2.jpg', created_at: new Date('2025-06-17T11:10:09.576Z') },
//       { post_id: 12, image_url: '/uploads/posts/1750158778883-21-Id3.png', created_at: new Date('2025-06-17T11:12:58.890Z') },
//       { post_id: 13, image_url: '/uploads/posts/1750158896951-21-Id4.jpg', created_at: new Date('2025-06-17T11:14:56.967Z') },
//       { post_id: 14, image_url: '/uploads/posts/1750158957043-21-Id5.jpg', created_at: new Date('2025-06-17T11:15:57.131Z') },
//       { post_id: 15, image_url: '/uploads/posts/1750159069765-21-Id6.jpg', created_at: new Date('2025-06-17T11:17:49.781Z') },
//       { post_id: 16, image_url: '/uploads/posts/1750159463930-21-Id7-2.jpg', created_at: new Date('2025-06-17T11:24:24.022Z') },
//       { post_id: 16, image_url: '/uploads/posts/1750159463931-21-Id7-5.jpg', created_at: new Date('2025-06-17T11:24:24.022Z') },
//       { post_id: 16, image_url: '/uploads/posts/1750159463938-21-Id7-1.jpg', created_at: new Date('2025-06-17T11:24:24.022Z') },
//       { post_id: 17, image_url: '/uploads/posts/1750159586077-21-Id8-2.jpg', created_at: new Date('2025-06-17T11:26:26.094Z') },
//       { post_id: 17, image_url: '/uploads/posts/1750159586079-21-Id8-1.jpg', created_at: new Date('2025-06-17T11:26:26.094Z') },
//       { post_id: 18, image_url: '/uploads/posts/1750159670247-21-Id9.jpg', created_at: new Date('2025-06-17T11:27:50.252Z') },
//       { post_id: 19, image_url: '/uploads/posts/1750159734852-21-Id10.jpg', created_at: new Date('2025-06-17T11:28:54.866Z') },
//       { post_id: 20, image_url: '/uploads/posts/1752850312790-119-Sign in.png', created_at: new Date('2025-07-18T14:51:52.887Z') },
//       { post_id: 20, image_url: '/uploads/posts/1752850312795-119-picture.jpg', created_at: new Date('2025-07-18T14:51:52.887Z') },
//       { post_id: 21, image_url: '/uploads/posts/1752950972454-114-Sign in.png', created_at: new Date('2025-07-19T18:49:32.475Z') },
//       { post_id: 21, image_url: '/uploads/posts/1752950972459-114-picture.jpg', created_at: new Date('2025-07-19T18:49:32.475Z') },
//       { post_id: 22, image_url: '/uploads/posts/1753308945332-134-Shopee-Blog-Cover-Recommend-Portable-Photo-Printer-2022-1024x719.jpg', created_at: new Date('2025-07-23T22:15:45.340Z') },
//       { post_id: 23, image_url: '/uploads/posts/1753309674295-134-ai-generated-8861672_1280.png', created_at: new Date('2025-07-23T22:27:54.314Z') },
//     ],
//     skipDuplicates: true, // กัน insert ซ้ำ
//   });
// }

// main()
//   .then(() => {
//     console.log('✅ Seed completed');
//     return prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error('❌ Seed failed', e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });



import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ✅ User

    await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "PostImage",
      "Post",
      "Category",
      "User"
    RESTART IDENTITY CASCADE;
  `);
  await prisma.user.createMany({
    data: [
      {
        username: 'ArayaTS',
        email: 'araya25466@gmail.com',
        password: '$2b$10$gBcA8d.2PyYqcckrCHCrdOOBHcG1IoZTsavNgxznXLEfG6WStJb9W',
        role: 'USER',
        about_me: 'I love me',
        date_of_birth: new Date('2025-07-29'),
        last_active: new Date('2025-07-23T16:39:40.162Z'),
        created_at: new Date('2025-07-23T16:39:40.162Z'),
        profile_picture: '/uploads/profiles/1753288817782-ai-generated-8861672_1280.png',
        knowledge_interests: ['Language and Communication', 'Technology and Innovation'],
      },
      {
        username: '1233',
        email: 'aofza1509@gmail.com',
        password: '$2b$10$ts7hFzTqIXYfBgKcuDHQFuSMzma1X0r.DyMrOViCYnmOttSyDYz8G',
        role: 'USER',
        about_me: '123',
        date_of_birth: new Date('2025-07-07'),
        last_active: new Date('2025-07-06T15:38:43.4Z'),
        created_at: new Date('2025-07-06T15:38:43.4Z'),
        profile_picture: '/uploads/profiles/1751816349305-Personal.png',
        knowledge_interests: [],
      },
      {
        username: 'user_1752071794946',
        email: 'araya25466@gmil.com',
        password: '$2b$10$/QbmiewLoM1jka0KReWXneoleci0RSblxUVuZbHAekfR90J4YPpEa',
        role: 'GUEST',
        last_active: new Date('2025-07-09T14:36:34.947Z'),
        created_at: new Date('2025-07-09T14:36:34.947Z'),
        knowledge_interests: [],
      },
      {
        username: 'user_1751382319461',
        email: 'aofza1508@gmail.com',
        password: '$2b$10$K7avOHl8i9SvwPJ03KQFO.nKpSXVl3iGE1WacL5nMyAyPzYP/ByAG',
        role: 'USER',
        last_active: new Date('2025-07-01T15:05:19.462Z'),
        created_at: new Date('2025-07-01T15:05:19.462Z'),
        knowledge_interests: [],
      },
      {
        username: 'KateJeeranan',
        email: 'jeeranan.prak@bumail.net',
        password: '$2b$10$M3nYBNQlS3kG4V8rKkbhveV4lmlWr4E74C75pE8kNqGHuMrieRb3W',
        role: 'USER',
        about_me: 'Luv Cat',
        date_of_birth: new Date('2003-10-07'),
        last_active: new Date('2025-07-10T04:38:01.896Z'),
        created_at: new Date('2025-07-10T04:38:01.896Z'),
        profile_picture: '/uploads/profiles/1752122487937-picture.jpeg',
        knowledge_interests: [
          'Music and Arts',
          'Technology and Innovation',
          'Business and Management',
          'Design and Creativity',
          'Language and Communication',
        ],
      },
      {
        username: 'newUser',
        email: 'thanakrit.petn@gmail.com',
        password: '$2b$10$reJ.jxPHwEvtEHqoLvQBo.dxAVuM5r48V0Xoswop7MGwffDxEhsNe',
        role: 'USER',
        about_me: 'I love codingasdasd',
        date_of_birth: new Date('1990-01-01'),
        last_active: new Date('2025-06-11T08:19:16.43Z'),
        created_at: new Date('2025-06-11T08:19:16.43Z'),
        profile_picture: '/uploads/profiles/1750908721199-picture.jpg',
        knowledge_interests: ['AI', 'Blockchain', 'Security'],
      },
    ],
    skipDuplicates: true,
  });

  // ✅ Category
  await prisma.category.createMany({
    data: [
      { name: 'Language and Communication', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Music and Arts', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Technology and Innovation', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Cooking and Baking', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Business and Management', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Science and General Knowledge', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Handicrafts & DIY', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Photography and Videography', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Writing and Editing', created_at: new Date('2025-06-06T12:00:00Z') },
      { name: 'Design and Creativity', created_at: new Date('2025-06-06T12:00:00Z') },
    ],
    skipDuplicates: true,
  });

  // ✅ Post
  await prisma.post.createMany({
    data: [
      { category_id: 1, title: 'Phrases to avoid in English speaking practice', content: "I've noticed that some textbook phrases sound unnatural in real conversations. Here’s what I’ve learned.", created_at: new Date('2025-06-17T11:07:45.966Z'), authorId: 2 },
      { category_id: 2, title: 'Trying abstract painting with limited colors', content: 'Used just red, black, and white for this piece. Surprised how expressive it turned out!', created_at: new Date('2025-06-17T11:10:09.511Z'), authorId: 2 },
      { category_id: 3, title: 'Beginner-friendly tips for building web apps', content: 'Just made a to-do app using HTML, CSS, and JS. Sharing my simple process and code snippets.', created_at: new Date('2025-06-17T11:12:58.887Z'), authorId:4 },
      { category_id: 4, title: 'Recipes that make baking feel effortless', content: 'If you’re new to baking, try this no-mixer chocolate cake. Minimal steps, maximum flavor.', created_at: new Date('2025-06-17T11:14:56.954Z'), authorId: 4 },
      { category_id: 5, title: 'What selling online taught me about trust', content: 'Running a small digital shop taught me how to deal with tough customers and keep things professional.', created_at: new Date('2025-06-17T11:15:57.046Z'), authorId: 2 },
      { category_id: 6, title: 'Science facts that surprised me last week', content: 'Did you know octopuses have three hearts? Sharing cool facts I discovered while reading.', created_at: new Date('2025-06-17T11:17:49.769Z'), authorId: 4 },
      { category_id: 7, title: 'Things I learned from making clay earrings', content: 'Tried DIY earrings with air-dry clay. They turned out cute and I had fun customizing shapes.', created_at: new Date('2025-06-17T11:24:23.94Z'), authorId: 4 },
      { category_id: 8, title: 'Natural light tricks for indoor portraits', content: "No fancy gear needed—just used window light and a reflector. Here's how I set it up.", created_at: new Date('2025-06-17T11:26:26.082Z'), authorId: 4 },
      { category_id: 9, title: 'Common writing mistakes and how to fix them', content: 'These are some habits I had to unlearn when editing blog posts and academic writing.', created_at: new Date('2025-06-17T11:27:50.25Z'), authorId: 2 },
      { category_id: 10, title: 'Design mistakes that weaken brand identity', content: 'Sometimes less is more. I reviewed a few logos and noticed patterns that hurt branding.', created_at: new Date('2025-06-17T11:28:54.855Z'), authorId: 4 },
      { category_id: 6, title: 'My First Post', content: 'aaaaaaaaaa', created_at: new Date('2025-07-18T14:51:52.799Z'), authorId: 2 },
      { category_id: 6, title: 'Guy Post ZGDX ', content: 'aaaaaaaaaa', created_at: new Date('2025-07-19T18:49:32.462Z'), authorId: 2 },
      { category_id: 10, title: 'My design', content: 'Youuu', created_at: new Date('2025-07-23T22:15:45.335Z'), authorId: 4 },
      { category_id: 3, title: 'My Post one', content: 'Hooooo', created_at: new Date('2025-07-23T22:27:54.3Z'), authorId: 4 },
    ],
    skipDuplicates: true,
  });

  // ✅ PostImage (จากที่คุณให้ไว้ก่อนหน้านี้)
  await prisma.postImage.createMany({
    data: [{ post_id: 1, image_url: '/uploads/posts/1750158465957-21-Id1.jpg', created_at: new Date('2025-06-17T11:07:45.987Z') },
       { post_id: 2, image_url: '/uploads/posts/1750158609506-21-Id2.jpg', created_at: new Date('2025-06-17T11:10:09.576Z') },
       { post_id: 3, image_url: '/uploads/posts/1750158778883-21-Id3.png', created_at: new Date('2025-06-17T11:12:58.890Z') },
       { post_id: 4, image_url: '/uploads/posts/1750158896951-21-Id4.jpg', created_at: new Date('2025-06-17T11:14:56.967Z') },
       { post_id: 5, image_url: '/uploads/posts/1750158957043-21-Id5.jpg', created_at: new Date('2025-06-17T11:15:57.131Z') },
       { post_id: 6, image_url: '/uploads/posts/1750159069765-21-Id6.jpg', created_at: new Date('2025-06-17T11:17:49.781Z') },
       { post_id: 7, image_url: '/uploads/posts/1750159463930-21-Id7-2.jpg', created_at: new Date('2025-06-17T11:24:24.022Z') },
       { post_id: 8, image_url: '/uploads/posts/1750159463931-21-Id7-5.jpg', created_at: new Date('2025-06-17T11:24:24.022Z') },
       { post_id: 9, image_url: '/uploads/posts/1750159463938-21-Id7-1.jpg', created_at: new Date('2025-06-17T11:24:24.022Z') },
       { post_id: 10, image_url: '/uploads/posts/1750159586077-21-Id8-2.jpg', created_at: new Date('2025-06-17T11:26:26.094Z') },
       { post_id: 11, image_url: '/uploads/posts/1750159586079-21-Id8-1.jpg', created_at: new Date('2025-06-17T11:26:26.094Z') },
       { post_id: 12, image_url: '/uploads/posts/1750159670247-21-Id9.jpg', created_at: new Date('2025-06-17T11:27:50.252Z') },
       { post_id: 13, image_url: '/uploads/posts/1750159734852-21-Id10.jpg', created_at: new Date('2025-06-17T11:28:54.866Z') },
       { post_id: 14, image_url: '/uploads/posts/1752850312790-119-Sign in.png', created_at: new Date('2025-07-18T14:51:52.887Z') },
       { post_id: 1, image_url: '/uploads/posts/1752850312795-119-picture.jpg', created_at: new Date('2025-07-18T14:51:52.887Z') },
       { post_id: 2, image_url: '/uploads/posts/1752950972454-114-Sign in.png', created_at: new Date('2025-07-19T18:49:32.475Z') },
       { post_id: 3, image_url: '/uploads/posts/1752950972459-114-picture.jpg', created_at: new Date('2025-07-19T18:49:32.475Z') },
       { post_id: 4, image_url: '/uploads/posts/1753308945332-134-Shopee-Blog-Cover-Recommend-Portable-Photo-Printer-2022-1024x719.jpg', created_at: new Date('2025-07-23T22:15:45.340Z') },
       { post_id: 5, image_url: '/uploads/posts/1753309674295-134-ai-generated-8861672_1280.png', created_at: new Date('2025-07-23T22:27:54.314Z') }],
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log('✅ Seed completed');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });
