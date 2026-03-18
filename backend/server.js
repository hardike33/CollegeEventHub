const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const fs      = require('fs');
const path    = require('path');
const nodemailer = require('nodemailer');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const PORT   = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

/* ── Middleware ─────────────────────────────────────────── */
app.use(cors());
app.use(express.json());

/* ── DB helpers ─────────────────────────────────────────── */
const readDB  = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

/* ── Nodemailer transporter ─────────────────────────────── */
// Using Gmail "App Password". Replace with your credentials.
// To get App Password: Google Account → Security → 2FA → App Passwords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your.email@gmail.com',   // ← Replace
    pass: process.env.EMAIL_PASS || 'your_app_password_here', // ← Replace
  },
});

async function sendConfirmationEmail(to, name, events) {
  const eventList = events.map((e, i) =>
    `<tr style="border-bottom:1px solid #2d2d2d">
      <td style="padding:10px 0;color:#a78bfa">${i + 1}.</td>
      <td style="padding:10px 12px;color:#e2e8f0;font-weight:600">${e.name}</td>
      <td style="padding:10px 0;color:#94a3b8">${e.date}</td>
      <td style="padding:10px 0;color:#22d3ee">${e.venue}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: '"College Event Hub 🎓" <your.email@gmail.com>',
    to,
    subject: `✅ Registration Confirmed — College Event Hub`,
    html: `
      <!DOCTYPE html>
      <html><body style="margin:0;padding:0;background:#06040f;font-family:'Segoe UI',sans-serif">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px">
        <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px">
          <div style="font-size:48px;margin-bottom:12px">🎓</div>
          <h1 style="color:#fff;margin:0;font-size:28px">Registration Confirmed!</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">College Event Hub</p>
        </div>
        <div style="background:#0f0b1e;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;margin-bottom:20px">
          <p style="color:#94a3b8;font-size:14px;margin:0 0 8px">Hello,</p>
          <h2 style="color:#f1f0f7;margin:0 0 20px;font-size:22px">Hi ${name}! 👋</h2>
          <p style="color:#94a3b8;line-height:1.7;margin:0 0 28px">
            Your registration has been successfully received. Here are the events you've signed up for:
          </p>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px">#</th>
                <th style="text-align:left;padding:8px 12px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px">Event</th>
                <th style="text-align:left;padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px">Date</th>
                <th style="text-align:left;padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px">Venue</th>
              </tr>
            </thead>
            <tbody>${eventList}</tbody>
          </table>
        </div>
        <div style="background:#0f0b1e;border:1px solid rgba(124,58,237,0.3);border-radius:16px;padding:24px;margin-bottom:20px">
          <p style="color:#a78bfa;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">📌 What's Next?</p>
          <ul style="color:#94a3b8;padding-left:16px;line-height:2;margin:0;font-size:14px">
            <li>Arrive 15 minutes before the event starts</li>
            <li>Carry your student ID for verification</li>
            <li>Check your email for event-specific updates</li>
          </ul>
        </div>
        <p style="color:#4b5563;font-size:12px;text-align:center;margin:0">
          © 2026 College Event Hub · All rights reserved
        </p>
      </div>
      </body></html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${to}`);
  } catch (err) {
    // Email sending is optional — don't crash if credentials not set
    console.warn(`⚠️  Email not sent (check credentials): ${err.message}`);
  }
}

/* ══════════════════════════════════════════════════════════
   ROUTES
══════════════════════════════════════════════════════════ */

/* 1. GET all events ──────────────────────────────────────── */
app.get('/api/events', (req, res) => {
  try {
    const db = readDB();
    res.json(db.events);
  } catch (err) {
    res.status(500).json({ message: 'Error reading database' });
  }
});

/* 2. POST new event (Admin) ──────────────────────────────── */
app.post('/api/events', (req, res) => {
  try {
    const db = readDB();
    const newEvent = { id: Date.now(), ...req.body, registered: 0 };
    db.events.push(newEvent);
    writeDB(db);
    io.emit('new-event', newEvent);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error saving event' });
  }
});

/* 3. POST register user ──────────────────────────────────── */
// Accepts: { fname, email, phone, year, college, eventIds: [1,2,3] }
app.post('/api/register', async (req, res) => {
  try {
    const { fname, email, phone, year, college, eventIds } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (!fname || !email || !phone || !year || !college) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one event.' });
    }

    const db = readDB();

    // ── Match selected events ────────────────────────────────
    const selectedEvents = [];
    for (const eid of eventIds) {
      const idx = db.events.findIndex(e => String(e.id) === String(eid));
      if (idx === -1) {
        return res.status(404).json({ message: `Event with id "${eid}" not found.` });
      }
      db.events[idx].registered += 1;
      selectedEvents.push({
        id:    db.events[idx].id,
        name:  db.events[idx].name,
        date:  db.events[idx].date,
        venue: db.events[idx].venue,
      });
    }

    // ── Save registration ────────────────────────────────────
    const registration = {
      id:        db.registrations.length + 1,
      fname, email, phone, year, college,
      events:    selectedEvents,
      timestamp: new Date().toISOString(),
    };
    db.registrations.push(registration);
    writeDB(db);

    // ── Real-time update on all browsers ────────────────────
    selectedEvents.forEach((ev) => {
      const upd = db.events.find(e => e.id === ev.id);
      if (upd) io.emit('update-event', upd);
    });

    // ── Send confirmation email ──────────────────────────────
    await sendConfirmationEmail(email, fname, selectedEvents);

    res.status(201).json({
      message: 'Registration successful! 🎉 Check your email for confirmation.',
      registration,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

/* 4. GET all registrations (Admin) ────────────────────────── */
app.get('/api/registrations', (req, res) => {
  const db = readDB();
  res.json(db.registrations);
});

/* ── Start ───────────────────────────────────────────────── */
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET  /api/events`);
  console.log(`   POST /api/events`);
  console.log(`   POST /api/register`);
  console.log(`   GET  /api/registrations`);
});
