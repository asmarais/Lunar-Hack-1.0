interface LocationData {
  roomId: string;
  building: string;
  floor: string;
  description: string;
}

interface ProcedureData {
  name: string;
  steps: string[];
  deadline?: string;
  contactInfo?: string;
}

// Room location data
const roomLocations: Record<string, LocationData> = {
  'a-101': {
    roomId: 'A-101',
    building: 'Arts Building',
    floor: '1st Floor',
    description: 'Located at the east entrance of the Arts Building, this is a lecture hall with capacity for 120 students.'
  },
  'b-205': {
    roomId: 'B-205',
    building: 'Business Building',
    floor: '2nd Floor',
    description: 'Located in the north wing of the Business Building, this is a medium-sized classroom with capacity for 40 students.'
  },
  'c-310': {
    roomId: 'C-310',
    building: 'Computer Science Building',
    floor: '3rd Floor',
    description: 'A computer lab located in the west wing of the Computer Science Building with 30 workstations.'
  },
  's-102': {
    roomId: 'S-102',
    building: 'Science Building',
    floor: '1st Floor',
    description: 'A large laboratory located in the Science Building, equipped for chemistry experiments.'
  },
  'l-201': {
    roomId: 'L-201',
    building: 'Library',
    floor: '2nd Floor',
    description: 'A quiet study space in the Library with individual study carrels and reference materials.'
  }
};

// Administrative procedures
const procedures: Record<string, ProcedureData> = {
  'registration': {
    name: 'Class Registration',
    steps: [
      'Log in to the Student Portal using your campus ID and password.',
      'Navigate to the "Registration" tab.',
      'Search for courses using the course code or title.',
      'Select the courses you want to register for and add them to your cart.',
      'Review your selection and click "Submit Registration".',
      'Pay any required fees through the payment portal.'
    ],
    deadline: 'Registration deadlines are typically two weeks before the semester begins',
    contactInfo: 'registrar@campus.edu or visit the Registrar\'s Office in Admin Building Room 101'
  },
  'transcripts': {
    name: 'Requesting Transcripts',
    steps: [
      'Log in to the Student Portal using your campus ID and password.',
      'Navigate to the "Records" tab.',
      'Select "Request Official Transcript".',
      'Choose delivery method (electronic or physical mail).',
      'Pay the transcript fee.',
      'Submit your request.'
    ],
    contactInfo: 'records@campus.edu or visit the Records Office in Admin Building Room 103'
  },
  'financial-aid': {
    name: 'Applying for Financial Aid',
    steps: [
      'Complete the FAFSA (Free Application for Federal Student Aid) at fafsa.gov.',
      'Submit any additional required documents to the Financial Aid Office.',
      'Check your Student Portal for financial aid status updates.',
      'Accept or decline your financial aid offers through the Student Portal.',
      'Complete any required entrance counseling or promissory notes.'
    ],
    deadline: 'Priority deadline is typically March 1st for the following academic year',
    contactInfo: 'finaid@campus.edu or visit the Financial Aid Office in Admin Building Room 105'
  },
  'parking': {
    name: 'Obtaining a Parking Permit',
    steps: [
      'Log in to the Campus Services Portal.',
      'Navigate to "Parking Services".',
      'Select the type of parking permit you need (student, faculty, etc.).',
      'Provide your vehicle information (make, model, license plate).',
      'Pay the parking permit fee.',
      'Your permit will be available for pickup at the Campus Safety Office or mailed to you.'
    ],
    contactInfo: 'parking@campus.edu or visit the Campus Safety Office in Safety Building Room 101'
  },
  'graduation': {
    name: 'Applying for Graduation',
    steps: [
      'Meet with your academic advisor to ensure all requirements will be met.',
      'Log in to the Student Portal.',
      'Navigate to the "Graduation" tab.',
      'Complete the graduation application form.',
      'Pay the graduation fee.',
      'Order your cap and gown through the campus bookstore.'
    ],
    deadline: 'Applications are typically due three months before the end of your final semester',
    contactInfo: 'graduation@campus.edu or visit the Registrar\'s Office in Admin Building Room 101'
  }
};

// Helper function to match room patterns in user input
const findRoomInText = (text: string): string | null => {
  // Look for room patterns like A-101, B205, etc.
  const roomPatterns = [
    /\b([a-z])-(\d{3})\b/i,  // Format: A-101
    /\b([a-z])(\d{3})\b/i,   // Format: A101
    /\broom\s+([a-z])-?(\d{3})\b/i  // Format: Room A-101 or Room A101
  ];
  
  for (const pattern of roomPatterns) {
    const match = text.match(pattern);
    if (match) {
      const building = match[1].toLowerCase();
      const roomNumber = match[2];
      return `${building}-${roomNumber}`;
    }
  }
  
  return null;
};

// Helper function to match procedure keywords in user input
const findProcedureInText = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  
  const procedureKeywords: Record<string, string[]> = {
    'registration': ['register', 'registration', 'sign up for class', 'enroll', 'class registration'],
    'transcripts': ['transcript', 'academic record', 'get transcript', 'request transcript'],
    'financial-aid': ['financial aid', 'scholarship', 'fafsa', 'finance', 'aid', 'money for school'],
    'parking': ['parking', 'park', 'parking permit', 'car', 'vehicle'],
    'graduation': ['graduate', 'graduation', 'commencement', 'apply to graduate', 'cap and gown']
  };
  
  for (const [procedure, keywords] of Object.entries(procedureKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return procedure;
    }
  }
  
  return null;
};

/**
 * Get chatbot response based on user input
 */
export const getChatbotResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  // Check for room location queries
  const roomId = findRoomInText(input);
  if (roomId && roomLocations[roomId.toLowerCase()]) {
    const room = roomLocations[roomId.toLowerCase()];
    return `Room ${room.roomId} is located in the ${room.building} on the ${room.floor}. ${room.description}`;
  }
  
  if (input.includes('where is') || input.includes('location of') || input.includes('find room')) {
    return "I can help you find room locations on campus. Please specify the room number (e.g., 'Where is Room A-101?').";
  }
  
  // Check for procedure queries
  const procedureId = findProcedureInText(input);
  if (procedureId && procedures[procedureId]) {
    const procedure = procedures[procedureId];
    
    let response = `Here's how to ${procedure.name}:\n\n`;
    procedure.steps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });
    
    if (procedure.deadline) {
      response += `\nDeadline: ${procedure.deadline}.`;
    }
    
    if (procedure.contactInfo) {
      response += `\nFor more information: ${procedure.contactInfo}`;
    }
    
    return response;
  }
  
  if (input.includes('how do i') || input.includes('how to') || input.includes('procedure')) {
    return "I can help you with administrative procedures. Try asking about class registration, requesting transcripts, applying for financial aid, obtaining a parking permit, or applying for graduation.";
  }
  
  // General inquiries
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return "Hello! I'm your Smart Campus Assistant. How can I help you today?";
  }
  
  if (input.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  
  if (input.includes('bye') || input.includes('goodbye')) {
    return "Goodbye! Feel free to come back if you have more questions.";
  }
  
  // Default response
  return "I'm not sure I understand. You can ask me about room locations (e.g., 'Where is Room A-101?') or administrative procedures (e.g., 'How do I register for classes?').";
};