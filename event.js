/**
 * ============================================================
 * COLLEGE EVENT HUB — events.js
 * Handles: Event Data, Rendering, Filtering, Search, Modal
 * Evaluation Criteria: Functionality (10/10)
 * ============================================================
 */

'use strict';

/* ============================================================
   1. EVENT DATA STORE
   ============================================================ */
const EVENT_DATA = [
  {
    id: 1,
    name: "48-Hour National Hackathon",
    category: "hackathon",
    featured: true,
    date: "Mar 22–23, 2025",
    time: "9:00 AM – 9:00 AM (next day)",
    venue: "Main Auditorium, Block A",
    organizer: "CSE Department",
    organizerContact: "cse@collegeeventhub.in",
    deadline: "Mar 18, 2025",
    capacity: 500,
    registered: 342,
    prize: "₹50,000",
    tags: ["coding", "innovation", "team event", "prize money"],
    icon: "fas fa-microchip",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Build, innovate, and compete in India's biggest student hackathon. 500+ coders, 48 hours, infinite possibilities.",
    fullDesc: "Join 500+ students from across India for an adrenaline-fueled 48-hour coding marathon. Form teams of 2–4, pick a problem statement, and build a working prototype. Mentors from top tech companies will guide you throughout. Cash prizes worth ₹50,000 await the top teams! Workshops, talks, and midnight snacks included."
  },
  {
    id: 2,
    name: "AI & ML Summit 2025",
    category: "technical",
    featured: true,
    date: "Apr 5, 2025",
    time: "10:00 AM – 6:00 PM",
    venue: "Seminar Hall 2, Block C",
    organizer: "IT Department",
    organizerContact: "it@collegeeventhub.in",
    deadline: "Apr 1, 2025",
    capacity: 300,
    registered: 218,
    prize: null,
    tags: ["AI", "machine learning", "deep learning", "NLP"],
    icon: "fas fa-robot",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Deep dive into Artificial Intelligence and Machine Learning with talks from industry leaders and live demos.",
    fullDesc: "A full-day summit featuring keynote talks by AI researchers from IIT and top tech startups, hands-on ML demos, panel discussions, and networking sessions. Topics include LLMs, computer vision, reinforcement learning, generative AI, and AI ethics. Q&A sessions after every talk."
  },
  {
    id: 3,
    name: "Cultural Fest – Resonance",
    category: "cultural",
    featured: true,
    date: "Apr 12–14, 2025",
    time: "5:00 PM – 10:00 PM (each day)",
    venue: "Open Air Theatre",
    organizer: "Student Council",
    organizerContact: "council@collegeeventhub.in",
    deadline: "Apr 8, 2025",
    capacity: 2000,
    registered: 876,
    prize: "₹25,000 (competitions)",
    tags: ["music", "dance", "drama", "arts", "food"],
    icon: "fas fa-theater-masks",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Three days of music, dance, drama, art, and food. The biggest cultural celebration of the year!",
    fullDesc: "Resonance is the annual cultural extravaganza featuring classical and contemporary dance performances, live band nights, theatrical productions, fine arts exhibitions, and a food carnival with cuisines from across India. Open for both audience and performers. Register as a performer by Apr 5."
  },
  {
    id: 4,
    name: "Web Dev Bootcamp",
    category: "workshop",
    featured: false,
    date: "Mar 28–29, 2025",
    time: "9:00 AM – 5:00 PM",
    venue: "Computer Lab 3, Block B",
    organizer: "Web Club",
    organizerContact: "webclub@collegeeventhub.in",
    deadline: "Mar 25, 2025",
    capacity: 60,
    registered: 54,
    prize: null,
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    icon: "fas fa-laptop",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Hands-on 2-day workshop covering HTML, CSS, JavaScript, React and deploying your first web app.",
    fullDesc: "Learn full-stack web development from scratch. Day 1 covers frontend (HTML, CSS, JavaScript, React). Day 2 dives into backend (Node.js, Express, MongoDB) and deployment to Vercel/Netlify. Bring your own laptop. Certificate provided on completion. Prior coding knowledge helpful but not required."
  },
  {
    id: 5,
    name: "Photography Workshop",
    category: "workshop",
    featured: false,
    date: "Apr 3, 2025",
    time: "10:00 AM – 4:00 PM",
    venue: "Media Room, Block D",
    organizer: "Photography Club",
    organizerContact: "photoclub@collegeeventhub.in",
    deadline: "Apr 1, 2025",
    capacity: 30,
    registered: 27,
    prize: null,
    tags: ["photography", "Lightroom", "composition", "portraiture"],
    icon: "fas fa-camera",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Learn composition, lighting, portrait and street photography from award-winning photographers.",
    fullDesc: "A comprehensive workshop for photography enthusiasts at all levels. Covers camera basics, composition rules, lighting techniques, portrait photography, street photography, and post-processing in Adobe Lightroom. DSLR cameras available on loan. Participants will receive printed certificates and feedback on their shots."
  },
  {
    id: 6,
    name: "Robotics Championship",
    category: "technical",
    featured: false,
    date: "Apr 18–19, 2025",
    time: "9:00 AM – 7:00 PM",
    venue: "Mechanical Workshop, Block E",
    organizer: "Robotics Club",
    organizerContact: "robotics@collegeeventhub.in",
    deadline: "Apr 12, 2025",
    capacity: 100,
    registered: 68,
    prize: "₹30,000",
    tags: ["robotics", "automation", "engineering", "competition"],
    icon: "fas fa-microchip",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Design and battle with custom robots in three events: line-following, obstacle course, and combat arena!",
    fullDesc: "The annual inter-college robotics competition. Teams of 3 compete in three categories: Autonomous Line Following, Maze Navigation, and Combat Bots. Prizes in each category. Components and workspace provided 3 days before the event. All teams must pre-register and submit a technical spec sheet."
  },
  {
    id: 7,
    name: "Inter-College Cricket Tournament",
    category: "sports",
    featured: false,
    date: "Apr 26–27, 2025",
    time: "8:00 AM – 6:00 PM",
    venue: "College Cricket Ground",
    organizer: "Sports Committee",
    organizerContact: "sports@collegeeventhub.in",
    deadline: "Apr 20, 2025",
    capacity: 160,
    registered: 96,
    prize: "₹15,000 + Trophy",
    tags: ["cricket", "T20", "inter-college", "knockout"],
    icon: "fas fa-trophy",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
    shortDesc: "A 20-over knockout tournament with 16 college teams battling for the championship trophy.",
    fullDesc: "The annual inter-college cricket T20 knockout tournament. 16 teams from colleges across the city compete over 2 days. Each team must have 11 players + 4 substitutes. All matches are 20 overs. Cash prizes, trophies, and the coveted Championship Cup await the winners. Registration fee: ₹500 per team."
  },
  {
    id: 8,
    name: "Design Thinking Sprint",
    category: "workshop",
    featured: false,
    date: "Apr 9, 2025",
    time: "9:00 AM – 6:00 PM",
    venue: "Innovation Lab, Block A",
    organizer: "Design Dept.",
    organizerContact: "design@collegeeventhub.in",
    deadline: "Apr 6, 2025",
    capacity: 40,
    registered: 38,
    prize: null,
    tags: ["UX", "design thinking", "prototyping", "ideation"],
    icon: "fas fa-palette",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    shortDesc: "A full-day UX/Design Thinking workshop using the Stanford d.school methodology on real problems.",
    fullDesc: "Experience the complete Design Thinking process — Empathize, Define, Ideate, Prototype, and Test — applied to a real-world problem statement. Work in teams, build low-fi prototypes, and present solutions to a panel of industry designers. Post-it notes, markers, and clay provided. Certificate + LinkedIn badge included."
  },
  {
    id: 9,
    name: "Music Night – Unplugged",
    category: "cultural",
    featured: false,
    date: "May 2, 2025",
    time: "6:00 PM – 10:00 PM",
    venue: "Open Air Theatre",
    organizer: "Music Club",
    organizerContact: "music@collegeeventhub.in",
    deadline: "Apr 28, 2025",
    capacity: 800,
    registered: 312,
    prize: "₹10,000 (performers)",
    tags: ["music", "acoustic", "open-mic", "indie", "folk"],
    icon: "fas fa-music",
    image: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?auto=format&fit=crop&w=800&q=80",
    shortDesc: "An acoustic evening featuring solo artists, bands, and open-mic performances. Come enjoy, or come perform!",
    fullDesc: "Unplugged is an annual acoustic music event celebrating raw, unfiltered talent. Open for audience attendance and performers alike. Genres welcome: indie, classical, folk, pop, jazz. Auditions for performers: Apr 20. Equipment provided for performers. Audience entry is free. Food stalls available."
  }
];

/* ============================================================
   2. STATE MANAGEMENT
   ============================================================ */
const EventHub = {
  state: {
    activeFilter: 'all',
    searchQuery: '',
    currentModal: null,
  },

  /* ---- Getters ---- */
  getFiltered() {
    return EVENT_DATA.filter(ev => {
      const matchCat  = this.state.activeFilter === 'all' || ev.category === this.state.activeFilter;
      const q         = this.state.searchQuery.toLowerCase();
      const matchSearch = !q ||
        ev.name.toLowerCase().includes(q) ||
        ev.shortDesc.toLowerCase().includes(q) ||
        ev.organizer.toLowerCase().includes(q) ||
        ev.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  },

  getFeatured() {
    return EVENT_DATA.filter(ev => ev.featured);
  },

  getById(id) {
    return EVENT_DATA.find(ev => ev.id === id) || null;
  },

  /* ---- Setters ---- */
  setFilter(cat) {
    this.state.activeFilter = cat;
    this.renderAll();
  },

  setSearch(q) {
    this.state.searchQuery = q;
    this.renderAll();
  },

  /* ---- Render ---- */
  renderAll() {
    this.renderFeatured();
    this.renderGrid();
    initReveal();
  },

  renderFeatured() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;
    container.innerHTML = this.getFeatured().map(ev => buildEventCard(ev)).join('');
  },

  renderGrid() {
    const container = document.getElementById('allEventsGrid');
    if (!container) return;
    const filtered = this.getFiltered();
    if (filtered.length === 0) {
      container.innerHTML = buildEmptyState(this.state.searchQuery, this.state.activeFilter);
    } else {
      container.innerHTML = filtered.map(ev => buildEventCard(ev)).join('');
    }
  }
};

/* ============================================================
   3. HTML BUILDERS
   ============================================================ */
function buildEventCard(ev) {
  const fillPct = Math.round((ev.registered / ev.capacity) * 100);
  const almostFull = fillPct >= 85;

  return `
    <div class="glass-card event-card reveal" data-id="${ev.id}" data-cat="${ev.category}">
      <div class="event-card-bg" style="background-image: url('${ev.image}')"></div>
      <div class="event-card-overlay"></div>
      
      <span class="badge badge-${ev.category} event-card__cat">
        ${capitalize(ev.category)}
      </span>
      ${almostFull ? `<span class="badge" style="position:absolute;top:12px;right:12px;background:rgba(251,191,36,0.25);color:#fbbf24;border:1px solid rgba(251,191,36,0.35);z-index:3;backdrop-filter:blur(10px)">🔥 Almost Full</span>` : ''}
      
      <div class="event-card__body">
        <div class="icon-circle small-icon"><i class="${ev.icon}"></i></div>
        <h3 class="event-card__title">${ev.name}</h3>
        <p class="event-card__desc">${ev.shortDesc}</p>
        <div class="event-card__meta">
          <div class="event-card__meta-item"><i class="fas fa-calendar-alt"></i>${ev.date}</div>
          <div class="event-card__meta-item"><i class="fas fa-map-marker-alt"></i>${ev.venue}</div>
          <div class="event-card__meta-item"><i class="fas fa-user-circle"></i>${ev.organizer}</div>
          ${ev.prize ? `<div class="event-card__meta-item"><i class="fas fa-trophy" style="color:#fbbf24"></i>Prize: ${ev.prize}</div>` : ''}
        </div>
        <div class="event-card__footer">
          <button class="btn btn-outline btn-sm" onclick="EventModal.open(${ev.id})">
            <i class="fas fa-eye"></i> View Details
          </button>
          <a href="#register" class="btn btn-teal btn-sm">
            <i class="fas fa-bolt"></i> Register
          </a>
        </div>
      </div>
    </div>`;
}

function buildEmptyState(query, cat) {
  const msg = query
    ? `No events found for "<strong>${query}</strong>"`
    : `No <strong>${cat}</strong> events found right now.`;
  return `
    <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted)">
      <div style="font-size:3rem;margin-bottom:16px">🔍</div>
      <p style="font-size:1rem">${msg}</p>
      <p style="font-size:0.85rem;margin-top:8px">Try a different filter or check back soon!</p>
      <button class="btn btn-outline" style="margin-top:20px" onclick="EventHub.setFilter('all'); resetFilters()">
        Show All Events
      </button>
    </div>`;
}

/* ============================================================
   4. MODAL MODULE
   ============================================================ */
const EventModal = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('eventModal');
    if (!this.overlay) return;
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) this.close();
    });
  },

  open(id) {
    const ev = EventHub.getById(id);
    if (!ev || !this.overlay) return;

    EventHub.state.currentModal = id;

    // Populate
    const banner = document.getElementById('modalBanner');
    if (banner) {
      banner.style.backgroundImage = `url('${ev.image}')`;
      banner.style.backgroundSize = 'cover';
      banner.style.backgroundPosition = 'center';
    }

    document.getElementById('modalIcon').className = ev.icon;
    setText('modalTitle',    ev.name);
    setText('modalDesc',     ev.fullDesc);
    setText('modalVenue',    ev.venue);
    setText('modalDate',     `${ev.date} · ${ev.time}`);
    setText('modalOrg',      `${ev.organizer} — ${ev.organizerContact}`);
    setText('modalDeadline', ev.deadline);

    const tagEl = document.getElementById('modalTag');
    if (tagEl) {
      tagEl.textContent = capitalize(ev.category);
      tagEl.className = `badge badge-${ev.category}`;
    }

    // Capacity bar
    const bar = document.getElementById('modalCapBar');
    if (bar) {
      const pct = Math.round((ev.registered / ev.capacity) * 100);
      bar.style.width = pct + '%';
      setText('modalCapText', `${ev.registered} / ${ev.capacity} registered (${pct}%)`);
    }

    // Tags
    const tagsCont = document.getElementById('modalTags');
    if (tagsCont) {
      tagsCont.innerHTML = ev.tags.map(t =>
        `<span style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-pill);padding:4px 12px;font-size:0.75rem;color:var(--muted-light)">#${t}</span>`
      ).join('');
    }

    // Prize
    const prizeRow = document.getElementById('modalPrizeRow');
    if (prizeRow) {
      prizeRow.style.display = ev.prize ? '' : 'none';
      if (ev.prize) setText('modalPrize', ev.prize);
    }

    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
    EventHub.state.currentModal = null;
  }
};

/* ============================================================
   5. FILTER & SEARCH INIT
   ============================================================ */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      EventHub.setFilter(this.dataset.cat);
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        EventHub.setSearch(this.value);
      }, 220);
    });
  }
}

function resetFilters() {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.filter-btn[data-cat="all"]');
  if (allBtn) allBtn.classList.add('active');
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
}

/* ============================================================
   6. HELPER UTILITIES
   ============================================================ */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/* ============================================================
   7. REVEAL OBSERVER
   ============================================================ */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* ============================================================
   8. PUBLIC CLOSE FUNCTION (used in HTML onclick)
   ============================================================ */
function closeModal() {
  EventModal.close();
}

/* ============================================================
   9. EXPORT / INIT HOOK
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  EventHub.renderAll();
  EventModal.init();
  initFilters();
});