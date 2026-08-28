import { GoogleGenAI } from '@google/genai';
import { toolRegistry } from './tools/tool.registry.js';
import { orderService } from '../orders/orders.service.js';
import { eventService } from '../events/events.service.js';
import { complaintService } from '../complaints/complaints.service.js';
import { dataStore } from '../../database/inMemoryStore.js';
import { config } from '../../config/env.js';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError.js';
import { Logger } from '../../config/logger.js';

export class AIService {
  constructor() {
    this.geminiClient = process.env.GEMINI_API_KEY
      ? new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        })
      : null;
  }

  async processChat({ message, conversationId, user, contextData = {} }) {
    const context = {
      user: user || { name: 'Manoj Reddy', rollNo: '1602-24-737-152', branch: 'IT', year: '3rd Year' },
      campusId: 'vasavi_campus',
      currentLocation: contextData.location || { room: '304', building: 'Ramanujan Block (IT Dept)' },
    };

    const lower = (message || '').toLowerCase();
    const actions = [];
    const suggestions = [];
    let replyText = '';

    try {
      // 1. Check if Gemini API is available for natural language Q&A with complete knowledge grounding
      if (this.geminiClient && process.env.GEMINI_API_KEY) {
        try {
          const systemContext = `You are the SCAM v1.0 AI Campus Assistant for Vasavi College of Engineering (Hyderabad).
You have real-time access to the campus application data:

1. CURRENT USER & ACADEMIC PROFILE:
- Name: ${context.user.name || 'Manoj Reddy'}, Roll No: ${context.user.rollNo || '1602-24-737-152'}.
- Course: B.E., Semester: V (3rd Year), Branch/Section: IT - C, Lab Batch: Batch B1 (Roll 129-162).
- Classroom: Room R-303 (Ramanujan Block). Class Coordinator: Mrs. S. Rajyalakshmi.
- Attendance: 92%, CGPA: 8.84, Campus Points: 1450.

2. OFFICIAL ACADEMIC TIMETABLE (B.E Sem-V, Section IT-C, Room R-303):
- MON: 09:40-11:40 SDC-V: CSE-II (Lucy Sapan) | 11:40-12:40 CN (Dr. Sreelakshmi) | 12:40-01:20 Lunch | 01:20-02:20 OE-III (IDBMS/IAI) | 02:20-04:20 OS LAB (B1, IT Lab-I) / CN LAB (B2, IT Lab-VIII R-108).
- TUE: 09:40-11:40 OS (Dr. Kezia Rani) | 11:40-12:40 AI&ML (Dr. Prashanth) | 12:40-01:20 Lunch | 01:20-02:20 OE-III | 02:20-04:20 SE LAB (B1, IT Lab-VIII R-108) / AI&ML LAB (B2, IT Lab-VI).
- WED: 09:40-10:40 CN | 10:40-11:40 SDC-VI: TS (External Expert) | 11:40-12:40 OS | 12:40-01:20 Lunch | 01:20-02:20 OE-III | 02:20-03:20 SE (Soumya Sanyal) | 03:20-04:20 AI&ML.
- THU: 09:40-10:40 SE | 10:40-12:40 AI&ML LAB (B1, IT Lab-VIII) / OS LAB (B2, IT Lab-I) | 12:40-01:20 Lunch | 01:20-02:20 AI&ML | 02:20-03:20 CN | 03:20-04:20 SDC-VI: TS.
- FRI: 09:40-10:40 OS | 10:40-12:40 CN LAB (B1, IT Lab-III) / SE LAB (B2, IT Lab-VIII) | 12:40-01:20 Lunch | 01:20-04:20 TBP (Theme Based Project, Room R-104 - L. Divya, Dr. Arun Kumar Silveru, B.A. Farooqui).
- SAT: 09:40-10:40 SE | 10:40-11:40 CN | 11:40-12:40 AI&ML | 12:40-01:20 Lunch | 01:20-02:20 ECA-II (G. Radha) | 02:20-04:20 Library / Sports.

3. NOTICES & BULLETINS:
- Emergency: Monsoon heavy rainfall alert — campus buses departing early at 03:30 PM.
- Academic: 3rd Year B.E. Semester V Mid-Term Examination Schedule released.
- Placements: Microsoft Cloud Software Engineer recruitment drive (CGPA > 8.0, CTC 44 LPA).
- Library: Overdue book waiver week until Friday.

4. CANTEEN & FOOD ORDERING:
- Current Order: Token #42 (Special Paneer Veg Biryani, ₹130, Pickup slot: 12:45 PM Lunch Break, Counter 2 Express).
- Canteens: Vasavi Main Canteen (Counter 1 & 2), Nescafe Kiosk, Fast Bites Corner.
- Specials: Masala Dosa (₹45), Veg Thali (₹90), Cold Coffee (₹40), Grilled Sandwich (₹75).

5. CENTRAL LIBRARY CATALOG:
- "Operating System Concepts" by Silberschatz (Available: 4 copies, Shelf 4-B, 2nd Floor).
- "Introduction to Algorithms (CLRS)" by Cormen (Available: 2 copies, Shelf 2-A).
- "Database System Concepts" by Korth (Available: 5 copies, Shelf 3-C).
- "Computer Networks" by Tanenbaum (Available: 3 copies, Shelf 4-A).

6. PLACEMENTS & INTERVIEW QUESTIONS:
- Companies: Microsoft (44 LPA), Amazon (32 LPA), Oracle (20 LPA), TCS Digital (9 LPA).
- Process: Online Coding Round -> Technical Interview 1 (DSA/OS) -> Technical Interview 2 (System Design/Projects) -> HR.
- Resume tips: Use action verbs (Architected, Optimized, Spearheaded), quantify metrics (e.g. improved latency by 35%).

7. CAMPUS NAVIGATION & BLOCKS:
- Ramanujan Block: IT & CSE departments, Computer Labs, Room R-303 (IT-C Classroom), Rooms R-104 (TBP) & R-108 (IT Lab-VIII).
- Aryabhata Block: AI Research Lab, Data Science Center, Robotics Arena.
- Visvesvaraya Block: ECE & EEE, VLSI Design Lab, Embedded Systems Lab.
- Central Library: Ground to 2nd Floor, Digital Reading Hall, Periodicals.
- Admin Block: Principal Office, Dean Student Affairs, Examination Branch, Accounts.

8. COMPLAINTS & HELPDESK (4-Stage Resolution):
- Categories: Class Projector, Wi-Fi / LAN, Air Conditioning, Restrooms, Drinking Water, Electrical.
- Stages: Submitted -> Assigned -> In Progress -> Resolved.

Instructions:
- Provide friendly, accurate, concise answers.
- Use markdown bolding and bullet points for readability.
- If the user wants to order food, see their timetable, view circulars, or navigate to a room, provide direct details and relevant suggestions.`;

          const response = await this.geminiClient.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: message,
            config: {
              systemInstruction: systemContext,
              temperature: 0.2,
              maxOutputTokens: 600,
            },
          });

          replyText = response.text || '';
          
          if (lower.includes('class') || lower.includes('schedule') || lower.includes('timetable') || lower.includes('room 304')) {
            actions.push({
              type: 'SHOW_ON_MAP',
              label: 'View Room 304 on Map',
              payload: { buildingId: 'ramanujan', roomId: 'room-304' },
            });
            suggestions.push("Today's Timetable", 'Where is Ramanujan Block?', 'Canteen Specials');
          } else if (lower.includes('order') || lower.includes('food') || lower.includes('biryani') || lower.includes('canteen')) {
            actions.push({ type: 'SHOW_MENU', label: 'Open Food Ordering' });
            suggestions.push('Track Token #42', 'Canteen Menu', 'Reorder Masala Dosa');
          } else if (lower.includes('where is') || lower.includes('navigate') || lower.includes('map') || lower.includes('location')) {
            actions.push({
              type: 'NAVIGATE',
              label: 'Open Campus Navigator',
              payload: { target: 'campus_map' },
            });
            suggestions.push('Ramanujan Block (IT)', 'Central Library', 'Main Auditorium');
          } else {
            suggestions.push('Where is my next class?', 'Canteen Menu', 'Check Placement Drives');
          }
        } catch (apiErr) {
          Logger.warn('Gemini API call fallback to deterministic agent', { error: apiErr.message });
          replyText = '';
        }
      }

      // 2. Deterministic Fallback if API key is not present or API call errored
      if (!replyText) {
        if (lower.includes('next class') || lower.includes('upcoming class') || lower.includes('where is my class') || lower.includes('schedule')) {
          replyText = `Your next class is **Database Management Systems (DBMS)** with **Dr. K. Srinivas** in **Room 304 (Ramanujan Block, 3rd Floor)** starting at **10:00 AM**. Walking ETA is ~2.5 minutes from Main Gate.`;
          actions.push({
            type: 'SHOW_ON_MAP',
            label: 'View Room 304 on Map',
            payload: { buildingId: 'ramanujan', roomId: 'room-304' },
          });
          suggestions.push("Today's Timetable", 'Where is Ramanujan Block?', 'Canteen Specials');
        } else if (lower.includes('order') || lower.includes('food') || lower.includes('biryani') || lower.includes('canteen') || lower.includes('lunch')) {
          replyText = `Your active order is **Special Paneer Veg Biryani** (**Token #42**) at **Vasavi Main Canteen (Counter 2 Express)** for pickup at **12:45 PM (Lunch Break)**. Canteen status is currently **OPEN**.`;
          actions.push({ type: 'SHOW_MENU', label: 'Open Food Ordering' });
          suggestions.push('Track Token #42', 'Show Full Menu', 'Check Order Status');
        } else if (lower.includes('library') || lower.includes('book') || lower.includes('silberschatz') || lower.includes('clrs')) {
          replyText = `The Central Library currently has **4 copies** of **Operating System Concepts (Silberschatz)** available on **Shelf 4-B (2nd Floor)**. Overdue fines are waived this week until Friday!`;
          actions.push({ type: 'OPEN_LIBRARY', label: 'Reserve Book in Library' });
          suggestions.push('Search Library Books', 'Library Timings', 'My Issued Books');
        } else if (lower.includes('placement') || lower.includes('microsoft') || lower.includes('interview') || lower.includes('salary') || lower.includes('package')) {
          replyText = `**Microsoft Cloud SWE** recruitment drive registration is live on SCAM! Eligibility: **CGPA > 8.0**, CTC: **44 LPA**. Rounds include Online Coding Assessment, 2 Technical Rounds (DSA/OS), and Managerial round.`;
          actions.push({ type: 'OPEN_PLACEMENTS', label: 'Open Placement Portal' });
          suggestions.push('Interview Question Bank', 'ATS Resume Tips', 'Amazon Drive Info');
        } else if (lower.includes('notice') || lower.includes('circular') || lower.includes('emergency') || lower.includes('announcement')) {
          replyText = `**Latest Campus Notices:**\n1. 🚨 **Monsoon Alert**: Heavy rain forecast; college buses depart early at 03:30 PM.\n2. 📅 **Mid-Term Exams**: 3rd Year B.E. Semester V timetable published.\n3. 💼 **Microsoft Recruitment**: Campus registration open for 2025/2026 batch.`;
          actions.push({ type: 'OPEN_NOTICE', label: 'View All Notices' });
          suggestions.push('Exam Timetable', 'Placement Circulars', 'Bus Routes');
        } else if (lower.includes('complaint') || lower.includes('issue') || lower.includes('not working') || lower.includes('broken') || lower.includes('projector') || lower.includes('ac')) {
          replyText = `I can log a priority maintenance ticket for **Classroom Projector / Facility Issue** at **Ramanujan Block - Room 304**. The technician team will be notified and resolve it within our 4-stage tracking workflow.`;
          actions.push({ type: 'OPEN_COMPLAINT', label: 'Submit Support Ticket' });
          suggestions.push('Track Existing Tickets', 'Check FAQs', 'Contact Helpdesk');
        } else if (lower.includes('where is') || lower.includes('locate') || lower.includes('map') || lower.includes('building') || lower.includes('block')) {
          replyText = `**Ramanujan Block (IT & CSE)** is located on the West side of Central Boulevard. Features 4 floors, elevator bays, and network labs.`;
          actions.push({
            type: 'SHOW_ON_MAP',
            label: 'Highlight Ramanujan Block',
            payload: { buildingId: 'ramanujan' },
          });
          suggestions.push('Aryabhata Block', 'Visvesvaraya Block', 'Central Canteen');
        } else {
          replyText = `Welcome to the **Vasavi SCAM AI Assistant**! I can help you with your lecture timetable, room navigation, canteen pre-orders, library book availability, placement test questions, and college circulars.`;
          suggestions.push('Where is my next class?', 'Canteen Token Status', 'Placement Drives');
        }
      }

      return {
        conversationId: conversationId || `conv_${Date.now()}`,
        message: {
          role: 'assistant',
          content: replyText,
        },
        text: replyText,
        reply: replyText,
        actions,
        suggestions,
      };
    } catch (err) {
      Logger.error('AI Service Error:', { message: err.message, stack: err.stack });
      return {
        conversationId: conversationId || `conv_${Date.now()}`,
        message: {
          role: 'assistant',
          content: 'The SCAM AI assistant is active. You can check your next lecture, navigate the campus map, order canteen meals, or check placement circulars.',
        },
        text: 'The SCAM AI assistant is active. You can check your next lecture, navigate the campus map, order canteen meals, or check placement circulars.',
        actions: [],
        suggestions: ['Where is my next class?', 'Order Food', 'Placement Drives'],
      };
    }
  }

  async confirmAction(actionId, user) {
    const pending = dataStore.pendingAIActions.get(actionId);
    if (!pending) {
      throw new NotFoundError('Pending Action or Action has expired');
    }

    if (pending.userId !== user.id) {
      throw new ValidationError('Action does not belong to the current authenticated user');
    }

    let result = null;
    let message = 'Action executed successfully';

    if (pending.type === 'CREATE_ORDER') {
      result = await orderService.createOrder(pending.payload);
      message = `Food order #${result.orderNumber} successfully placed!`;
    } else if (pending.type === 'REGISTER_EVENT') {
      result = await eventService.registerUserForEvent(pending.payload.eventId, user.id);
      message = `Successfully registered for "${result.title}"!`;
    } else if (pending.type === 'CREATE_COMPLAINT') {
      result = await complaintService.createComplaint(pending.payload);
      message = `Maintenance ticket #${result.ticketNumber} submitted!`;
    }

    dataStore.pendingAIActions.delete(actionId);

    return {
      success: true,
      type: pending.type,
      message,
      result,
    };
  }

  async cancelAction(actionId, user) {
    const pending = dataStore.pendingAIActions.get(actionId);
    if (pending && pending.userId === user.id) {
      dataStore.pendingAIActions.delete(actionId);
    }
    return { success: true, message: 'Action cancelled' };
  }
}

export const aiService = new AIService();
