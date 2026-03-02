export const questions = [
    // Student questions
    {
        id: 1,
        text: "Ik ben tevreden met mijn sociale contacten op school",
        category: "student",
        type: "slider",
        hasWistJeDat: true
    },
    {
        id: 2,
        text: "Ik voel mij op school op mijn plek",
        category: "student",
        type: "slider"
    },
    {
        id: 3,
        category: "student",
        type: "words",
        hasDynamicText: true,
        question: "Wat maakt dat ik !NIET! op mijn plek zit op school?",
        options: [
            "Vrienden", "Sfeer", "Docenten", "Lesstof", "Activiteiten",
            "Studiedruk", "Klasgenoten", "Ruimte", "Omgeving", "Anders"
        ]
    },
    {
        id: 4,
        category: "student",
        type: "emotion",
        question: "De afgelopen weken voelde ik me:",
        hasWistJeDat: true
    },
    {
        id: 5,
        category: "student",
        type: "words",
        question: "Welke woorden beschrijven verdrietig het beste?",
        options: [
            "Verloren", "Moe", "Eenzaam", "Hulpeloos", "Ongemotiveerd",
            "Teleurgesteld", "Verveeld", "Buitengesloten"
        ]
    },
    {
        id: 6,
        category: "student",
        type: "words",
        question: "Welke woorden beschrijven verdrietig het beste?",
        options: [
            "Doelloos", "Uitgeput", "Geïsoleerd", "Gebroken",
            "Opgebrand", "Depressief", "Verdoofd", "Gekwetst"
        ]
    },
    {
        id: 7,
        category: "student",
        type: "body",
        question: "Ik voel al deze emoties ook in mijn lichaam op deze plekken:",
        hasWistJeDat: true
    },
    
    // Werknemer questions
    {
        id: 8,
        text: "Ik ben tevreden met mijn sociale contacten op werk",
        category: "werknemer",
        type: "slider",
        hasWistJeDat: true
    },
    {
        id: 9,
        text: "Ik voel mij op mijn werk op mijn plek",
        category: "werknemer",
        type: "slider"
    },
    {
        id: 10,
        category: "werknemer",
        type: "words",
        hasDynamicText: true,
        question: "Wat maakt dat ik !NIET! op mijn plek zit op werk?",
        options: [
            "Collega's", "Sfeer", "Leidinggevende", "Werkdruk", "Taken",
            "Stress", "Team", "Werkplek", "Omgeving", "Anders"
        ]
    },
    {
        id: 11,
        category: "werknemer",
        type: "emotion",
        question: "De afgelopen weken voelde ik me:",
        hasWistJeDat: true
    },
    {
        id: 12,
        category: "werknemer",
        type: "words",
        question: "Welke woorden beschrijven mijn gevoel op werk het beste?",
        options: [
            "Gestrest", "Overbelast", "Onzeker", "Gefrustreerd", "Ongemotiveerd",
            "Teleurgesteld", "Overweldigd", "Buitengesloten"
        ]
    },
    {
        id: 13,
        category: "werknemer",
        type: "words",
        question: "Welke woorden beschrijven mijn werkbeleving het beste?",
        options: [
            "Uitgeput", "Gespannen", "Geïsoleerd", "Incompetent",
            "Opgebrand", "Ontevreden", "Machteloos", "Ondergewaardeerd"
        ]
    },
    {
        id: 14,
        category: "werknemer",
        type: "body",
        question: "Ik voel al deze emoties ook in mijn lichaam op deze plekken:",
        hasWistJeDat: true
    },
    
    // Vriend questions
    {
        id: 15,
        text: "Ik ben tevreden met mijn vriendschappen",
        category: "vriend",
        type: "slider",
        hasWistJeDat: true
    },
    {
        id: 16,
        text: "Ik voel mij op mijn gemak bij mijn vrienden",
        category: "vriend",
        type: "slider"
    },
    {
        id: 17,
        category: "vriend",
        type: "words",
        hasDynamicText: true,
        question: "Wat maakt dat ik mij !NIET! op mijn gemak voel bij vrienden?",
        options: [
            "Groepsdruk", "Verwachtingen", "Vertrouwen", "Activiteiten", "Communicatie",
            "Tijd", "Begrip", "Afstand", "Interesses", "Anders"
        ]
    },
    {
        id: 18,
        category: "vriend",
        type: "emotion",
        question: "De afgelopen weken voelde ik me met vrienden:",
        hasWistJeDat: true
    },
    {
        id: 19,
        category: "vriend",
        type: "words",
        question: "Welke woorden beschrijven mijn sociale gevoel het beste?",
        options: [
            "Onzeker", "Alleen", "Buitengesloten", "Verlegen", "Afstandelijk",
            "Onbegrepen", "Gespannen", "Teruggetrokken"
        ]
    },
    {
        id: 20,
        category: "vriend",
        type: "words",
        question: "Welke woorden beschrijven mijn vriendschappen het beste?",
        options: [
            "Oppervlakkig", "Vermoeiend", "Geïsoleerd", "Onecht",
            "Verwarrend", "Onbetrouwbaar", "Eenzaam", "Gecompliceerd"
        ]
    },
    {
        id: 21,
        category: "vriend",
        type: "body",
        question: "Ik voel al deze emoties ook in mijn lichaam op deze plekken:",
        hasWistJeDat: true
    },
    
    // Familielid questions
    {
        id: 22,
        text: "Ik ben tevreden met mijn familierelaties",
        category: "familielid",
        type: "slider",
        hasWistJeDat: true
    },
    {
        id: 23,
        text: "Ik voel mij thuis bij mijn familie",
        category: "familielid",
        type: "slider"
    },
    {
        id: 24,
        category: "familielid",
        type: "words",
        hasDynamicText: true,
        question: "Wat maakt dat ik mij !NIET! thuis voel bij familie?",
        options: [
            "Verwachtingen", "Sfeer", "Communicatie", "Verleden", "Tradities",
            "Druk", "Relaties", "Ruimte", "Begrip", "Anders"
        ]
    },
    {
        id: 25,
        category: "familielid",
        type: "emotion",
        question: "De afgelopen weken voelde ik me bij familie:",
        hasWistJeDat: true
    },
    {
        id: 26,
        category: "familielid",
        type: "words",
        question: "Welke woorden beschrijven mijn familiegevoel het beste?",
        options: [
            "Onbegrepen", "Gespannen", "Afgewezen", "Machteloos", "Gefrustreerd",
            "Teleurgesteld", "Ongemakkelijk", "Vervreemd"
        ]
    },
    {
        id: 27,
        category: "familielid",
        type: "words",
        question: "Welke woorden beschrijven mijn familierelaties het beste?",
        options: [
            "Gecompliceerd", "Belastend", "Afstandelijk", "Beschadigd",
            "Gespannen", "Pijnlijk", "Verwarrend", "Onveilig"
        ]
    },
    {
        id: 28,
        category: "familielid",
        type: "body",
        question: "Ik voel al deze emoties ook in mijn lichaam op deze plekken:",
        hasWistJeDat: true,
        wistJeDat: "/components/wistjedat/q28.js"
    }
];