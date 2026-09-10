const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-menu");
const primaryNav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const dropdowns = document.querySelectorAll(".language-dropdown");

const safeStorage = (() => {
  try { return window.localStorage; } catch { return null; }
})();
const languageMeta = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Spanish", flag: "🇪🇸" },
  it: { name: "Italian", flag: "🇮🇹" },
};
const languageCurrent = document.querySelector("[data-language-current]");
const languageFlag = document.querySelector(".language-symbol");
const languageOptions = document.querySelectorAll("[data-language-option]");
const translations = {
  es: {
    "Home": "Inicio",
    "Menu": "Menu",
    "Contact us": "Contactenos",
    "Company": "Compania",
    "Investors": "Inversionistas",
    "USA": "EE. UU.",
    "Italy": "Italia",
    "Colombia": "Colombia",
    "Portfolio": "Portafolio",
    "Tenants": "Inquilinos",
    "Portfolio map": "Mapa del portafolio",
    "Location": "Ubicacion",
    "Locations": "Ubicaciones",
    "People": "Equipo",
    "Tenant listings": "Propiedades para inquilinos",
    "Contact": "Contacto",
    "Email Ponasa": "Enviar correo a Ponasa",
    "Site map": "Mapa del sitio",
    "Legal": "Legal",
    "Privacy policy": "Politica de privacidad",
    "Terms of use": "Terminos de uso",
    "Accessibility": "Accesibilidad",
    "Website information is not an offer or investment advice.": "La informacion del sitio no es una oferta ni asesoramiento de inversion.",
    "Ponasa LLC owns and manages real estate in Broward County, Florida.": "Ponasa LLC posee y administra bienes raices en el condado de Broward, Florida.",
    "Ponasa": "Ponasa",
    "Real estate, kept simple.": "Bienes raices, de forma simple.",
    "We own and manage properties with a long view.": "Poseemos y administramos propiedades con vision a largo plazo.",
    "Tenant listings": "Propiedades para inquilinos",
    "Contact Ponasa": "Contactar a Ponasa",
    "Residential, commercial, and hospitality properties.": "Propiedades residenciales, comerciales y hoteleras.",
    "A focused Broward County portfolio managed with a long view.": "Un portafolio enfocado en Broward County, administrado con vision a largo plazo.",
    "Explore the portfolio": "Ver el portafolio",
    "Local developments": "Desarrollos locales",
    "Broward County places people want to live.": "Lugares de Broward County donde la gente quiere vivir.",
    "Explore the local amenities and development patterns that continue to attract residents.": "Explore las comodidades locales y los patrones de desarrollo que siguen atrayendo residentes.",
    "Oakland Park Boulevard transit": "Transito de Oakland Park Boulevard",
    "Broward County plans a 15-mile rapid-transit corridor connecting A1A and Sawgrass Mills.": "Broward County planifica un corredor de transporte rapido de 15 millas entre A1A y Sawgrass Mills.",
    "Project details ->": "Detalles del proyecto ->",
    "Northwest-Progresso-Flagler Heights": "Northwest-Progresso-Flagler Heights",
    "The 2025 plan supports mixed-income housing, small businesses, adaptive reuse, and public spaces.": "El plan 2025 apoya viviendas de ingresos mixtos, pequenos negocios, reutilizacion adaptativa y espacios publicos.",
    "Read the plan ->": "Leer el plan ->",
    "BrowardNEXT": "BrowardNEXT",
    "The county land-use update addresses transportation, housing, climate, and redevelopment.": "La actualizacion de uso de suelo del condado aborda transporte, vivienda, clima y redesarrollo.",
    "County update ->": "Actualizacion del condado ->",
    "About Ponasa": "Sobre Ponasa",
    "Built through ownership experience.": "Construida con experiencia como propietarios.",
    "Ponasa began in 2004 in Southeast Florida and remains close to the properties and people it serves.": "Ponasa comenzo en 2004 en el sureste de Florida y se mantiene cerca de las propiedades y personas que atiende.",
    "Meet the company": "Conocer la compania",
    "Where we are": "Donde estamos",
    "One office, close to the work.": "Una oficina, cerca del trabajo.",
    "South Florida": "Sur de Florida",
    "United States": "Estados Unidos",
    "Oakland Park, Broward County": "Oakland Park, Broward County",
    "Have a property or opportunity to discuss?": "Tiene una propiedad u oportunidad para conversar?",
    "Get in touch": "Contactenos",
    "Office Location | Ponasa LLC": "Ubicaciones | Ponasa LLC",
    "Our Oakland Park office serves Ponasa LLC's Broward County portfolio.": "Nuestra oficina en Oakland Park atiende el portafolio de Ponasa LLC en Broward County.",
    "Property regions": "Regiones de propiedades",
    "Current office and future country pages.": "Oficina actual y paginas futuras por pais.",
    "These country cards are placeholders for future property details.": "Estas tarjetas de pais son marcadores para futuros detalles de propiedades.",
    "Florida": "Florida",
    "Open directions": "Abrir indicaciones",
    "Country placeholder": "Marcador de pais",
    "Future Italy property page.": "Pagina futura de propiedades en Italia.",
    "Open Italy page": "Abrir pagina de Italia",
    "Future Colombia property page.": "Pagina futura de propiedades en Colombia.",
    "Open Colombia page": "Abrir pagina de Colombia",
    "Portfolio": "Portafolio",
    "Find a Ponasa property.": "Encuentre una propiedad de Ponasa.",
    "Choose a property type to view its addresses and details.": "Elija un tipo de propiedad para ver direcciones y detalles.",
    "Tenant login": "Ingreso de inquilinos",
    "Property types": "Tipos de propiedad",
    "What are you looking for?": "Que esta buscando?",
    "Hospitality": "Hoteleria",
    "Commercial": "Comercial",
    "Residential": "Residencial",
    "Rental homes and apartments across Broward County.": "Casas y apartamentos de alquiler en Broward County.",
    "Properties": "Propiedades",
    "Select a property type above.": "Seleccione un tipo de propiedad arriba.",
    "Property cards open a detailed profile in a new tab.": "Las tarjetas abren un perfil detallado en una pestana nueva.",
    "No public properties available.": "No hay propiedades publicas disponibles.",
    "No public USA listings are loaded yet.": "Aun no hay listados publicos de EE. UU. cargados.",
    "No public Italy listings are loaded yet.": "Aun no hay listados publicos de Italia cargados.",
    "No public Colombia listings are loaded yet.": "Aun no hay listados publicos de Colombia cargados.",
    "This category is not listed online right now.": "Esta categoria no esta publicada en linea por ahora.",
    "View details": "Ver detalles",
    "Open property profile": "Abrir perfil de propiedad",
    "Property not found.": "Propiedad no encontrada.",
    "The requested property profile is not available.": "El perfil de propiedad solicitado no esta disponible.",
    "Back to property map": "Volver al mapa de propiedades",
    "Exterior photo": "Foto exterior",
    "Not listed": "No indicado",
    "Not applicable": "No aplica",
    "Studio": "Estudio",
    "Condominium": "Condominio",
    "Broward County": "Broward County",
    "Search properties": "Buscar propiedades",
    "Filter by ZIP code": "Filtrar por codigo postal",
    "All ZIP codes": "Todos los codigos postales",
    "Building facts and parcel locations are sourced from Broward County public records. Availability and lease terms are provided separately.": "Los datos de edificios y ubicaciones provienen de registros publicos de Broward County. La disponibilidad y terminos de alquiler se proporcionan por separado.",
    "Property map": "Mapa de propiedades",
    "Broward County locations.": "Ubicaciones en Broward County.",
    "Zoom, move the map, or select a pin to open a property profile.": "Acerque, mueva el mapa o seleccione un marcador para abrir un perfil de propiedad.",
    "All properties": "Todas las propiedades",
    "Reset view": "Restablecer vista",
    "Properties in the United States.": "Propiedades en Estados Unidos.",
    "Choose a property type to browse Ponasa listings in Broward County, Florida.": "Elija un tipo de propiedad para ver listados de Ponasa en Broward County, Florida.",
    "USA portfolio": "Portafolio de EE. UU.",
    "Choose a property type.": "Elija un tipo de propiedad.",
    "Beach House Fort Lauderdale.": "Beach House Fort Lauderdale.",
    "Oakland Park industrial space.": "Espacio industrial en Oakland Park.",
    "Properties in Italy.": "Propiedades en Italia.",
    "Choose a property type to browse Ponasa listings in Italy.": "Elija un tipo de propiedad para ver listados de Ponasa en Italia.",
    "Italy portfolio": "Portafolio de Italia",
    "Hospitality listings in Italy.": "Listados hoteleros en Italia.",
    "Commercial listings in Italy.": "Listados comerciales en Italia.",
    "Residential listings in Italy.": "Listados residenciales en Italia.",
    "Properties in Colombia.": "Propiedades en Colombia.",
    "Choose a property type to browse Ponasa listings in Colombia.": "Elija un tipo de propiedad para ver listados de Ponasa en Colombia.",
    "Colombia portfolio": "Portafolio de Colombia",
    "Hospitality listings in Colombia.": "Listados hoteleros en Colombia.",
    "Commercial listings in Colombia.": "Listados comerciales en Colombia.",
    "Residential listings in Colombia.": "Listados residenciales en Colombia.",
    "Built through real ownership experience.": "Construida con experiencia real como propietarios.",
    "Ponasa LLC started in 2004 in Southeast Florida and grew through patient decisions around real property.": "Ponasa LLC comenzo en 2004 en el sureste de Florida y crecio con decisiones pacientes sobre bienes raices.",
    "Our story": "Nuestra historia",
    "A steady approach to real estate.": "Un enfoque constante para bienes raices.",
    "Ponasa grew through ownership, timing, and a close understanding of the properties it manages.": "Ponasa crecio mediante propiedad, buen momento y conocimiento cercano de las propiedades que administra.",
    "Starting in Florida": "Inicio en Florida",
    "Buying through the downturn": "Compras durante la caida",
    "New markets and partnerships": "Nuevos mercados y alianzas",
    "Focused ownership": "Propiedad enfocada",
    "Starting in Southeast Florida": "Inicio en el sureste de Florida",
    "Ponasa was formed in March 2004. The first purchase was a 10-unit apartment building near Fort Lauderdale Airport, followed by apartments, homes, and warehouses in the area.": "Ponasa se formo en marzo de 2004. La primera compra fue un edificio de 10 apartamentos cerca del aeropuerto de Fort Lauderdale, seguido por apartamentos, casas y almacenes en la zona.",
    "The first property was sold profitably before the 2008 financial crisis, reinforcing the importance of timing as well as location.": "La primera propiedad se vendio con ganancia antes de la crisis financiera de 2008, reforzando la importancia del momento y la ubicacion.",
    "When the Florida market fell, Ponasa put its experience and capital to work. Acquisitions came through short sales, foreclosures, REO opportunities, and owners who needed to sell.": "Cuando el mercado de Florida cayo, Ponasa uso su experiencia y capital. Las adquisiciones llegaron mediante ventas cortas, ejecuciones hipotecarias, oportunidades REO y propietarios que necesitaban vender.",
    "That disciplined buying period created a diversified portfolio that could perform in both strong and difficult markets.": "Ese periodo disciplinado de compras creo un portafolio diversificado capaz de funcionar en mercados fuertes y dificiles.",
    "Ponasa began working in Barranquilla, Colombia, partnering with local construction companies and advising on land and capital opportunities.": "Ponasa comenzo a trabajar en Barranquilla, Colombia, con companias constructoras locales y asesorando en oportunidades de tierra y capital.",
    "In Italy, the portfolio began exploring short-term rentals in Florence, where tourism created a different path to property income.": "En Italia, el portafolio empezo a explorar alquileres de corto plazo en Florencia, donde el turismo creo otra via de ingresos inmobiliarios.",
    "Today, Ponasa owns properties for residential, commercial, and rental use. The company continues to prioritize dependable rental potential, careful management, and clear communication with the people it serves.": "Hoy, Ponasa posee propiedades residenciales, comerciales y de alquiler. La compania prioriza potencial de renta confiable, gestion cuidadosa y comunicacion clara con las personas que atiende.",
    "New opportunities are evaluated with the same long-term view: build through cash flow, care for the property, and stay ready for the next good acquisition.": "Las nuevas oportunidades se evaluan con la misma vision a largo plazo: crecer mediante flujo de caja, cuidar la propiedad y estar listos para la siguiente buena adquisicion.",
    "Start with a direct conversation.": "Comience con una conversacion directa.",
    "Tell us what you are working on and we will connect you with the right office.": "Cuentenos en que esta trabajando y lo conectaremos con la persona indicada.",
    "General inquiries": "Consultas generales",
    "One simple place to start.": "Un punto simple para empezar.",
    "For property, investment, or partnership questions, email Ponasa or call the United States office.": "Para preguntas sobre propiedades, inversiones o alianzas, escriba a Ponasa o llame a la oficina en Estados Unidos.",
    "U.S. office": "Oficina en EE. UU.",
    "View office locations": "Ver ubicaciones",
    "404": "404",
    "This page is not here.": "Esta pagina no esta aqui.",
    "The address may have changed, or the page is not available yet.": "La direccion pudo haber cambiado o la pagina aun no esta disponible.",
    "Back to home": "Volver al inicio",
    "Site map": "Mapa del sitio",
    "All pages.": "Todas las paginas.",
    "Main pages": "Paginas principales",
    "Tenants and portfolio": "Inquilinos y portafolio",
    "USA properties": "Propiedades en EE. UU.",
    "Italy properties": "Propiedades en Italia",
    "Colombia properties": "Propiedades en Colombia",
    "Property profiles": "Perfiles de propiedades",
    "Browse every publicly indexed Ponasa property profile.": "Explore todos los perfiles publicos de propiedades de Ponasa.",
    "Privacy Policy": "Politica de privacidad",
    "Terms of Use": "Terminos de uso",
    "Accessibility Statement": "Declaracion de accesibilidad",
    "Information we receive": "Informacion que recibimos",
    "Cookies and analytics": "Cookies y analitica",
    "How information is used": "Como se usa la informacion",
    "Disclosure": "Divulgacion",
    "Retention and security": "Retencion y seguridad",
    "Your choices": "Sus opciones",
    "Children": "Menores",
    "Changes and contact": "Cambios y contacto",
    "Informational website": "Sitio informativo",
    "No offer or advice": "Sin oferta ni asesoramiento",
    "Permitted use": "Uso permitido",
    "Ownership": "Propiedad intelectual",
    "Third-party services": "Servicios de terceros",
    "Disclaimers and liability": "Descargos y responsabilidad",
    "Governing law": "Ley aplicable",
    "Our approach": "Nuestro enfoque",
    "Feedback and assistance": "Comentarios y asistencia",
    "Ongoing work": "Trabajo continuo",
    "Property profile": "Perfil de propiedad",
    "Back to portfolio": "Volver al portafolio",
    "View on Zillow": "Ver en Zillow",
    "County property record": "Registro del condado",
    "County photo archive": "Archivo de fotos del condado",
    "County parcel map": "Mapa catastral del condado",
    "Google Maps": "Google Maps",
    "Building area": "Area construida",
    "Bedrooms": "Habitaciones",
    "Bathrooms": "Banos",
    "Year built": "Ano de construccion",
    "Property type": "Tipo de propiedad",
    "Lot size": "Tamano del lote",
    "Address": "Direccion",
    "Street address": "Direccion",
    "City": "Ciudad",
    "State": "Estado",
    "ZIP": "Codigo postal",
    "Public record": "Registro publico",
    "Parcel reference": "Referencia de parcela",
    "Owner": "Propietario",
    "County": "Condado",
    "Data source": "Fuente de datos",
    "External records": "Registros externos",
    "Zillow media": "Medios de Zillow",
    "Property facts are from Broward County public records and may differ from current leasing information. Contact Ponasa for availability and current terms.": "Los datos de la propiedad provienen de registros publicos de Broward County y pueden diferir de la informacion actual de alquiler. Contacte a Ponasa para disponibilidad y terminos actuales."
  },
  it: {
    "Home": "Home",
    "Menu": "Menu",
    "Contact us": "Contattaci",
    "Company": "Societa",
    "Investors": "Investitori",
    "USA": "USA",
    "Italy": "Italia",
    "Colombia": "Colombia",
    "Portfolio": "Portafoglio",
    "Tenants": "Inquilini",
    "Portfolio map": "Mappa del portafoglio",
    "Location": "Sede",
    "Locations": "Sedi",
    "People": "Team",
    "Tenant listings": "Immobili per inquilini",
    "Contact": "Contatto",
    "Email Ponasa": "Email a Ponasa",
    "Site map": "Mappa del sito",
    "Legal": "Legale",
    "Privacy policy": "Informativa privacy",
    "Terms of use": "Termini di utilizzo",
    "Accessibility": "Accessibilita",
    "Website information is not an offer or investment advice.": "Le informazioni del sito non sono un'offerta ne consulenza d'investimento.",
    "Ponasa LLC owns and manages real estate in Broward County, Florida.": "Ponasa LLC possiede e gestisce immobili nella contea di Broward, Florida.",
    "Ponasa": "Ponasa",
    "Real estate, kept simple.": "Immobiliare, in modo semplice.",
    "We own and manage properties with a long view.": "Possediamo e gestiamo proprieta con una visione di lungo periodo.",
    "Tenant listings": "Immobili per inquilini",
    "Contact Ponasa": "Contatta Ponasa",
    "Residential, commercial, and hospitality properties.": "Proprieta residenziali, commerciali e hospitality.",
    "A focused Broward County portfolio managed with a long view.": "Un portafoglio focalizzato nella contea di Broward, gestito con una visione di lungo periodo.",
    "Explore the portfolio": "Esplora il portafoglio",
    "Local developments": "Sviluppi locali",
    "Broward County places people want to live.": "Luoghi della contea di Broward dove le persone vogliono vivere.",
    "Explore the local amenities and development patterns that continue to attract residents.": "Scopri servizi locali e trend di sviluppo che continuano ad attrarre residenti.",
    "Oakland Park Boulevard transit": "Trasporto su Oakland Park Boulevard",
    "Broward County plans a 15-mile rapid-transit corridor connecting A1A and Sawgrass Mills.": "Broward County prevede un corridoio rapido di 15 miglia tra A1A e Sawgrass Mills.",
    "Project details ->": "Dettagli del progetto ->",
    "Northwest-Progresso-Flagler Heights": "Northwest-Progresso-Flagler Heights",
    "The 2025 plan supports mixed-income housing, small businesses, adaptive reuse, and public spaces.": "Il piano 2025 sostiene abitazioni a reddito misto, piccole imprese, riuso adattivo e spazi pubblici.",
    "Read the plan ->": "Leggi il piano ->",
    "BrowardNEXT": "BrowardNEXT",
    "The county land-use update addresses transportation, housing, climate, and redevelopment.": "L'aggiornamento dell'uso del territorio affronta trasporti, abitazioni, clima e riqualificazione.",
    "County update ->": "Aggiornamento della contea ->",
    "About Ponasa": "Chi e Ponasa",
    "Built through ownership experience.": "Costruita con esperienza diretta di proprieta.",
    "Ponasa began in 2004 in Southeast Florida and remains close to the properties and people it serves.": "Ponasa nasce nel 2004 nel sud-est della Florida e resta vicina alle proprieta e alle persone che serve.",
    "Meet the company": "Scopri la societa",
    "Where we are": "Dove siamo",
    "One office, close to the work.": "Una sede, vicina al lavoro.",
    "South Florida": "Sud della Florida",
    "United States": "Stati Uniti",
    "Oakland Park, Broward County": "Oakland Park, Broward County",
    "Have a property or opportunity to discuss?": "Hai una proprieta o un'opportunita da discutere?",
    "Get in touch": "Mettiti in contatto",
    "Office Location | Ponasa LLC": "Sedi | Ponasa LLC",
    "Our Oakland Park office serves Ponasa LLC's Broward County portfolio.": "La sede di Oakland Park segue il portafoglio Ponasa LLC nella contea di Broward.",
    "Property regions": "Regioni immobiliari",
    "Current office and future country pages.": "Sede attuale e future pagine paese.",
    "These country cards are placeholders for future property details.": "Queste schede paese sono segnaposto per futuri dettagli immobiliari.",
    "Florida": "Florida",
    "Open directions": "Apri indicazioni",
    "Country placeholder": "Segnaposto paese",
    "Future Italy property page.": "Futura pagina immobili in Italia.",
    "Open Italy page": "Apri pagina Italia",
    "Future Colombia property page.": "Futura pagina immobili in Colombia.",
    "Open Colombia page": "Apri pagina Colombia",
    "Find a Ponasa property.": "Trova una proprieta Ponasa.",
    "Choose a property type to view its addresses and details.": "Scegli un tipo di proprieta per vedere indirizzi e dettagli.",
    "Tenant login": "Accesso inquilini",
    "Property types": "Tipi di proprieta",
    "What are you looking for?": "Cosa stai cercando?",
    "Hospitality": "Hospitality",
    "Commercial": "Commerciale",
    "Residential": "Residenziale",
    "Rental homes and apartments across Broward County.": "Case e appartamenti in affitto nella contea di Broward.",
    "Properties": "Proprieta",
    "Select a property type above.": "Seleziona un tipo di proprieta sopra.",
    "Property cards open a detailed profile in a new tab.": "Le schede aprono un profilo dettagliato in una nuova scheda.",
    "No public properties available.": "Nessuna proprieta pubblica disponibile.",
    "No public USA listings are loaded yet.": "Non sono ancora caricati annunci pubblici USA.",
    "No public Italy listings are loaded yet.": "Non sono ancora caricati annunci pubblici in Italia.",
    "No public Colombia listings are loaded yet.": "Non sono ancora caricati annunci pubblici in Colombia.",
    "This category is not listed online right now.": "Questa categoria non e pubblicata online al momento.",
    "View details": "Vedi dettagli",
    "Open property profile": "Apri profilo immobile",
    "Property not found.": "Proprieta non trovata.",
    "The requested property profile is not available.": "Il profilo immobile richiesto non e disponibile.",
    "Back to property map": "Torna alla mappa immobili",
    "Exterior photo": "Foto esterna",
    "Not listed": "Non indicato",
    "Not applicable": "Non applicabile",
    "Studio": "Monolocale",
    "Condominium": "Condominio",
    "Broward County": "Broward County",
    "Search properties": "Cerca proprieta",
    "Filter by ZIP code": "Filtra per codice postale",
    "All ZIP codes": "Tutti i codici postali",
    "Building facts and parcel locations are sourced from Broward County public records. Availability and lease terms are provided separately.": "Dati degli edifici e posizioni catastali provengono dai registri pubblici di Broward County. Disponibilita e termini di locazione sono forniti separatamente.",
    "Property map": "Mappa immobili",
    "Broward County locations.": "Ubicazioni in Broward County.",
    "Zoom, move the map, or select a pin to open a property profile.": "Ingrandisci, sposta la mappa o seleziona un pin per aprire un profilo immobile.",
    "All properties": "Tutte le proprieta",
    "Reset view": "Ripristina vista",
    "Properties in the United States.": "Proprieta negli Stati Uniti.",
    "Choose a property type to browse Ponasa listings in Broward County, Florida.": "Scegli un tipo di proprieta per vedere gli immobili Ponasa in Broward County, Florida.",
    "USA portfolio": "Portafoglio USA",
    "Choose a property type.": "Scegli un tipo di proprieta.",
    "Beach House Fort Lauderdale.": "Beach House Fort Lauderdale.",
    "Oakland Park industrial space.": "Spazio industriale a Oakland Park.",
    "Properties in Italy.": "Proprieta in Italia.",
    "Choose a property type to browse Ponasa listings in Italy.": "Scegli un tipo di proprieta per vedere gli immobili Ponasa in Italia.",
    "Italy portfolio": "Portafoglio Italia",
    "Hospitality listings in Italy.": "Immobili hospitality in Italia.",
    "Commercial listings in Italy.": "Immobili commerciali in Italia.",
    "Residential listings in Italy.": "Immobili residenziali in Italia.",
    "Properties in Colombia.": "Proprieta in Colombia.",
    "Choose a property type to browse Ponasa listings in Colombia.": "Scegli un tipo di proprieta per vedere gli immobili Ponasa in Colombia.",
    "Colombia portfolio": "Portafoglio Colombia",
    "Hospitality listings in Colombia.": "Immobili hospitality in Colombia.",
    "Commercial listings in Colombia.": "Immobili commerciali in Colombia.",
    "Residential listings in Colombia.": "Immobili residenziali in Colombia.",
    "Built through real ownership experience.": "Costruita con esperienza reale di proprieta.",
    "Ponasa LLC started in 2004 in Southeast Florida and grew through patient decisions around real property.": "Ponasa LLC nasce nel 2004 nel sud-est della Florida e cresce con decisioni pazienti sugli immobili.",
    "Our story": "La nostra storia",
    "A steady approach to real estate.": "Un approccio costante all'immobiliare.",
    "Ponasa grew through ownership, timing, and a close understanding of the properties it manages.": "Ponasa e cresciuta con proprieta, tempismo e conoscenza diretta degli immobili che gestisce.",
    "Starting in Florida": "Inizio in Florida",
    "Buying through the downturn": "Acquisti durante la flessione",
    "New markets and partnerships": "Nuovi mercati e partnership",
    "Focused ownership": "Proprieta focalizzata",
    "Starting in Southeast Florida": "Inizio nel sud-est della Florida",
    "Ponasa was formed in March 2004. The first purchase was a 10-unit apartment building near Fort Lauderdale Airport, followed by apartments, homes, and warehouses in the area.": "Ponasa e stata costituita nel marzo 2004. Il primo acquisto fu un edificio di 10 appartamenti vicino all'aeroporto di Fort Lauderdale, seguito da appartamenti, case e magazzini nella zona.",
    "The first property was sold profitably before the 2008 financial crisis, reinforcing the importance of timing as well as location.": "La prima proprieta fu venduta con profitto prima della crisi finanziaria del 2008, rafforzando l'importanza del tempismo oltre alla posizione.",
    "When the Florida market fell, Ponasa put its experience and capital to work. Acquisitions came through short sales, foreclosures, REO opportunities, and owners who needed to sell.": "Quando il mercato della Florida scese, Ponasa mise al lavoro esperienza e capitale. Le acquisizioni arrivarono tramite short sale, pignoramenti, opportunita REO e proprietari che dovevano vendere.",
    "That disciplined buying period created a diversified portfolio that could perform in both strong and difficult markets.": "Quel periodo disciplinato di acquisti creo un portafoglio diversificato capace di funzionare in mercati forti e difficili.",
    "Ponasa began working in Barranquilla, Colombia, partnering with local construction companies and advising on land and capital opportunities.": "Ponasa inizio a lavorare a Barranquilla, Colombia, collaborando con imprese edili locali e offrendo consulenza su opportunita di terreni e capitale.",
    "In Italy, the portfolio began exploring short-term rentals in Florence, where tourism created a different path to property income.": "In Italia, il portafoglio inizio a esplorare affitti brevi a Firenze, dove il turismo creo un diverso percorso di reddito immobiliare.",
    "Today, Ponasa owns properties for residential, commercial, and rental use. The company continues to prioritize dependable rental potential, careful management, and clear communication with the people it serves.": "Oggi Ponasa possiede proprieta residenziali, commerciali e in locazione. La societa continua a dare priorita a potenziale di affitto affidabile, gestione attenta e comunicazione chiara.",
    "New opportunities are evaluated with the same long-term view: build through cash flow, care for the property, and stay ready for the next good acquisition.": "Le nuove opportunita sono valutate con la stessa visione di lungo periodo: crescere con il flusso di cassa, curare la proprieta e restare pronti per la prossima buona acquisizione.",
    "Start with a direct conversation.": "Inizia con una conversazione diretta.",
    "Tell us what you are working on and we will connect you with the right office.": "Raccontaci su cosa stai lavorando e ti collegheremo alla persona giusta.",
    "General inquiries": "Richieste generali",
    "One simple place to start.": "Un punto semplice da cui iniziare.",
    "For property, investment, or partnership questions, email Ponasa or call the United States office.": "Per domande su proprieta, investimenti o partnership, scrivi a Ponasa o chiama la sede negli Stati Uniti.",
    "U.S. office": "Sede USA",
    "View office locations": "Vedi sedi",
    "404": "404",
    "This page is not here.": "Questa pagina non e qui.",
    "The address may have changed, or the page is not available yet.": "L'indirizzo potrebbe essere cambiato o la pagina non e ancora disponibile.",
    "Back to home": "Torna alla home",
    "All pages.": "Tutte le pagine.",
    "Main pages": "Pagine principali",
    "Tenants and portfolio": "Inquilini e portafoglio",
    "USA properties": "Proprieta USA",
    "Italy properties": "Proprieta Italia",
    "Colombia properties": "Proprieta Colombia",
    "Property profiles": "Profili immobili",
    "Browse every publicly indexed Ponasa property profile.": "Sfoglia tutti i profili immobiliari pubblici di Ponasa.",
    "Privacy Policy": "Informativa privacy",
    "Terms of Use": "Termini di utilizzo",
    "Accessibility Statement": "Dichiarazione di accessibilita",
    "Information we receive": "Informazioni che riceviamo",
    "Cookies and analytics": "Cookie e analytics",
    "How information is used": "Come vengono usate le informazioni",
    "Disclosure": "Divulgazione",
    "Retention and security": "Conservazione e sicurezza",
    "Your choices": "Le tue scelte",
    "Children": "Minori",
    "Changes and contact": "Modifiche e contatti",
    "Informational website": "Sito informativo",
    "No offer or advice": "Nessuna offerta o consulenza",
    "Permitted use": "Uso consentito",
    "Ownership": "Proprieta",
    "Third-party services": "Servizi di terze parti",
    "Disclaimers and liability": "Esclusioni e responsabilita",
    "Governing law": "Legge applicabile",
    "Our approach": "Il nostro approccio",
    "Feedback and assistance": "Feedback e assistenza",
    "Ongoing work": "Lavoro continuo",
    "Property profile": "Profilo immobile",
    "Back to portfolio": "Torna al portafoglio",
    "View on Zillow": "Vedi su Zillow",
    "County property record": "Registro della contea",
    "County photo archive": "Archivio foto della contea",
    "County parcel map": "Mappa catastale della contea",
    "Google Maps": "Google Maps",
    "Building area": "Superficie edificio",
    "Bedrooms": "Camere",
    "Bathrooms": "Bagni",
    "Year built": "Anno di costruzione",
    "Property type": "Tipo di proprieta",
    "Lot size": "Dimensione lotto",
    "Address": "Indirizzo",
    "Street address": "Indirizzo",
    "City": "Citta",
    "State": "Stato",
    "ZIP": "CAP",
    "Public record": "Registro pubblico",
    "Parcel reference": "Riferimento particella",
    "Owner": "Proprietario",
    "County": "Contea",
    "Data source": "Fonte dati",
    "External records": "Registri esterni",
    "Zillow media": "Media Zillow",
    "Property facts are from Broward County public records and may differ from current leasing information. Contact Ponasa for availability and current terms.": "I dati della proprieta provengono dai registri pubblici di Broward County e possono differire dalle informazioni attuali di locazione. Contatta Ponasa per disponibilita e termini aggiornati."
  }
};
const translatableSelector = "a, button, h1, h2, h3, p, span, strong, small, label, option, dt, dd, li";
let currentLanguage = "en";
const storedLanguage = safeStorage?.getItem("ponasa-language") ?? "en";
const updateLanguageControl = (selected) => {
  const meta = languageMeta[selected] ?? languageMeta.en;
  if (languageFlag) {
    languageFlag.textContent = meta.flag;
    languageFlag.setAttribute("aria-hidden", "true");
  }
  if (languageCurrent) languageCurrent.textContent = meta.name;
  languageOptions.forEach((option) => {
    const optionLanguage = option.dataset.languageOption ?? "en";
    const optionMeta = languageMeta[optionLanguage] ?? languageMeta.en;
    option.innerHTML = `<span class="language-option-flag" aria-hidden="true">${optionMeta.flag}</span><span>${optionMeta.name}</span>`;
    option.setAttribute("aria-checked", String(optionLanguage === selected));
  });
};
const applyTranslations = (language, root = document) => {
  const table = translations[language] ?? {};
  document.documentElement.lang = language;
  root.querySelectorAll(translatableSelector).forEach((element) => {
    if (element.closest(".language-dropdown, .market-strip, .property-map, .leaflet-container")) return;
    if (element.childElementCount > 0) return;
    const currentText = element.textContent.replace(/\s+/g, " ").trim();
    const sourceText = element.dataset.i18nSource || currentText;
    if (!element.dataset.i18nSource && !translations.es[sourceText] && !translations.it[sourceText]) return;
    element.dataset.i18nSource = sourceText;
    element.textContent = table[sourceText] ?? sourceText;
  });
};
const setLanguage = (language) => {
  const selected = languageMeta[language] ? language : "en";
  currentLanguage = selected;
  updateLanguageControl(selected);
  safeStorage?.setItem("ponasa-language", selected);
  applyTranslations(selected);
};
setLanguage(storedLanguage);

const footerVideoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_210218_173f8eba-17ff-4e27-972b-d128af25bf49.mp4";
document.querySelectorAll(".site-footer").forEach((footer) => {
  if (footer.querySelector(".footer-video")) return;
  const video = document.createElement("video");
  video.className = "footer-video";
  video.src = footerVideoUrl;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("aria-hidden", "true");
  footer.prepend(video);
});

const closeDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector("button")?.setAttribute("aria-expanded", "false");
  });
};
const closeMenu = () => {
  siteNav?.classList.remove("open");
  document.body.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.classList.remove("is-open");
  closeDropdowns();
};

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") ?? false;
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuToggle.classList.toggle("is-open", isOpen);
});
dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector("button");
  let closeTimer;
  const openDropdown = () => {
    window.clearTimeout(closeTimer);
    closeDropdowns();
    dropdown.classList.add("open");
    trigger?.setAttribute("aria-expanded", "true");
  };
  const scheduleClose = () => {
    closeTimer = window.setTimeout(() => {
      if (dropdown.contains(document.activeElement)) return;
      dropdown.classList.remove("open");
      trigger?.setAttribute("aria-expanded", "false");
    }, 180);
  };
  dropdown.addEventListener("mouseenter", openDropdown);
  dropdown.addEventListener("mouseleave", scheduleClose);
  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains("open");
    closeDropdowns();
    dropdown.classList.toggle("open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
  dropdown.addEventListener("focusout", (event) => {
    if (event.relatedTarget instanceof Node && dropdown.contains(event.relatedTarget)) return;
    dropdown.classList.remove("open");
    trigger?.setAttribute("aria-expanded", "false");
  });
});
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && !event.target.closest(".nav-dropdown")) closeDropdowns();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdowns();
    if (siteNav?.classList.contains("open")) closeMenu();
  }
});
languageOptions.forEach((option) => option.addEventListener("click", () => {
  setLanguage(option.dataset.languageOption ?? "en");
  closeDropdowns();
}));
document.querySelectorAll(".site-menu a").forEach((link) => link.addEventListener("click", closeMenu));

const normalizePath = (value) => {
  const path = value.split("?")[0].split("#")[0].replace(/\/index(?:\.html)?$/, "/").replace(/\.html$/, "");
  return path === "" ? "/" : path;
};
const current = normalizePath(window.location.pathname);
document.querySelectorAll(".site-nav > a, .site-menu a").forEach((link) => {
  const linkPath = normalizePath(new URL(link.getAttribute("href") ?? "/", window.location.origin).pathname);
  if (linkPath === current) link.classList.add("active");
});
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 12);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const tickerTrack = document.querySelector(".market-track");
const tickerControl = document.querySelector(".ticker-control");
tickerControl?.addEventListener("click", () => {
  const paused = tickerTrack?.classList.toggle("paused") ?? false;
  tickerControl.setAttribute("aria-pressed", String(paused));
  tickerControl.setAttribute("aria-label", paused ? "Play market ticker" : "Pause market ticker");
  tickerControl.textContent = paused ? ">" : "||";
});

const marketSymbols = [
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE" },
  { symbol: "BAC", name: "Bank of America", exchange: "NYSE" },
  { symbol: "WFC", name: "Wells Fargo", exchange: "NYSE" },
  { symbol: "C", name: "Citigroup", exchange: "NYSE" },
  { symbol: "GS", name: "Goldman Sachs", exchange: "NYSE" },
];

const financeUrl = ({ symbol, exchange }) => `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}:${encodeURIComponent(exchange)}`;

const formatMarket = (value, change) => {
  const price = value == null ? Number.NaN : Number(value);
  const delta = change == null ? Number.NaN : Number(change);
  return { price: Number.isFinite(price) ? `$${price.toFixed(2)}` : "--", change: Number.isFinite(delta) ? `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%` : "--", down: Number.isFinite(delta) && delta < 0 };
};

const renderMarketTicker = (quotes = {}, unavailable = false) => {
  if (!tickerTrack) return;
  const pricedMarkets = marketSymbols.filter((market) => Number.isFinite(Number(quotes[market.symbol]?.price)));
  const visibleMarkets = pricedMarkets.length ? pricedMarkets : marketSymbols;
  const repeatCount = Math.max(6, Math.ceil(24 / visibleMarkets.length));
  const items = visibleMarkets.map((market) => {
    const quote = formatMarket(quotes[market.symbol]?.price, quotes[market.symbol]?.change);
    const detail = quote.price === "--" ? (unavailable ? "Quote delayed" : "Loading price") : quote.price;
    const movement = quote.change === "--" ? (unavailable ? "Refresh later" : "Updating") : quote.change;
    return `<a class="market-item" href="${financeUrl(market)}" target="_blank" rel="noopener" aria-label="${market.name} stock price on Google Finance"><strong>${market.symbol}</strong><span>${detail}</span><em class="${quote.down ? "down" : ""}">${movement}</em></a>`;
  });
  tickerTrack.innerHTML = Array.from({ length: repeatCount }, () => items).flat().join("");
};

const loadMarketData = async () => {
  renderMarketTicker();
  const liveSymbols = marketSymbols.map((market) => market.symbol);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(`/api/market?symbols=${liveSymbols.join(",")}`);
      if (!response.ok) throw new Error("Market data unavailable");
      const payload = await response.json();
      const quotes = payload.quotes ?? payload;
      renderMarketTicker(quotes, Boolean(payload.unavailable));
      if (!payload.refreshing) return;
    } catch { renderMarketTicker({}, true); return; }
    await new Promise((resolve) => setTimeout(resolve, 1600));
  }
};
if (tickerTrack) loadMarketData();

document.querySelectorAll("[data-carousel], [data-video-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".development-slide, .video-slide")];
  const section = carousel.closest("section") ?? document;
  const count = section.querySelector("#development-count, #portfolio-count, #video-count");
  const previous = section.querySelector("[data-carousel-prev], [data-video-prev]");
  const next = section.querySelector("[data-carousel-next], [data-video-next]");
  let activeSlide = 0;
  let autoAdvance;
  const showSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      const video = slide.querySelector("video");
      if (isActive) video?.play().catch(() => {});
      else { video?.pause(); if (video) video.currentTime = 0; }
    });
    if (count) count.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };
  const restartAutoAdvance = () => {
    if (autoAdvance) window.clearInterval(autoAdvance);
    if (!carousel.querySelector("video") && slides.length > 1) autoAdvance = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  };
  previous?.addEventListener("click", () => { showSlide(activeSlide - 1); restartAutoAdvance(); });
  next?.addEventListener("click", () => { showSlide(activeSlide + 1); restartAutoAdvance(); });
  slides.forEach((slide) => slide.querySelector("video")?.addEventListener("ended", () => showSlide(activeSlide + 1)));
  carousel.addEventListener("mouseenter", () => { if (autoAdvance) window.clearInterval(autoAdvance); });
  carousel.addEventListener("mouseleave", restartAutoAdvance);
  carousel.addEventListener("focusin", () => { if (autoAdvance) window.clearInterval(autoAdvance); });
  carousel.addEventListener("focusout", restartAutoAdvance);
  showSlide(0);
  restartAutoAdvance();
});

const timelineItems = [...document.querySelectorAll("[data-timeline-item]")];
const timelineButtons = [...document.querySelectorAll("[data-timeline-target]")];
const setTimelineItem = (id) => {
  timelineItems.forEach((item) => item.classList.toggle("is-active", item.id === id));
  timelineButtons.forEach((button) => button.classList.toggle("active", button.dataset.timelineTarget === id));
};
timelineButtons.forEach((button) => button.addEventListener("click", () => {
  document.getElementById(button.dataset.timelineTarget ?? "")?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimelineItem(button.dataset.timelineTarget ?? "");
}));
if (timelineItems.length && "IntersectionObserver" in window) {
  const timelineObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setTimelineItem(visible.target.id);
  }, { rootMargin: "-35% 0px -45%", threshold: [0.1, 0.4, 0.8] });
  timelineItems.forEach((item) => timelineObserver.observe(item));
}

const propertyGrid = document.querySelector("#property-grid");
const propertySearch = document.querySelector("#property-search");
const propertyZip = document.querySelector("#property-zip");
const propertyResults = document.querySelector("#property-results");
const propertyProfile = document.querySelector("#property-profile");
const portfolioDirectory = document.querySelector("[data-portfolio-directory]");
const portfolioButtons = document.querySelectorAll("[data-portfolio-category]");
const propertyDirectoryTitle = document.querySelector("#property-directory-title");
const propertyDirectoryKicker = document.querySelector("#property-directory-kicker");
const propertyDirectoryCopy = document.querySelector("#property-directory-copy");
const countryPage = document.body?.dataset.countryPage ?? "";
const countryNames = { usa: "USA", italy: "Italy", colombia: "Colombia" };
let activePortfolioCategory = "";

const escapePropertyHtml = (value) => String(value).replace(/[&<>\"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;",
}[character]));
const zillowSlug = (address) => address.replace(/[#,\.]/g, "").replace(/\s+/g, "-");
const zillowSearchUrl = (address) => `https://www.zillow.com/homes/${zillowSlug(address)}_rb/`;
const propertySlug = (property) => property.address
  .normalize("NFKD")
  .toLowerCase()
  .replace(/#/g, " unit ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const propertyDetailUrl = (property) => `/portfolio/${propertySlug(property)}`;
const folioPlain = (property) => property.folio.replace(/-/g, "");
const bcpaRecordUrl = (property) => `https://web.bcpa.net/bcpaclient/#/Record-Search?folio=${encodeURIComponent(folioPlain(property))}`;
const bcpaMapUrl = (property) => `https://gisweb-adapters.bcpa.net/bcpawebmap_ex_new/bcpawebmap.aspx?FOLIO=${encodeURIComponent(folioPlain(property))}`;
const googleMapsUrl = (property) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`;
const propertyZipCode = (property) => property.address.match(/\b\d{5}\b/)?.[0] ?? "";
const propertyCities = ["DEERFIELD BEACH", "POMPANO BEACH", "NORTH LAUDERDALE", "LAUDERDALE LAKES", "FORT LAUDERDALE", "OAKLAND PARK", "UNINCORPORATED", "LAUDERHILL", "HOLLYWOOD", "TAMARAC", "SUNRISE"];
const addressBeforeState = (property) => property.address.replace(/\s+FL\s+\d{5}\s*$/, "").replace(/\s+/g, " ");
const propertyCity = (property) => propertyCities.find((city) => addressBeforeState(property).endsWith(` ${city}`)) ?? "Broward County";
const propertyStreet = (property) => addressBeforeState(property).replace(new RegExp(`\\s+${propertyCity(property)}$`), "");
const propertyLabel = (property) => property.address.replace(/\s+FL\s+\d{5}\s*$/, "").replace(/\s+/g, " ");
const propertyCategory = (property) => {
  if (property.folio === "504201GJ1190") return "hospitality";
  if (property.folio === "494214-09-0300") return "commercial";
  return "residential";
};
const propertyMedia = (property) => window.PONASA_EXTERIOR_MEDIA?.[property.folio];
const propertyDetails = (property) => window.PONASA_PROPERTY_DETAILS?.[property.folio] ?? {};
const propertyZillowMedia = (property) => window.PONASA_VERIFIED_MEDIA?.[property.folio];
const propertyZillowUrl = (property) => propertyZillowMedia(property)?.zillowUrl ?? zillowSearchUrl(property.address);
const propertyMapPoint = (property) => window.PONASA_PROPERTY_COORDINATES?.[property.folio] ?? window.PONASA_PARCEL_COORDINATES?.[property.folio];
const fallbackPropertyImage = (property) => propertyCategory(property) === "hospitality"
  ? "/assets/hilton-beach-house-1.webp"
  : "/assets/ponasa-holdings-band.png";

const renderPropertyMap = () => {
  const mapElement = document.querySelector("#property-map");
  if (!mapElement || !Array.isArray(window.PONASA_PROPERTIES) || !window.L) return;
  const mapControls = document.querySelectorAll("[data-map-filter]");
  const mapReset = document.querySelector("[data-map-reset]");
  const mapCount = document.querySelector("#map-property-count");
  const map = window.L.map(mapElement, {
    scrollWheelZoom: true,
    zoomControl: false,
    zoomAnimation: true,
    markerZoomAnimation: true,
    fadeAnimation: true,
    inertia: true,
    inertiaDeceleration: 2400,
    wheelPxPerZoomLevel: 92,
  });
  window.L.control.zoom({ position: "bottomright" }).addTo(map);
  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  }).addTo(map);
  const allBounds = [];
  const markers = [];
  const iconForCategory = (category) => window.L.divIcon({
    className: `property-marker property-marker-${category}`,
    html: "<span></span>",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
  const fitVisibleMarkers = (visibleBounds) => {
    if (visibleBounds.length) {
      map.flyToBounds(visibleBounds, { padding: [28, 28], maxZoom: visibleBounds.length === 1 ? 15 : 12, duration: 0.75 });
    }
  };
  window.PONASA_PROPERTIES.forEach((property) => {
    const point = propertyMapPoint(property);
    if (!Array.isArray(point) || point.length !== 2) return;
    allBounds.push(point);
    const detailUrl = propertyDetailUrl(property);
    const address = propertyLabel(property);
    const category = propertyCategory(property);
    const marker = window.L.marker(point, { icon: iconForCategory(category), title: address, category })
      .addTo(map)
      .bindPopup(`<div class="map-popup"><strong>${escapePropertyHtml(address)}</strong><span>${escapePropertyHtml(propertyCity(property))}, Florida</span><a href="${escapePropertyHtml(detailUrl)}" target="_blank" rel="noopener">Open property profile <span aria-hidden="true">→</span></a></div>`);
    markers.push(marker);
  });
  const updateVisibleMarkers = (filter = "all") => {
    const visibleBounds = [];
    markers.forEach((marker) => {
      const shouldShow = filter === "all" || marker.options.category === filter;
      if (shouldShow) {
        if (!map.hasLayer(marker)) marker.addTo(map);
        visibleBounds.push(marker.getLatLng());
      } else if (map.hasLayer(marker)) {
        marker.removeFrom(map);
      }
    });
    mapControls.forEach((control) => control.classList.toggle("active", control.dataset.mapFilter === filter));
    if (mapCount) {
      mapCount.textContent = `${visibleBounds.length} mapped ${visibleBounds.length === 1 ? "property" : "properties"}`;
    }
    fitVisibleMarkers(visibleBounds);
  };
  mapControls.forEach((control) => {
    control.addEventListener("click", () => updateVisibleMarkers(control.dataset.mapFilter ?? "all"));
  });
  mapReset?.addEventListener("click", () => updateVisibleMarkers("all"));
  if (allBounds.length) map.fitBounds(allBounds, { padding: [28, 28], maxZoom: 12 });
  if (mapCount) mapCount.textContent = `${markers.length} mapped ${markers.length === 1 ? "property" : "properties"}`;
  window.requestAnimationFrame(() => {
    map.invalidateSize();
    if (allBounds.length) map.fitBounds(allBounds, { padding: [28, 28], maxZoom: 12 });
  });
};

const renderPropertyDirectory = () => {
  if (!propertyGrid || !Array.isArray(window.PONASA_PROPERTIES)) return;
  if (portfolioDirectory) portfolioDirectory.hidden = false;
  const query = (propertySearch?.value ?? "").trim().toLowerCase();
  const selectedZip = propertyZip?.value ?? "";
  const visibleProperties = window.PONASA_PROPERTIES.filter((property) => {
    const matchesCountry = !countryPage || (property.country ?? "usa") === countryPage;
    const matchesCategory = !activePortfolioCategory || propertyCategory(property) === activePortfolioCategory;
    const matchesQuery = !query || `${property.address} ${property.folio}`.toLowerCase().includes(query);
    const matchesZip = !selectedZip || propertyZipCode(property) === selectedZip;
    return matchesCountry && matchesCategory && matchesQuery && matchesZip;
  });

  propertyGrid.innerHTML = visibleProperties.length ? visibleProperties.map((property, index) => {
    const media = propertyMedia(property);
    const imageUrl = media?.imageUrl || fallbackPropertyImage(property);
    const fallbackUrl = fallbackPropertyImage(property);
    const details = propertyDetails(property);
    const area = details.buildingSqFt ? `${details.buildingSqFt.toLocaleString()} sq ft` : propertyCity(property);
    return `<a class="property-card" href="${escapePropertyHtml(propertyDetailUrl(property))}" target="_blank" rel="noopener" aria-label="Open profile for ${escapePropertyHtml(propertyLabel(property))} in a new tab"><span class="property-card-index">${String(index + 1).padStart(2, "0")}</span><span class="property-media"><img src="${escapePropertyHtml(imageUrl)}" alt="Exterior of ${escapePropertyHtml(propertyLabel(property))}" loading="lazy" onerror="this.onerror=null;this.src='${escapePropertyHtml(fallbackUrl)}'"><span>View details</span></span><span class="property-card-body"><span class="property-card-kicker">${escapePropertyHtml(area)}</span><strong>${escapePropertyHtml(property.address.replace(/\s+/g, " "))}</strong><span class="text-link">Open property profile <span aria-hidden="true">→</span></span></span></a>`;
  }).join("") : `<div class="empty-state"><p class="eyebrow">${escapePropertyHtml(activePortfolioCategory || "Properties")}</p><h3>No public properties available.</h3><p>${countryPage ? `No public ${escapePropertyHtml(countryNames[countryPage] ?? countryPage)} listings are loaded yet.` : "This category is not listed online right now."}</p></div>`;
  if (propertyResults) propertyResults.textContent = `${visibleProperties.length} ${visibleProperties.length === 1 ? "property" : "properties"}`;
  applyTranslations(currentLanguage);
};

if (propertyGrid && Array.isArray(window.PONASA_PROPERTIES)) {
  const zipCodes = [...new Set(window.PONASA_PROPERTIES
    .filter((property) => !countryPage || (property.country ?? "usa") === countryPage)
    .map(propertyZipCode)
    .filter(Boolean))].sort();
  zipCodes.forEach((zip) => propertyZip?.insertAdjacentHTML("beforeend", `<option value="${zip}">${zip}</option>`));
  propertySearch?.addEventListener("input", renderPropertyDirectory);
  propertyZip?.addEventListener("change", renderPropertyDirectory);
  portfolioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activePortfolioCategory = button.dataset.portfolioCategory ?? "";
      if (propertySearch) propertySearch.value = "";
      if (propertyZip) propertyZip.value = "";
      portfolioButtons.forEach((item) => item.classList.toggle("active", item === button));
      portfolioButtons.forEach((item) => item.setAttribute("aria-expanded", String(item === button)));
      const categoryLabels = {
        hospitality: ["Hospitality", "Hospitality property", countryPage === "usa" ? "Beachfront hospitality in Fort Lauderdale." : "Hospitality listings for this country."],
        commercial: ["Commercial", "Commercial property", countryPage === "usa" ? "Commercial space in Oakland Park." : "Commercial listings for this country."],
        residential: ["Residential", "Residential properties", countryPage === "usa" ? "Rental homes and apartments across Broward County." : "Residential listings for this country."],
      };
      const [kicker, title, copy] = categoryLabels[activePortfolioCategory] ?? ["Properties", "Ponasa properties", "Property profiles and public-record details."];
      if (propertyDirectoryKicker) propertyDirectoryKicker.textContent = kicker;
      if (propertyDirectoryTitle) propertyDirectoryTitle.textContent = title;
      if (propertyDirectoryCopy) propertyDirectoryCopy.textContent = copy;
      renderPropertyDirectory();
      applyTranslations(currentLanguage);
      portfolioDirectory?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

const renderPropertyProfile = () => {
  if (!propertyProfile || !Array.isArray(window.PONASA_PROPERTIES)) return;
  const slugFromPath = decodeURIComponent(window.location.pathname.match(/^\/portfolio\/([^/]+)\/?$/)?.[1] ?? "");
  const legacyFolio = decodeURIComponent(window.location.pathname.match(/^\/property\/([^/]+)\/?$/)?.[1] ?? "") || new URLSearchParams(window.location.search).get("folio");
  const property = window.PONASA_PROPERTIES.find((item) => propertySlug(item) === slugFromPath || item.folio === legacyFolio);
  if (!property) {
    document.title = "Property not found | Ponasa";
    propertyProfile.innerHTML = '<a class="property-back-link" href="/portfolio">Back to property map</a><div class="empty-state"><p class="eyebrow">Property</p><h1>Property not found.</h1><p>The requested property profile is not available.</p></div>';
    return;
  }
  const media = propertyMedia(property);
  const details = propertyDetails(property);
  const zillowMedia = propertyZillowMedia(property);
  const zillowUrl = propertyZillowUrl(property);
  const zip = propertyZipCode(property);
  const city = propertyCity(property);
  const sourceItems = [
    { label: "View on Zillow", url: zillowUrl },
    { label: "County property record", url: bcpaRecordUrl(property) },
    { label: "County photo archive", url: media?.photoPageUrl },
    { label: "County parcel map", url: bcpaMapUrl(property) },
    { label: "Google Maps", url: googleMapsUrl(property) },
  ].filter((item) => item.url);
  const zillowGallery = zillowMedia?.imageUrls?.length
    ? `<section class="property-panel"><p class="eyebrow">Zillow media</p><div class="property-mini-gallery">${zillowMedia.imageUrls.map((imageUrl) => `<a href="${escapePropertyHtml(zillowUrl)}" target="_blank" rel="noopener"><img src="${escapePropertyHtml(imageUrl)}" alt="Zillow media for ${escapePropertyHtml(propertyLabel(property))}" loading="lazy"></a>`).join("")}</div></section>`
    : "";

  document.title = `${propertyStreet(property)} | Ponasa`;
  const description = `Ponasa LLC property profile for ${propertyLabel(property)}, folio ${property.folio}.`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.append(canonical);
  }
  canonical.setAttribute("href", `https://ponasa.com${propertyDetailUrl(property)}`);
  const category = propertyCategory(property);
  const missingValue = category === "commercial" ? "Not applicable" : "Not listed";
  const detailFacts = [
    ["Building area", details.buildingSqFt ? `${details.buildingSqFt.toLocaleString()} sq ft` : "Not listed"],
    ["Bedrooms", details.beds != null ? (details.beds < 1 ? "Studio" : String(details.beds)) : missingValue],
    ["Bathrooms", details.baths != null ? String(details.baths) : missingValue],
    ["Year built", details.yearBuilt || "Not listed"],
    ["Property type", details.type || category],
    ["Lot size", details.lot || (category === "hospitality" ? "Condominium" : "Not listed")],
  ];
  const imageUrl = media?.imageUrl || fallbackPropertyImage(property);
  propertyProfile.innerHTML = `
    <a class="property-back-link" href="/portfolio">Back to portfolio</a>
    <div class="property-profile-hero">
      <div class="property-profile-media">
        <img src="${escapePropertyHtml(imageUrl)}" alt="Exterior of ${escapePropertyHtml(propertyLabel(property))}" onerror="this.onerror=null;this.src='${escapePropertyHtml(fallbackPropertyImage(property))}'">
        <span>${escapePropertyHtml(media?.photoCount ? `${media.photoCount} county photos available` : "Exterior photo")}</span>
      </div>
      <div class="property-profile-copy">
        <p class="eyebrow">Property profile</p>
        <h1>${escapePropertyHtml(propertyStreet(property))}</h1>
        <p>${escapePropertyHtml(property.address)}</p>
        <div class="property-action-row">
          ${sourceItems.map((item) => `<a class="button ${item.label === "View on Zillow" ? "primary" : "secondary"}" href="${escapePropertyHtml(item.url)}" target="_blank" rel="noopener">${escapePropertyHtml(item.label)}</a>`).join("")}
        </div>
      </div>
    </div>
    <section class="property-facts" aria-label="Property facts">
      ${detailFacts.map(([label, value]) => `<article><span>${escapePropertyHtml(label)}</span><strong>${escapePropertyHtml(value)}</strong></article>`).join("")}
    </section>
    <section class="property-detail-grid" aria-label="Property details">
      <article class="property-panel"><p class="eyebrow">Address</p><dl><div><dt>Street address</dt><dd>${escapePropertyHtml(propertyStreet(property))}</dd></div><div><dt>City</dt><dd>${escapePropertyHtml(city)}</dd></div><div><dt>State</dt><dd>Florida</dd></div><div><dt>ZIP</dt><dd>${escapePropertyHtml(zip)}</dd></div></dl></article>
      <article class="property-panel"><p class="eyebrow">Public record</p><dl><div><dt>Parcel reference</dt><dd>${escapePropertyHtml(property.folio)}</dd></div><div><dt>Owner</dt><dd>Ponasa LLC</dd></div><div><dt>County</dt><dd>Broward County</dd></div><div><dt>Data source</dt><dd>Broward County Property Appraiser</dd></div></dl></article>
      <article class="property-panel"><p class="eyebrow">External records</p><div class="property-link-list">${sourceItems.map((item) => `<a href="${escapePropertyHtml(item.url)}" target="_blank" rel="noopener">${escapePropertyHtml(item.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div></article>
      ${zillowGallery}
    </section>
    <p class="property-source-note">Property facts are from Broward County public records and may differ from current leasing information. Contact Ponasa for availability and current terms.</p>`;
  applyTranslations(currentLanguage);
};

renderPropertyProfile();

const propertySitemapList = document.querySelector("#property-sitemap-list");
if (propertySitemapList && Array.isArray(window.PONASA_PROPERTIES)) {
  propertySitemapList.innerHTML = window.PONASA_PROPERTIES.map((property) => `<li><a href="${escapePropertyHtml(propertyDetailUrl(property))}">${escapePropertyHtml(property.address.replace(/\s+/g, " "))}</a><span>Property profile</span></li>`).join("");
  applyTranslations(currentLanguage);
}

renderPropertyMap();
