require('dotenv/config');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const img = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(18, 30, 0, 0);
  return d;
};

const CATEGORIES = [
  { name: 'Music', icon: 'music' },
  { name: 'Technology', icon: 'cpu' },
  { name: 'Business', icon: 'briefcase' },
  { name: 'Arts & Culture', icon: 'palette' },
  { name: 'Sports', icon: 'trophy' },
  { name: 'Food & Drink', icon: 'utensils' },
  { name: 'Wellness', icon: 'heart-pulse' },
  { name: 'Education', icon: 'graduation-cap' },
];

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function main() {
  console.log('Seeding database...');

  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Demo@123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Ava Whitman',
      email: 'admin@novi.demo',
      password,
      role: 'ADMIN',
      avatar: img('avatar-admin', 200, 200),
      phone: '+1 (555) 019-2231',
      bio: 'Platform administrator overseeing events, organizers, and community health.',
    },
  });

  const organizer = await prisma.user.create({
    data: {
      name: 'Marcus Lin',
      email: 'organizer@novi.demo',
      password,
      role: 'ORGANIZER',
      avatar: img('avatar-organizer', 200, 200),
      phone: '+1 (555) 042-7710',
      bio: 'Independent event organizer running tech and music experiences across the city.',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Priya Desai',
      email: 'user@novi.demo',
      password,
      role: 'USER',
      avatar: img('avatar-user', 200, 200),
      phone: '+1 (555) 088-4420',
      bio: 'Always looking for the next great event to attend.',
    },
  });

  const extraUsers = await Promise.all(
    [
      ['Noah Bennett', 'noah.bennett@example.com'],
      ['Elena Cruz', 'elena.cruz@example.com'],
      ['Jamal Carter', 'jamal.carter@example.com'],
      ['Sophie Turner', 'sophie.turner@example.com'],
      ['Diego Alvarez', 'diego.alvarez@example.com'],
    ].map(([name, email], i) =>
      prisma.user.create({
        data: {
          name,
          email,
          password,
          role: 'USER',
          avatar: img(`avatar-extra-${i}`, 200, 200),
        },
      })
    )
  );

  const allAttendees = [user, ...extraUsers];

  const categories = await Promise.all(
    CATEGORIES.map((c) =>
      prisma.category.create({ data: { name: c.name, slug: slugify(c.name), icon: c.icon } })
    )
  );
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  const EVENTS = [
    {
      title: 'Skyline Jazz Festival',
      category: 'Music',
      shortDescription: 'A rooftop evening of live jazz overlooking the city skyline.',
      description:
        'Join us for an unforgettable night of smooth jazz on the rooftop terrace, featuring three acclaimed ensembles and a curated cocktail menu.',
      overview:
        'Doors open at 6:00 PM with welcome drinks, followed by back-to-back sets from local and touring jazz acts until midnight.',
      location: 'Downtown Rooftop, Chicago',
      venue: 'The Aria Terrace',
      price: 45,
      capacity: 180,
      startOffset: 14,
      endOffset: 14,
      featured: true,
      images: ['jazz-1', 'jazz-2', 'jazz-3'],
    },
    {
      title: 'AI & The Future of Work Summit',
      category: 'Technology',
      shortDescription: 'Industry leaders discuss how AI is reshaping careers and companies.',
      description:
        'A full-day summit bringing together founders, researchers, and policy makers to discuss the practical impact of AI on the modern workplace.',
      overview:
        'Includes keynote talks, hands-on workshops, and a networking lunch. Recordings will be available to all attendees afterward.',
      location: 'Moscone Center, San Francisco',
      venue: 'Hall B',
      price: 129,
      capacity: 400,
      startOffset: 30,
      endOffset: 30,
      featured: true,
      images: ['ai-1', 'ai-2', 'ai-3'],
    },
    {
      title: 'Founders & Funders Mixer',
      category: 'Business',
      shortDescription: 'An intimate evening connecting early-stage founders with investors.',
      description:
        'A curated networking mixer designed to spark meaningful conversations between founders raising their next round and active early-stage investors.',
      overview: 'Structured speed-networking rounds followed by open mingling with drinks and appetizers.',
      location: 'Flatiron District, New York',
      venue: 'The Ludlow House',
      price: 0,
      capacity: 120,
      startOffset: 9,
      endOffset: 9,
      featured: false,
      images: ['biz-1', 'biz-2'],
    },
    {
      title: 'Modern Sculpture: A Group Exhibition',
      category: 'Arts & Culture',
      shortDescription: 'Contemporary sculptors showcase bold new works in a three-week exhibition.',
      description:
        'This group exhibition brings together six contemporary sculptors exploring material, scale, and space in the modern era.',
      overview: 'Opening night includes an artist talk and guided tour at 7:00 PM.',
      location: 'Arts District, Los Angeles',
      venue: 'Meridian Gallery',
      price: 20,
      capacity: 250,
      startOffset: 21,
      endOffset: 42,
      featured: true,
      images: ['art-1', 'art-2', 'art-3'],
    },
    {
      title: 'City Marathon Kickoff 5K',
      category: 'Sports',
      shortDescription: 'A community 5K run kicking off marathon weekend.',
      description:
        'Lace up for a scenic 5K through downtown, open to runners and walkers of all levels. Finishers receive a medal and race t-shirt.',
      overview: 'Check-in opens 90 minutes before the race. Water stations every mile.',
      location: 'Riverside Park, Austin',
      venue: 'Riverside Park Start Line',
      price: 25,
      capacity: 600,
      startOffset: 25,
      endOffset: 25,
      featured: false,
      images: ['run-1', 'run-2'],
    },
    {
      title: 'Farm-to-Table Supper Club',
      category: 'Food & Drink',
      shortDescription: 'A seasonal five-course dinner sourced from local farms.',
      description:
        'An intimate supper club experience featuring a five-course tasting menu prepared by a rotating guest chef, paired with regional wines.',
      overview: 'Seating is limited to 40 guests at communal tables. Dietary accommodations available on request.',
      location: 'Sonoma County, California',
      venue: 'Willow Creek Barn',
      price: 95,
      capacity: 40,
      startOffset: 18,
      endOffset: 18,
      featured: true,
      images: ['food-1', 'food-2', 'food-3'],
    },
    {
      title: 'Sunrise Yoga & Sound Bath',
      category: 'Wellness',
      shortDescription: 'Start your morning with guided yoga and a restorative sound bath.',
      description:
        'A gentle outdoor yoga flow followed by a 30-minute sound bath using crystal bowls and chimes to close out the session.',
      overview: 'Mats provided. Arrive 15 minutes early to settle in before sunrise.',
      location: 'Golden Gate Park, San Francisco',
      venue: 'Rose Garden Lawn',
      price: 15,
      capacity: 80,
      startOffset: 6,
      endOffset: 6,
      featured: false,
      images: ['yoga-1', 'yoga-2'],
    },
    {
      title: 'Data Science Bootcamp: Weekend Intensive',
      category: 'Education',
      shortDescription: 'A two-day hands-on bootcamp covering practical data science skills.',
      description:
        'Learn Python for data analysis, statistical fundamentals, and machine learning basics through hands-on labs led by working data scientists.',
      overview: 'Laptop required. All course materials and a certificate of completion are included.',
      location: 'Capitol Hill, Seattle',
      venue: 'Seattle Tech Hub',
      price: 149,
      capacity: 60,
      startOffset: 35,
      endOffset: 36,
      featured: false,
      images: ['edu-1', 'edu-2'],
    },
    {
      title: 'Indie Rock Night at The Hollow',
      category: 'Music',
      shortDescription: 'Four indie rock bands share the bill for one loud, sweaty night.',
      description:
        'A lineup of four rising indie rock acts takes the stage for an all-ages show. Merch tables open before doors.',
      overview: 'Doors at 7, first band at 7:45. Standing room only, 21+ bar available with valid ID.',
      location: 'East Side, Nashville',
      venue: 'The Hollow',
      price: 22,
      capacity: 300,
      startOffset: -10,
      endOffset: -10,
      featured: false,
      images: ['rock-1', 'rock-2'],
    },
    {
      title: 'Startup Demo Day',
      category: 'Business',
      shortDescription: 'Twelve early-stage startups pitch to a room of investors and press.',
      description:
        'The culmination of a 12-week accelerator program, featuring live pitches, a panel Q&A, and a closing reception.',
      overview: 'Pitches run 5 minutes each with 3 minutes of Q&A, followed by a networking reception.',
      location: 'SoMa, San Francisco',
      venue: 'Founders Hall',
      price: 0,
      capacity: 350,
      startOffset: -22,
      endOffset: -22,
      featured: false,
      images: ['demo-1', 'demo-2'],
    },
    {
      title: 'Watercolor Landscapes Workshop',
      category: 'Arts & Culture',
      shortDescription: 'A beginner-friendly watercolor workshop focused on landscapes.',
      description:
        'Spend an afternoon learning watercolor fundamentals - wet-on-wet technique, color mixing, and composition - while painting a landscape scene.',
      overview: 'All supplies included. Finished pieces can be taken home the same day.',
      location: 'Pearl District, Portland',
      venue: 'Northwest Art Studio',
      price: 55,
      capacity: 24,
      startOffset: 12,
      endOffset: 12,
      featured: false,
      images: ['paint-1', 'paint-2'],
    },
    {
      title: 'Championship Basketball Finals Watch Party',
      category: 'Sports',
      shortDescription: 'Watch the finals live on the big screen with fellow fans.',
      description:
        'A community watch party for the championship finals, complete with giveaways, food trucks, and a halftime trivia contest.',
      overview: 'Free entry, food and drinks available for purchase from on-site vendors.',
      location: 'Midtown, Atlanta',
      venue: 'Midtown Plaza',
      price: 0,
      capacity: 500,
      startOffset: -3,
      endOffset: -3,
      featured: false,
      images: ['bball-1', 'bball-2'],
    },
    {
      title: 'Craft Beer & Cheese Pairing',
      category: 'Food & Drink',
      shortDescription: 'An evening pairing local craft beers with artisan cheeses.',
      description:
        'A guided tasting through six local craft beers, each paired with a hand-selected artisan cheese chosen to complement its flavor profile.',
      overview: 'Hosted by a certified cicerone. Light snacks provided between pairings.',
      location: 'Brewery District, Denver',
      venue: 'Highland Taproom',
      price: 38,
      capacity: 60,
      startOffset: 16,
      endOffset: 16,
      featured: false,
      images: ['beer-1', 'beer-2'],
    },
    {
      title: 'Mindfulness & Meditation Retreat Day',
      category: 'Wellness',
      shortDescription: 'A full day of guided meditation, breathwork, and reflection.',
      description:
        'Step away from the noise for a full day retreat featuring guided meditation sessions, breathwork practice, and a silent nature walk.',
      overview: 'Vegetarian lunch included. Please arrive in comfortable clothing.',
      location: 'Blue Ridge Mountains, Asheville',
      venue: 'Cedar Hollow Retreat Center',
      price: 85,
      capacity: 45,
      startOffset: 40,
      endOffset: 40,
      featured: true,
      images: ['med-1', 'med-2'],
    },
    {
      title: 'Web Development Career Night',
      category: 'Education',
      shortDescription: 'Panel discussion and networking for aspiring web developers.',
      description:
        'Hear from hiring managers and working developers about breaking into web development, then network over refreshments.',
      overview: 'Panel runs 60 minutes, followed by an hour of open networking with recruiters on site.',
      location: 'University District, Boston',
      venue: 'Innovation Commons',
      price: 0,
      capacity: 150,
      startOffset: 20,
      endOffset: 20,
      featured: false,
      images: ['web-1', 'web-2'],
    },
    {
      title: 'Electronic Music Warehouse Party',
      category: 'Music',
      shortDescription: 'A late-night warehouse show featuring three electronic music acts.',
      description:
        'An immersive warehouse show with a custom lighting rig and three back-to-back electronic music sets running past midnight.',
      overview: '18+ event, ID required at the door. Coat check and water station available.',
      location: 'Industrial District, Detroit',
      venue: 'The Foundry',
      price: 30,
      capacity: 400,
      startOffset: -35,
      endOffset: -35,
      featured: false,
      images: ['electro-1', 'electro-2'],
    },
  ];

  const events = [];
  for (const e of EVENTS) {
    const event = await prisma.event.create({
      data: {
        title: e.title,
        slug: slugify(e.title) + '-' + Math.random().toString(36).slice(2, 6),
        shortDescription: e.shortDescription,
        description: e.description,
        overview: e.overview,
        images: e.images.map((s) => img(s)),
        startDate: daysFromNow(e.startOffset),
        endDate: daysFromNow(e.endOffset),
        location: e.location,
        venue: e.venue,
        price: e.price,
        capacity: e.capacity,
        seatsBooked: 0,
        featured: e.featured,
        categoryId: catByName[e.category].id,
        organizerId: organizer.id,
      },
    });
    events.push(event);
  }

  const REVIEW_COMMENTS = [
    'Genuinely one of the best events I have been to this year - well organized from start to finish.',
    'Great atmosphere and friendly staff. Would definitely come back for the next one.',
    'Loved the venue choice, though it did get a little crowded near the end.',
    'Exceeded expectations. The pacing was perfect and everything ran on time.',
    'Solid experience overall, communication before the event could have been a bit clearer.',
    'Fantastic value for the price. Already recommended it to a few friends.',
  ];

  for (const event of events.slice(0, 12)) {
    const reviewers = allAttendees.slice(0, 2 + Math.floor(Math.random() * 3));
    for (const [i, reviewer] of reviewers.entries()) {
      await prisma.review.create({
        data: {
          rating: 3 + Math.floor(Math.random() * 3),
          comment: REVIEW_COMMENTS[(i + events.indexOf(event)) % REVIEW_COMMENTS.length],
          userId: reviewer.id,
          eventId: event.id,
        },
      });
    }
  }

  for (const [idx, event] of events.entries()) {
    const numBookings = 1 + (idx % 4);
    for (let i = 0; i < numBookings; i += 1) {
      const attendee = allAttendees[(idx + i) % allAttendees.length];
      const quantity = 1 + (i % 3);
      if (event.seatsBooked + quantity > event.capacity) continue;

      await prisma.booking.create({
        data: {
          userId: attendee.id,
          eventId: event.id,
          quantity,
          totalPrice: event.price * quantity,
          status: event.startDate < new Date() ? 'CONFIRMED' : 'CONFIRMED',
          createdAt: new Date(Date.now() - (idx + i) * 3 * 24 * 60 * 60 * 1000),
        },
      });
      await prisma.event.update({
        where: { id: event.id },
        data: { seatsBooked: { increment: quantity } },
      });
    }
  }

  const BLOG_POSTS = [
    {
      title: '5 Tips for Hosting Your First Community Event',
      excerpt: 'From picking the right venue to promoting your event online, here is how to get started.',
      content:
        'Hosting your first community event can feel overwhelming, but breaking it down into a few key steps makes it manageable. Start by defining a clear goal for your event, choose a venue that matches your expected attendance, and give yourself at least six weeks of lead time for promotion. Use social media and local community boards to spread the word, and always have a simple check-in process ready for the day of the event.',
      coverImage: img('blog-1'),
    },
    {
      title: 'Why Live Events Are Making a Comeback',
      excerpt: 'After years of virtual-first experiences, in-person gatherings are thriving again.',
      content:
        'Attendance at in-person events has climbed steadily over the past two years as people look for genuine connection that video calls cannot replicate. Organizers are responding by investing more in experience design - better catering, more interactive formats, and venues that encourage networking rather than passive listening.',
      coverImage: img('blog-2'),
    },
    {
      title: 'A Guide to Pricing Your Event Tickets',
      excerpt: 'Free, tiered, or premium - how to choose the right pricing model for your audience.',
      content:
        'Pricing is one of the trickiest parts of planning an event. Free events tend to maximize attendance but often see higher no-show rates, while paid tickets create commitment but can limit your audience size. A tiered approach - offering an early-bird rate followed by standard pricing - tends to strike a good balance for most mid-sized events.',
      coverImage: img('blog-3'),
    },
    {
      title: 'Behind the Scenes: Organizing a 400-Person Summit',
      excerpt: 'A look at the logistics that go into a large-scale technology summit.',
      content:
        'Running a summit for 400 attendees requires coordinating catering, AV equipment, speaker logistics, and registration all at once. Our team started planning nine months in advance, running weekly check-ins with every vendor to make sure nothing fell through the cracks on event day.',
      coverImage: img('blog-4'),
    },
    {
      title: 'How to Write Event Descriptions That Convert',
      excerpt: 'The details that turn a casual browser into a confirmed attendee.',
      content:
        'A good event description answers three questions quickly: what is this, who is it for, and why should I care. Lead with the most compelling detail, keep sentences short, and always end with a clear call to action so readers know exactly what to do next.',
      coverImage: img('blog-5'),
    },
  ];

  for (const post of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: slugify(post.title) + '-' + Math.random().toString(36).slice(2, 6),
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        published: true,
        authorId: admin.id,
      },
    });
  }

  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Rachel Kim',
        email: 'rachel.kim@example.com',
        subject: 'Question about group bookings',
        message: 'Hi, I am trying to book tickets for a group of 15 for the AI Summit. Is there a group discount available?',
      },
      {
        name: 'Tom Nguyen',
        email: 'tom.nguyen@example.com',
        subject: 'Refund request',
        message: 'I need to cancel my booking for the Sunrise Yoga session due to a scheduling conflict. Could you help me process a refund?',
        resolved: true,
      },
    ],
  });

  console.log('Seed complete.');
  console.log('Demo accounts (password: Demo@123):');
  console.log('  Admin:     admin@novi.demo');
  console.log('  Organizer: organizer@novi.demo');
  console.log('  User:      user@novi.demo');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
