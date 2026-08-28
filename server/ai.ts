import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { db } from './db';

// Initialize GoogleGenAI SDK with server-side API key
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Falling back to local rule-based assistant.');
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Function Declarations for Campus OS Tools
const searchCampusTool: FunctionDeclaration = {
  name: 'searchCampus',
  description: 'Search for campus buildings, classrooms, laboratories, auditoriums, and facilities by name or room number.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'The search query (e.g., "Computer Networks Lab", "Library", "Room 304", "CSE Block")',
      },
    },
    required: ['query'],
  },
};

const getTimetableTool: FunctionDeclaration = {
  name: 'getTimetable',
  description: "Get the student's academic schedule, classes for today, current class, or next upcoming lecture.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      day: {
        type: Type.STRING,
        description: 'Optional day of week (e.g. "today", "Monday")',
      },
    },
  },
};

const getFoodMenuTool: FunctionDeclaration = {
  name: 'getFoodMenu',
  description: 'Get menu items, prices, and availability from campus canteens (Canteen A or Canteen B).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      canteen: {
        type: Type.STRING,
        description: 'Optional canteen identifier ("A" or "B")',
      },
    },
  },
};

const createOrderTool: FunctionDeclaration = {
  name: 'createOrder',
  description: 'Place a food pre-order for a campus canteen item (e.g., Veg Thali, Paneer Biryani) for a scheduled pickup time.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemName: {
        type: Type.STRING,
        description: 'Name of the food item to order (e.g., "Veg Thali", "Paneer Biryani", "Masala Dosa")',
      },
      pickupTime: {
        type: Type.STRING,
        description: 'Scheduled pickup time (e.g., "1:00 PM", "12:45 PM")',
      },
      canteen: {
        type: Type.STRING,
        description: 'Canteen identifier ("A" or "B")',
      },
    },
    required: ['itemName'],
  },
};

const getOrderStatusTool: FunctionDeclaration = {
  name: 'getOrderStatus',
  description: 'Check the status, pickup counter, and estimated time of the latest food order.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const createComplaintTool: FunctionDeclaration = {
  name: 'createComplaint',
  description: 'Report a campus issue or log a maintenance ticket (e.g., projector issue, AC repair, WiFi).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: 'Category of issue (e.g., "Classroom Projector / AC", "WiFi", "Electrical")',
      },
      location: {
        type: Type.STRING,
        description: 'Location on campus (e.g., "CSE Block - Room 304")',
      },
      description: {
        type: Type.STRING,
        description: 'Detailed description of the issue',
      },
    },
    required: ['category', 'location', 'description'],
  },
};

const searchNoticesTool: FunctionDeclaration = {
  name: 'searchNotices',
  description: 'Search official campus notices, circulars, placement updates, and exam timetables.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: 'Optional category (e.g., "PLACEMENT", "ACADEMIC", "EVENT")',
      },
    },
  },
};

const searchEventsTool: FunctionDeclaration = {
  name: 'searchEvents',
  description: 'Search upcoming campus events, hackathons, workshops, and club activities.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

// Execute tool call on DB
function executeTool(name: string, args: Record<string, unknown>): Record<string, unknown> {
  switch (name) {
    case 'searchCampus': {
      const q = String(args.query || '').toLowerCase();
      const b = db.findBuilding(q);
      const r = db.findRoom(q);
      return {
        building: b || null,
        room: r || null,
        message: b || r
          ? `Found campus location: ${r ? `${r.name} in ${r.buildingId.toUpperCase()} Block, Floor ${r.floorNumber}, Room ${r.roomNumber}` : b?.name}`
          : `No specific campus location found for "${args.query}".`,
      };
    }

    case 'getTimetable': {
      return {
        student: db.currentUser.name,
        classes: db.schedule,
        nextClass: db.schedule.find((c) => c.status === 'upcoming') || db.schedule[1],
      };
    }

    case 'getFoodMenu': {
      return {
        menu: db.foodItems,
        canteenA: 'Main Food Court (Meals, Chinese, Snacks)',
        canteenB: 'Quick Bites & Thali',
      };
    }

    case 'createOrder': {
      const itemName = String(args.itemName || 'Veg Thali');
      const pickupTime = String(args.pickupTime || '1:00 PM');
      const item = db.foodItems.find((f) => f.name.toLowerCase().includes(itemName.toLowerCase())) || db.foodItems[1];
      const order = db.createOrder([{ foodItemId: item.id, quantity: 1 }], pickupTime, 'canteen_b');
      return {
        success: true,
        order: {
          orderNumber: order.orderNumber,
          itemName: item.name,
          canteen: order.vendorName,
          pickupTime: order.pickupTime,
          pickupCounter: order.pickupCounter,
          total: order.total,
          status: order.status,
        },
      };
    }

    case 'getOrderStatus': {
      const latestOrder = db.orders[0];
      return {
        order: latestOrder || null,
      };
    }

    case 'createComplaint': {
      const ticketNum = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      const complaint = {
        id: `c-${ticketNum}`,
        ticketNumber: ticketNum,
        userId: db.currentUser.id,
        category: String(args.category),
        location: String(args.location),
        description: String(args.description),
        priority: 'HIGH' as const,
        status: 'OPEN' as const,
        createdAt: new Date().toISOString(),
        timeline: [
          { status: 'Submitted', timestamp: 'Just now', note: `Ticket logged by ${db.currentUser.name}` },
        ],
      };
      db.complaints.unshift(complaint);
      return {
        success: true,
        ticketNumber: ticketNum,
        status: 'OPEN',
      };
    }

    case 'searchNotices': {
      return { notices: db.notices };
    }

    case 'searchEvents': {
      return { events: db.events };
    }

    default:
      return { error: `Tool ${name} not supported` };
  }
}

export async function processAIChat(userMessage: string, history: { role: string; content: string }[] = []) {
  const ai = getAIClient();

  // If Gemini API Key is available, use Gemini 3.7 Flash with Function Calling
  if (ai) {
    try {
      const tools = [
        {
          functionDeclarations: [
            searchCampusTool,
            getTimetableTool,
            getFoodMenuTool,
            createOrderTool,
            getOrderStatusTool,
            createComplaintTool,
            searchNoticesTool,
            searchEventsTool,
          ],
        },
      ];

      const systemInstruction = `You are Campus OS AI Assistant — the intelligent digital companion for students and staff at Smart Campus.
User: Manoj Reddy (IT, 3rd Year, Roll: 21B81A0589).
Key Campus Facts:
- Computer Networks Lab is in CSE Block, 3rd Floor, Room 304.
- Database Management Systems (DBMS) is in CSE Block, Room 302.
- AI Lab is in AI Lab - 1 on Ground Floor.
- Canteen A is Main Food Court (Paneer Biryani ₹140, Dosa ₹60).
- Canteen B is Quick Bites (Veg Thali ₹90, Cold Coffee ₹50). Manoj's usual lunch order is Veg Thali from Canteen B for 1:00 PM.

Instructions:
- Be concise, helpful, friendly, and accurate.
- Use your tools to check timetable, search campus rooms, place food orders, or file complaints.
- Never invent room locations or campus facts.
- When answering location queries, mention the building, floor, and room number.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          ...history.map((h) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        config: {
          systemInstruction,
          tools,
        },
      });

      // Check for function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        const toolResult = executeTool(call.name, (call.args || {}) as Record<string, unknown>);

        // Follow up with tool result to get final conversational response
        const followUp = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: [
            { role: 'user', parts: [{ text: userMessage }] },
            {
              role: 'model',
              parts: [{ functionCall: call }],
            },
            {
              role: 'user',
              parts: [
                {
                  functionResponse: {
                    name: call.name,
                    response: toolResult,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction,
          },
        });

        return {
          text: followUp.text || 'I processed your request.',
          toolCalled: call.name,
          toolResult: toolResult,
        };
      }

      return {
        text: response.text || 'How can I assist you with your campus schedule or services?',
      };
    } catch (err: unknown) {
      console.error('Gemini API execution error:', err);
    }
  }

  // Smart fallback when offline / no key
  const lower = userMessage.toLowerCase();
  if (lower.includes('where is') && lower.includes('network')) {
    return {
      text: 'The Computer Networks Lab is in CSE Block, 3rd Floor, Room 304.',
      actionType: 'location',
      actionData: { buildingId: 'cse', floor: 3, room: '304', name: 'Computer Networks Lab' },
    };
  }

  if (lower.includes('order') || lower.includes('usual') || lower.includes('lunch')) {
    const order = db.createOrder([{ foodItemId: 'food-2', quantity: 1 }], '1:00 PM', 'canteen_b');
    return {
      text: 'Sure! Ordering your usual lunch (Veg Thali) from Canteen B for 1:00 PM.',
      actionType: 'order',
      actionData: {
        orderNumber: order.orderNumber,
        item: 'Veg Thali',
        canteen: 'Canteen B',
        pickupTime: '1:00 PM',
        status: 'Order Confirmed ✅',
      },
    };
  }

  if (lower.includes('next class') || lower.includes('schedule') || lower.includes('timetable')) {
    return {
      text: 'Your current class is Computer Networks (CSE-304) until 11:00 AM, followed by AI Lab at 11:00 AM in AI Lab - 1.',
      actionType: 'schedule',
      actionData: db.schedule,
    };
  }

  return {
    text: `I'm your Campus OS Assistant! I can help you find classrooms, check today's timetable, order food from Canteen A/B, or report maintenance tickets.`,
  };
}
