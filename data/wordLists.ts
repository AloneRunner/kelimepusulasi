import { Category } from '../types';

// Helper to sort and deduplicate (Türkçe karakter duyarlı sıralama ve temizleme)
const prepareList = (words: string[]) => 
  Array.from(new Set(words.map(w => w.toLocaleLowerCase('tr-TR'))))
       .sort((a, b) => a.localeCompare(b, 'tr-TR'));

// --- ANA KATEGORİ LİSTELERİ ---



const animals = prepareList([
  // A
  "ağaçkakan", "ahtapot", "akbaba", "akrep", "aksolotl", "alabalık", "albatros", "alpaka", "anakonda", "angut", "antilop", "arı", "arıkuşu", "armadillo", "aslan", "at", "ateşböceği", "atmaca", "ayı", "aygır",
  // B
  "babun", "bağ ahtapotu", "bal porsuğu", "balarısı", "balık", "balıkçıl", "balina", "barakuda", "barbun", "basilik", "baykuş", "bengal kaplanı", "bıldırcın", "bizon", "boa yılanı", "boğa", "bokböceği", "bonobo", "böcek", "bufalo", "bukalemun", "bülbül",
  // C - Ç
  "canavar", "ceylan", "cırcırböceği", "civciv", "ceviz kurdu", "çakal", "çalıkuşu", "çekirge", "çita", "çinekop", "çipura", "çiyan", "çöl tilkisi",
  // D
  "dağ keçisi", "dağ aslanı", "dalmaçyalı", "dana", "deniz aslanı", "deniz fili", "deniz ineği", "deniz kaplumbağası", "denizanası", "denizatı", "denizyıldızı", "deve", "devekuşu", "dingo", "dinozor", "dobermani", "doğan", "domuz", "dodo", "dugong",
  // E
  "ebabil", "ejderha", "ekidne", "engerek", "eşek", "eşekarısı",
  // F
  "fare", "fener balığı", "feret", "fil", "flamingo", "fok", "fokbalığı", "firavun faresi",
  // G
  "gaga", "gelincik", "geko", "gergedan", "geyik", "gibon", "goril", "gökkuşağı alabalığı", "güvercin", "güve", "grifon",
  // H
  "hamsi", "hamster", "haşere", "hayalet yengeç", "hindi", "hipopotam", "horoz", "husky",
  // I - İ
  "ıstakoz", "ıslıkçı", "ibibik", "iguana", "impala", "inek", "insan", "istavrit", "istiridye", "ispinoz",
  // J
  "jaguar", "jakana",
  // K
  "kakadu", "kalkan", "kanguru", "kanarya", "kapibara", "kaplumbağa", "kaplan", "karadul", "karakulak", "karayel", "karga", "karides", "karınca", "karıncayiyen", "kartal", "katır", "katil balina", "kaz", "keçi", "kedi", "kefal", "keklik", "kelebek", "kene", "kanguru faresi", "kerkenes", "kertenkele", "kırlangıç", "kırkayak", "kısrak", "kızıl geyik", "kirpi", "koala", "kobra", "koç", "kokarca", "kolibri", "komodo ejderi", "koyun", "köpek", "köpekbalığı", "köstebek", "kuğu", "kumru", "kunduz", "kurbağa", "kurt", "kuş", "kuzgun", "kuzu",
  // L
  "labrador", "lama", "langust", "lemur", "leopar", "levrek", "leylek", "lüfer", "linet",
  // M
  "makak", "mamut", "manda", "mandril", "mantis", "marmoset", "martı", "maymun", "mazgallı", "mercan", "mezgit", "mirket", "midye", "mors", "müren", "müsk",
  // N
  "nautilus", "narval",
  // O - Ö
  "oğlak", "okapi", "orangutan", "orkinos", "ornitorenk", "otçul", "öküz", "ördek", "örümcek", "ötücü kuş",
  // P
  "palamut", "panda", "panter", "papağan", "pars", "patates böceği", "pavurya", "pelikan", "penguen", "pirana", "pire", "pisi balığı", "piton", "plankton", "porsuk", "puma", "puhu",
  // R
  "rakun", "red panda", "retriever", "rotvayler",
  // S - Ş
  "saka", "salyangoz", "sardalya", "sincap", "sansar", "sazan", "semender", "serçe", "sıçan", "sığır", "sinek", "sivrisinek", "skink", "solucan", "somon", "su aygırı", "su samuru", "sülün", "sülük", "susamuru",
  "şahin", "şempanze", "şebek",
  // T
  "takahe", "tamarın", "tapir", "tarantula", "tasman", "tavşan", "tavuk", "tavuskuşu", "tay", "tekir", "tembel hayvan", "tenrek", "termit", "terrier", "tilki", "timsah", "tohum kargası", "ton balığı", "toprak solucanı", "turna", "tırtıl",
  // U - Ü
  "uğurböceği", "uskumru", "uzun bacak", "üveyik",
  // V
  "vaşak", "vatoz", "vicuna", "viper",
  // Y
  "yaban arısı", "yaban domuzu", "yaban keçisi", "yalıçapkını", "yarasa", "yayın balığı", "yengeç", "yılan", "yunus", "yusufçuk",
  // Z
  "zargana", "zebra", "zebu", "zürafa"
]);

const food = prepareList([
  // Meyveler & Sebzeler
  "ahududu", "altınçilek", "ananas", "armut", "avokado", "ayva",
  "bamya", "bezelye", "biber", "böğürtlen", "brokoli", "balkabağı",
  "ceviz", "ciğer",
  "çağla", "çarkıfelek", "çekirdek", "çilek", "çikolata",
  "dereotu", "domates", "dut",
  "elma", "enginar", "erik", 
  "fasulye", "fındık", "fıstık", "frambuaz",
  "greyfurt",
  "havuç", "hıyar", "hindistan cevizi", "hurma",
  "ıspanak",
  "incir", 
  "jelibon",
  "kabak", "karnabahar", "karpuz", "kavun", "kayısı", "kestane", "kereviz", "kiraz", "kivi", "kuşburnu", "kumpir",
  "lahana", "limon", "lokum",
  "mandalina", "mango", "mantar", "marul", "maydanoz", "mercimek", "mısır", "muşmula", "muz",
  "nane", "nar", "nektarin", "nohut",
  "papaya", "patates", "patlıcan", "pazı", "pırasa", "pirinç", "portakal",
  "roka",
  "salatalık", "sarımsak", "semizotu", "soğan", "susam",
  "şeftali", "şekerpare",
  "tere", "turp", "turşu",
  "üryani", "üzüm",
  "vişne",
  "yer elması",
  "zencefil", "zeytin",

  // Yemekler, Tatlılar & İçecekler (YENİ EKLENENLER DAHİL)
  "acıbadem", "adana kebap", "alinazik", "arabaşı", "arnavut ciğeri", "aşure", "atom", "ayran", "ayvalı tas kebabı",
  "baba gannuş", "badem ezmesi", "baklava", "balık ekmek", "bamya", "barbunya", "bazlama", "beyran", "beyti", "biber dolması", "bisküvi", "börek", "börülce", "boza", "bulgur", "büryan",
  "cacık", "cağ kebabı", "cheesecake", "ciğer şiş", "çaman", "çarşaf böreği", "çerkez tavuğu", "çiğ börek", "çiğ köfte", "çökertme", "çorba", "çullama",
  "dalyan köfte", "damla sakızı", "dereotlu poğaça", "dilber dudağı", "dolma", "domates çorbası", "dondurma", "döner", "dürüm", "düğün çorbası",
  "ekler", "ekmek", "elma şekeri", "erişte", "ezine peyniri", "ezogelin",
  "fava", "felafel", "fırın sütlaç", "fıstık ezmesi", "focaccia", "fondü",
  "gavurdağı", "gelincik şerbeti", "gözleme", "guacamole", "gül böreği", "güllaç",
  "halep işi", "hamburger", "hamsi tava", "hanım göbeği", "haşhaş", "hatay döneri", "haydari", "helva", "hibeş", "hindi dolma", "hoşaf", "hünkarbeğendi",
  "ıhlamur", "ıslak kek", "ıslama köfte", "içli köfte", "imam bayıldı", "irmik helvası", "iskembe", "iskender", "izmir köfte",
  "kabak çiçeği", "kabak tatlısı", "kadayıf", "kadınbudu", "kahve", "kalburabastı", "kanat", "kapuska", "karadut", "karnıyarık", "katmer", "kaymak", "kazandibi", "kebap", "keşkek", "keşkül", "kestane şekeri", "kısır", "kıyma", "kokoreç", "komposto", "koz helva", "köfte", "kumpir", "künefe", "kuru fasulye", "kuşkonmaz", "kuzukulağı", "küşleme", "kruvasan",
  "lahmacun", "lakerda", "laz böreği", "lokma",
  "madımak", "magnolia", "makarna", "makaron", "malaga", "manlama", "mantı", "menemen", "mercimek köftesi", "mıhlama", "milföy", "muhallebi", "mumbar", "mücver",
  "nohutlu pilav", "noodle",
  "omlet", "oralet", "ordövr", "orman kebabı", "öğlen",
  "paçanga", "paluze", "pancar", "papaz yahnisi", "pasta", "patlıcan musakka", "pavlova", "pekmez", "perde pilavı", "pestil", "pide", "pilav", "pişi", "piyaz", "pizza", "poğaça", "profiterol",
  "ramazan pidesi", "reçel", "revani", "reyhan", "rizotto", "rosto",
  "sahlep", "salata", "salep", "sarma", "siron", "simit", "soda", "soğan halkası", "söğüş", "su böreği", "sucuk", "supangle", "sushi", "süt", "süt mısır", "sütlaç",
  "şambali", "şakşuka", "şekerpare", "şıra", "şöbiyet",
  "taco", "tahin", "tahin pekmez", "tantuni", "tarator", "tarhana", "tas kebabı", "tava ciğer", "tekirdağ köftesi", "tel kadayıf", "topik", "tost", "traliçe", "trileçe", "tulumba", "türlü",
  "un helvası", "urfa dürüm",
  "vejetaryen pizza", "vezir parmağı",
  "waffle",
  "yağlama", "yaprak ciğer", "yayla çorbası", "yoğurt", "yumurta", "yuvalama",
  "zerde", "zeytinyağlı"
  ,
  // Yeni eklemeler
  "açma", "ayran", "badem", "bazlama", "bisküvi", "börek", "çörek", "çubuk kraker", "dondurma", "döner",
  "galeta", "gofret", "hamburger", "hoşbeş", "kantin tostu", "kaşarlı tost", "kraker", "kuru yemiş", "meyve suyu", "oralet", "poğaça", "sandviç", "simit", "sosisli", "tost", "turta", "waffle"
]);

const objects = prepareList([
  "abajur", "ajanda", "akvaryum", "albüm", "alyans", "amblem", "anahtar", "anahtarlık", "ampul", "ansiklopedi", "aplike", "arma", "armatür", "askı", "aspiratör", "ataş", "ayakkabı", "ayna",
  "balkon", "balta", "bank", "bant", "bardak", "baret", "basamak", "baskül", "baston", "battaniye", "bavul", "bayrak", "beşik", "biberon", "biblo", "bıçak", "bileme taşı", "bilezik", "bilgisayar", "bilye", "bisturi", "blender", "bohça", "boncuk", "boru", "bozukluk", "broşür", "bulaşık", "bülten", "büyüteç",
  "cetvel", "cezve", "cımbız", "cırt cırt", "cop", "cüzdan",
  "çadır", "çakı", "çakmak", "çan", "çanta", "çarşaf", "çatal", "çekiç", "çekpas", "çelenk", "çengelli iğne", "çerçeve", "çeşme", "çip", "çivi", "çöp kutusu", "çorap",
  "damacana", "damga", "davul", "defter", "delgeç", "demir", "deney tüpü", "deterjan", "dikiş makinesi", "diş fırçası", "diş ipi", "dizüstü", "dolap", "dosya", "dudak kremi", "düdük", "düğme", "dürbün", "dümen",
  "el feneri", "eldiven", "elek", "elbise", "emzik", "esans", "etiket",
  "faraş", "fener", "fıç", "fırça", "fırın", "fiş", "fiskiye", "fitil", "flash bellek", "fincan", "flama", "folyo", "fön makinesi",
  "gazete", "gitar", "gönye", "gözlük", "gömlek", "gübre",
  "halat", "halı", "hamak", "harita", "hatıra", "havan", "havlu", "hesap cüzdanı", "hesap makinesi", "heykel", "heybe", "hızma", "hoparlör", "hortum", "huni",
  "ıstampa", "ızgara",
  "ibrik", "iğne", "ilaç", "imleç", "imza", "ip", "iplik", "iskambil",
  "jaluzi", "jant", "jelatin", "jeneratör", "jeton", "jilet", "joystick",
  "kablo", "kadeh", "kağıt", "kalem", "kalıp", "kamera", "kamçı", "kanepe", "kapı", "karyola", "kasa", "kase", "kaset", "kask", "kaşe", "kaşık", "katlanır sandalye", "kavanoz", "kazan", "kazma", "kelepçe", "kepenk", "kerpeten", "kese", "kılçık", "kilit", "kimlik", "kiremit", "kırtasiye", "kitap", "klavye", "koli bandı", "koltuk", "kopça", "korniş", "korsan bant", "kova", "kristal", "kulaklık", "kumbara", "kupa", "künye", "küpe", "kürdan", "kürek",
  "lamba", "lastik", "lavabo", "levha", "levye", "lolipop",
  "madalya", "makas", "makara", "makbuz", "makyaj çantası", "mandal", "manivela", "masa", "maske", "matara", "matkap", "mektup", "mendil", "merdiven", "mermer", "meşale", "mezura", "mikrofon", "mıknatıs", "minder", "muşamba", "mum", "musluk", "mühür", "mücevher kutusu",
  "nargile", "nazarlık", "not defteri",
  "ocak", "olta", "oyuncak",
  "önlük", "örtü",
  "paket", "pamuk", "pano", "pantolon", "para", "parfüm", "pasaport", "paslanmaz", "paspas", "peçete", "pense", "perde", "pergel", "peruk", "pil", "pipo", "plaka", "plaket", "pompa", "poşet", "posta kutusu", "priz", "projektör", "pudra", "puset", "pülverizatör",
  "radyo", "raf", "randa", "raptiye", "rende", "resim", "rimel", "roman", "rozet", "ruj", "rulo",
  "saat", "sabun", "sabunluk", "sac", "saç kurutma", "saç spreyi", "saksı", "sandalye", "sandık", "sarkaç", "sargı", "sepet", "sertifika", "sehpa", "silgi", "silikon", "siren", "soba", "soket", "sorguç", "stetoskop", "su sayacı", "suluk", "süngü", "süpürge", "sünger", "sürahi", "süzgeç",
  "şampuan", "şapka", "şarj aleti", "şemsiye", "şerit", "şezlong", "şifreli kilit", "şişe", "şömine", "şövale", "şırınga",
  "tabak", "tablo", "tabure", "takoz", "takvim", "tarak", "tasma", "tava", "tebeşir", "tekerlekli sandalye", "telefon", "teleskop", "telsiz", "tencere", "tepsi", "terazi", "terlik", "termos", "termometre", "tesbih", "testere", "teyp", "tıraş bıçağı", "toka", "top", "toplu iğne", "torba", "tornavida", "törpü", "tuğla", "tulum", "tuzluk", "tütsü",
  "uçurtma", "uydu alıcısı", "uyku tulumu",
  "ütü",
  "vantilatör", "vazo", "valiz", "varil", "vernik", "vida", "vinç", "vitrin",
  "yastık", "yapıştırıcı", "yelpaze", "yemlik", "yorgan", "yüzük",
  "zar", "zarf", "zil", "zımba", "zımpara", "zincir", "zırh"
  ,
  // Yeni eklemeler
  "akıllı tahta", "ataş", "bant", "beslenme çantası", "bloknot", "boya kalemi", "çıtçıt",
  "derslik", "diploma", "dosya kağıdı", "el işi kağıdı", "etiket", "fasikül", "föy", "fotokopi", "gönye",
  "harita", "hesap makinesi", "ıstampa", "iletki", "kalemlik", "kalemtraş", "karne", "karton", "kitaplık", "klasör", "koli bandı", "kroki",
  "matara", "mezuniyet", "mürekkep", "pano", "pastel boya", "pergeli", "proyektör", "raptiye", "resim defteri", "sözlük", "stiker", "suluk", "sunum dosyası", "şeffaf dosya",
  "tablet", "tahta kalemi", "tahta silgisi", "tebeşir", "tükenmez kalem", "uçlu kalem", "yapışkanlı kağıt", "yaka kartı", "yazı tahtası"
]);


const professions = prepareList([
  "acente", "aktör", "aktris", "analist", "animatör", "antrenör", "antropolog", "arabulucu", "arkeolog", "asansörlü nakliyeci", "astronot", "astrofizikçi", "astronom", "aşçı", "avukat", "ayakkabıcı",
  "baca temizleyicisi", "bahçıvan", "baharatçı", "bakan", "bakıcı", "bakkal", "balerin", "balıkçı", "bankacı", "barmen", "başbakan", "başhekim", "bekçi", "berber", "besteci", "bilim insanı", "bilgisayarcı", "biyokimyager", "biyolog", "blogger", "borsacı", "boyacı", "börekçi",
  "camcı", "can kurtaran", "cerrah", "cillopçu",
  "çaycı", "çevirmen", "çiftçi", "çiçekçi", "çilingir", "çizimci", "çoban", "çömlekçi", "çöpçü",
  "dadı", "dalgıç", "danışman", "dansçı", "davulcu", "dedektif", "değirmenci", "demirci", "denizci", "dermatolog", "diplomat", "diş hekimi", "diyetisyen", "doktor", "doçent", "dublaj sanatçısı",
  "ebru sanatçısı", "eczacı", "editör", "eğitmen", "ekolojist", "ekonomist", "elektrikçi", "eleştirmen", "emlakçı", "esnaf", "etnolog",
  "fabrikatör", "felsefeci", "fırıncı", "fizikçi", "fizyoterapist", "fotoğrafçı", "futbolcu",
  "gardiyan", "garson", "gazeteci", "gemi kaptanı", "gemici", "general", "genetikçi", "gitarist", "gözlükçü", "grafiker", "güvenlik", "gümrükçü",
  "haber spikeri", "hakem", "halkla ilişkiler", "hakim", "hamal", "harita mühendisi", "hattat", "hayvan bakıcısı", "hemşire", "heykeltıraş", "hidrolikçi", "hizmetli", "hostes", "hukukçu",
  "illüstratör", "iç mimar", "imam", "influencer", "insan kaynakları", "inşaatçı", "iş güvenliği uzmanı", "istatistikçi", "işçi", "işletmeci", "itfaiyeci",
  "jeofizik mühendisi", "jeolog", "jinekolog", "jokey",
  "kabin memuru", "kalaycı", "kalıpçı", "kaloriferci", "kameraman", "kamu personeli", "kantinci", "kapıcı", "kaptan", "kardiyolog", "karikatürist", "kasap", "kasiyer", "katip", "kaynakçı", "kaymakam", "kemanist", "kimya mühendisi", "kimyager", "komiser", "konsolos", "koreograf", "koruma", "krupiye", "kuru temizlemeci", "kurye", "kuaför", "kuyumcu", "kütüphaneci",
  "laborant", "lastikçi", "lojistikçi", "lokantacı", "lokumcu",
  "madenci", "makinist", "makyaj artisti", "mali müşavir", "manav", "manken", "marangoz", "masal anlatıcısı", "masör", "matbaacı", "mekatronik mühendisi", "memur", "menajer", "meteorolog", "mikrobiyolog", "mimar", "mobilya döşemecisi", "mobilyacı", "moda tasarımcısı", "modelist", "motor kurye", "muabir", "muasebeci", "muhtar", "müezzin", "müfettiş", "mühendis", "mütercim", "müzisyen", "müdür",
  "nalbant", "nakliyeci", "nörolog", "noter",
  "odyolog", "okutman", "operatör", "orman korucusu", "orman mühendisi", "ortopedist", "oto tamircisi", "oyun geliştirici", "oyuncu", "ozan",
  "öğretmen", "öğrenci", "öğretim görevlisi",
  "paleontolog", "palyaço", "park görevlisi", "pasta şefi", "pazarlamacı", "peyzaj mimarı", "pideci", "pilavcı", "pilot", "piyanist", "podolog", "polis", "politikacı", "postacı", "profesör", "programcı", "psikolog", "psikolojik danışman", "psikiyatrist",
  "radyocu", "radyolog", "rehber", "reklam yazarı", "reklamcı", "rektör", "ressam", "resepsiyonist", "robotik mühendisi",
  "saatçi", "sahaf", "sanat yönetmeni", "sanatçı", "sanayici", "saraç", "savcı", "sekreter", "senarist", "sepetçi", "seramikçi", "ses mühendisi", "sigortacı", "sihirbaz", "simitçi", "sismolog", "sistem yöneticisi", "siyaset bilimci", "sosyal medya uzmanı", "sosyolog", "spiker", "sporcu", "stajyer", "stilist", "sunucu", "su tesisatçısı",
  "şair", "şarap uzmanı", "şarkıcı", "şef", "şehir plancısı", "şoför",
  "tahsildar", "taksici", "tarihçi", "tarım işçisi", "tasarımcı", "taşeron", "tatlıcı", "teknik direktör", "teknisyen", "tekniker", "terzi", "tezgahtar", "terapist", "tercüman", "tesisatçı", "tesbihçi", "tiyatrocu", "tornacı", "tuhafiyeci", "turizmci", "turist rehberi",
  "ud sanatçısı", "usta", "uzay mühendisi", "uzman",
  "vali", "veri analisti", "veteriner", "veznedar", "video editörü", "videocu", "viyolonselist", "vokalist",
  "web tasarımcısı",
  "yat kaptanı", "yargıç", "yayıncı", "yazar", "yazılım mühendisi", "yazılımcı", "yönetici", "yönetmen", "yorgancı", "youtuber",
  "zabıta", "zabıta memuru", "zanaatkar", "ziraat mühendisi", "zoolog"
  ,
  // Yeni eklemeler
  "akademisyen", "antrenör", "asistan", "beden eğitimi öğretmeni", "bekçi", "danışman", "dekan", "doçent", "editör", "gözetmen", "hademe", "hakem", "hizmetli", "kantinci", "koç", "mübaşir", "müdür", "müdür yardımcısı", "müfettiş", "nöbetçi öğretmen", "okutman", "rehber öğretmen", "rektör", "servis şoförü", "stajyer", "teknisyen", "uzman", "youtuber"
]);

const countries = prepareList([
  "afganistan", "almanya", "amerika", "andorra", "angola", "arjantin", "arnavutluk", "avustralya", "avusturya", "azerbaycan",
  "bahreyn", "bangladeş", "barbados", "belçika", "belize", "benin", "belarus", "bolivya", "bosna hersek", "botsvana", "brezilya", "brunei", "bulgaristan", "burundi", "butan",
  "cezayir", "cibuti", "cad", "çekya", "çin",
  "danimarka", "dominik",
  "ekvador", "endonezya", "eritre", "ermenistan", "estonya", "etiyopya",
  "fas", "fiji", "fildişi sahili", "filipinler", "filistin", "finlandiya", "fransa",
  "gabon", "gambiya", "gana", "gine", "grenada", "guatemala", "guyana", "güney afrika", "güney kore", "gürcistan",
  "haiti", "hırvatistan", "hindistan", "hollanda", "honduras",
  "ırak",
  "ingiltere", "iran", "irlanda", "ispanya", "israil", "isveç", "isviçre", "italya", "izlanda",
  "jamaika", "japonya",
  "kamboçya", "kamerun", "kanada", "karadağ", "katar", "kazakistan", "kenya", "kırgızistan", "kıbrıs", "kolombiya", "komorlar", "kongo", "kore", "kosova", "kosta rika", "kuveyt", "küba",
  "laos", "lesotho", "letonya", "liberya", "libya", "lihtenştayn", "litvanya", "lübnan", "lüksemburg",
  "macaristan", "madagaskar", "makedonya", "malavi", "maldivler", "malezya", "mali", "malta", "meksika", "mısır", "moğolistan", "moldova", "monako", "moritanya", "mozambik", "myanmar",
  "namibya", "nepal", "nijer", "nijerya", "nikaragua", "norveç",
  "oman", "orta afrika",
  "özbekistan",
  "pakistan", "palau", "panama", "papua yeni gine", "paraguay", "peru", "polonya", "portekiz", "porto riko",
  "romanya", "ruanda", "rusya",
  "san marino", "senegal", "seyşeller", "sırbistan", "sierra leone", "singapur", "slovakya", "slovenya", "somali", "sudan", "surinam", "suriye", "suudi arabistan", "svaziland",
  "şili",
  "tacikistan", "tanzanya", "tayland", "tayvan", "togo", "tonga", "tunus", "tuvalu", "türkiye", "türkmenistan",
  "uganda", "ukrayna", "umman", "uruguay", "ürdün",
  "vatikan", "venezuela", "vietnam",
  "yemen", "yeni zelanda", "yunanistan",
  "zambiya", "zimbabve"
]);

const cities = prepareList([
  "adana", "adıyaman", "afyonkarahisar", "ağrı", "aksaray", "amasya", "ankara", "antalya", "ardahan", "artvin", "aydın",
  "balıkesir", "bartın", "batman", "bayburt", "bilecik", "bingöl", "bitlis", "bolu", "burdur", "bursa",
  "çanakkale", "çankırı", "çorum",
  "denizli", "diyarbakır", "düzce",
  "edirne", "elazığ", "erzincan", "erzurum", "eskişehir",
  "gaziantep", "giresun", "gümüşhane",
  "hakkari", "hatay",
  "ığdır", "ısparta", "istanbul", "izmir",
  "kahramanmaraş", "karabük", "karaman", "kars", "kastamonu", "kayseri", "kilis", "kırıkkale", "kırklareli", "kırşehir", "kocaeli", "konya", "kütahya",
  "malatya", "manisa", "mardin", "mersin", "muğla", "muş",
  "nevşehir", "niğde",
  "ordu", "osmaniye",
  "rize",
  "sakarya", "samsun", "siirt", "sinop", "sivas",
  "şanlıurfa", "şırnak",
  "tekirdağ", "tokat", "trabzon", "tunceli",
  "uşak",
  "van",
  "yalova", "yozgat",
  "zonguldak"
]);

const sports = prepareList([
  "aerobik", "aikido", "akrobasi", "asist", "atletizm", "atıcılık", "avcılık",
  "badminton", "basketbol", "beyzbol", "bilardo", "binicilik", "bisiklet", "blok", "boks", "bowling", "buz pateni", "buz hokeyi",
  "cirit atma", "curling",
  "dağcılık", "dalgıçlık", "dart",
  "eskrim",
  "faul", "futbol", "fitness", "formula",
  "golf", "güreş", "gülle atma",
  "halter", "hat-trick", "hentbol", "hokey",
  "izcilik",
  "jimnastik", "judo", "jokey",
  "kampçılık", "kano", "karate", "kayak", "kaykay", "kick boks", "korner", "koşu", "kriket", "kürek",
  "masa tenisi", "maraton", "motokros", "motor sporları", "muay thai",
  "ofsayt", "okçuluk", "oryantiring",
  "paraşüt", "parkur", "paten", "penaltı", "pilates", "polo",
  "rafting", "ragbi", "ralli",
  "satranç", "smaç", "sörf", "squash", "su topu", "sumo",
  "tekvando", "tenis", "triatlon", "tırmanış",
  "uzun atlama",
  "voleybol", "vücut geliştirme",
  "yamaç paraşütü", "yelken", "yürüyüş", "yüzme", "yoga"
  ,
  // Yeni eklemeler
  "atlatma", "bayrak koşusu", "disk atma", "dodgeball", "gülle atma", "halka", "ip atlama", "istop", "jimnastik", "kros", "maraton", "mekik", "saklambaç", "şınav", "tırmanma", "uzun atlama", "üç adım atlama", "yakan top", "yardımcı hakem"
]);

const kitchen = prepareList([
  "açacak", "alüminyum", "aspiratör", "aşçı",
  "baharatlık", "bakır", "bardak", "batarya", "bek", "bez", "bıçak", "biberlik", "blender", "bulaşık", "buzdolabı", "buzluk",
  "cezve", "çaydanlık", "çay kaşığı", "çatal", "çelik", "çırpıcı", "çöp",
  "damacana", "davlumbaz", "demlik", "derin dondurucu", "doğrayıcı", "dolap",
  "ekmeklik", "el bezi", "elek",
  "fırın", "fincan", "folyo", "fritöz",
  "gazoz açacağı", "güveç",
  "havan", "huni",
  "ızgara", "ıspatula", "ibrik",
  "kahvaltı takımı", "kalıp", "karaffe", "kase", "kaşık", "kavanoz", "kepçe", "kesme tahtası", "kettle", "kevgir", "kıyma makinesi", "kupa", "kürdan",
  "lavabo",
  "maşa", "masa", "merdane", "meyvelik", "mikrodalga", "mikser", "musluk", "mutfak robotu",
  "nihale",
  "ocak", "oklava",
  "peçete", "peçetelik", "porselen",
  "raf", "rende", "robot",
  "sacayağı", "sahan", "saklama kabı", "semaver", "servis", "sofra", "sünger", "sürahi", "süzgeç",
  "şişe", "şekerlik",
  "tabak", "tava", "tepsi", "tencere", "termos", "tezgah", "tirbuşon", "tost makinesi", "tuzluk", "tülbent",
  "yağdanlık"
]);

const clothes = prepareList([
  "aba", "aksesuar", "alyans", "anorak", "apolet", "askı", "astar", "atlet", "atkı", "ayakkabı",
  "babet", "başörtüsü", "bere", "bikini", "bileklik", "bluz", "bot", "bornoz", "broş", "bustiyer",
  "cepken", "ceket", "cübbe", "cüzdan", "çarık", "çanta", "çarşaf", "çamaşır", "çizme", "çorap",
  "deri", "düğme",
  "elbise", "eldiven", "entari", "eşarp", "eşofman", "etek",
  "fark", "ferace", "fermuar", "fes", "file", "fistan", "frak", "fular",
  "gecelik", "gelinlik", "gömlek", "gocuk",
  "hırka",
  "içlik", "ihram", "ipek",
  "jartiyer", "jile",
  "kaftan", "kaban", "kadife", "kalpak", "kapri", "kapüşon", "kasket", "kaşkol", "kazak", "kemer", "kepenek", "keten", "kol düğmesi", "kot", "kravat", "kulaklık", "kundura", "kürk", "külot",
  "lastik", "lif",
  "manşet", "manto", "mayo", "mendil", "mini", "mintan", "mont",
  "naylon",
  "önlük",
  "paça", "palto", "pantolon", "papyon", "pardösü", "pareo", "patik", "pelerin", "pijama", "poşu",
  "rozet",
  "sabahlık", "sandalet", "sari", "smokin", "sütyen",
  "şal", "şalvar", "şapka", "şort",
  "takım elbise", "takunya", "tayt", "terlik", "tişört", "topuklu", "tozluk", "triko", "tulum", "tunik", "türban",
  "üniforma",
  "velur",
  "yaka", "yağmurluk", "yelek", "yün",
  "zıbın", "zincir"
]);

const colors = prepareList([
  "açık mavi", "altın", "amber", "bej", "beyaz", "bakır", "bordo", "bronz", "buğday",
  "cam göbeği", "civert",
  "çivit",
  "eflatun", "ela", "erguvan",
  "fildişi", "fıstık yeşili", "füme",
  "gri", "gül kurusu", "gümüş",
  "haki", "hardal",
  "indigo",
  "kahverengi", "karanfil", "kestane", "kırmızı", "kızıl", "kiremit", "krem", "küllü",
  "lacivert", "lavanta", "leylak", "lila", "limon",
  "mavi", "menekşe", "metalik", "mor", "mürdüm",
  "nar çiçeği", "neon",
  "patlıcan", "pembe", "petrol", "platin",
  "sarı", "saman", "siyah", "somon", "sütlü kahve",
  "taba", "tarçın", "ten", "turkuaz", "turuncu",
  "vişne",
  "yavruağzı", "yakut", "yeşil",
  "zeytuni", "zümrüt"
]);

const music = prepareList([
  "akordeon", "akustik", "albüm", "alto", "amfi", "arp",
  "bağlama", "bale", "bandana", "banjo", "bas", "bateri", "bemol", "beste", "besteci",
  "caz", "cura",
  "çalgı", "çello",
  "darbuka", "davul", "def", "dinleti", "disk", "diyez", "do majör", "düet",
  "elektro", "enstrüman",
  "fagot", "fasıl", "flüt", "fon",
  "gitar", "gramofon", "güfte",
  "halk müziği", "hoparlör",
  "ilahi",
  "kaset", "kaval", "keman", "kemençe", "klarnet", "klasik", "klavye", "konser", "kontrbas", "koro", "kulaklık", "kanun",
  "lehim", "lirik", "lute",
  "maestro", "makam", "mandolin", "marakas", "marş", "melodi", "mızrap", "mikrofon", "müzik", "müzikal",
  "nakarat", "ney", "nota",
  "obua", "opera", "orkestra", "org", "ozan",
  "partisyon", "perde", "piyano", "pikap", "plak", "pop",
  "rap", "resital", "ritim", "rock",
  "sahne", "saksafon", "saz", "selo", "semle", "senfoni", "ses", "sitar", "sol anahtarı", "solist", "solo", "sonat", "soprano", "stüdyo", "söz",
  "şarkı", "şef",
  "tambur", "tef", "tenor", "trampet", "triangel", "trombon", "trompet", "tulum", "türkü",
  "ud",
  "viyola", "viyolonsel", "vokal",
  "yay",
  "zil", "zurna"
]);

// --- YENİ EKLENEN KAPSAMLI GENEL KATEGORİLER ---

const vehicles = prepareList([
  "ambulans", "araba", "arazi aracı", "at arabası", "ateşleme",
  "balon", "beton mikseri", "biçerdöver", "bisiklet", "bot", "buldozer",
  "cankurtaran", "cip",
  "çekici",
  "denizaltı", "deniz otobüsü", "dingil", "dizel", "dozer", "dolmuş", "drone",
  "ekskavatör",
  "fayton", "feribot", "filika", "fren", "füze",
  "gemi", "gondol", "güverte",
  "hava yastığı", "helikopter", "hoverkraft",
  "iş makinesi", "istasyon", "itfaiye",
  "jet", "jet ski",
  "kadran", "kamyon", "kamyonet", "kano", "karavan", "kaykay", "kızak", "konteyner",
  "liman", "limuzin", "lokomotif",
  "metro", "metrobüs", "minibüs", "motosiklet", "motor",
  "otobüs", "otomobil",
  "panelvan", "paten", "pedal", "pick-up", "planör", "polis aracı", "pervane",
  "ray", "römork", "roket",
  "sandal", "scooter", "silindir", "sürat teknesi",
  "şaft", "şase",
  "taka", "taksi", "tank", "tanker", "tekne", "teleferik", "tekerlek", "tır", "traktör", "tramvay", "tren", "triger", "troleybüs",
  "uçak", "uzay mekiği",
  "vagon", "vapur", "vites", "vinç",
  "yat", "yelkenli",
  "zeplin", "zırhlı araç"
]);

const technology = prepareList([
  "ağ", "akıllı saat", "algoritma", "anakart", "android", "antivirüs", "arayüz", "artırılmış gerçeklik",
  "bağlantı", "bant genişliği", "batarya", "bellek", "bilgisayar", "bilişim", "biyometrik", "blockchain", "blokzincir", "bluetooth", "bot", "bulut",
  "chat", "chatbot", "chip", "cihaz",
  "dijital", "disk", "dizüstü", "domain", "donanım", "dosya", "drone",
  "ekran", "elektronik", "e-posta", "ethernet",
  "fiber", "filtre", "flash", "format", "forum",
  "güvenlik duvarı",
  "hack", "harddisk", "hesap", "hologram", "host",
  "influencer", "internet", "ios", "ip", "işlemci", "işletim sistemi",
  "java", "joystick",
  "kablo", "kamera", "kayıt", "klasör", "klavye", "kod", "kodlama", "konsol", "kripto", "kripto para", "kulaklık",
  "lazer", "link", "linux", "login",
  "mail", "masaüstü", "medya", "megabayt", "mesaj", "metaverse", "mikroçip", "mikrofon", "modem", "monitör", "mouse",
  "navigasyon", "network", "nft",
  "online", "otomasyon",
  "parola", "piksel", "platform", "plugin", "podcast", "program", "protokol", "profil",
  "ram", "robot", "router",
  "sanal", "server", "siber", "siber güvenlik", "sifre", "simülasyon", "site", "sosyal medya", "streamer", "sunucu", "sürücü",
  "tablet", "tarayıcı", "teknoloji", "telekom", "telefon", "transistör",
  "uydu", "uygulama", "usb",
  "veri", "video", "virüs", "vr",
  "web", "wifi", "windows",
  "yapay zeka", "yazıcı", "yazılım", "yedekleme", "youtuber",
  "zoom"
]);

// --- Birleştirilmiş Kategoriler ---

// Eşyalar + Mutfak + Taşıtlar
const generalObjects = prepareList([
  ...objects,
  ...kitchen,
  ...vehicles
]);

// Coğrafya ve Sanat tanımları daha sonra ilgili listeler tanımlandıktan sonra eklenecek (declaration order düzeltmesi için)

const nature = prepareList([
  "ada", "ağaç", "akarsu", "atmosfer", "ay",
  "bahar", "bataklık", "boğaz", "bulut", "buzul",
  "çağlayan", "çalı", "çam", "çığ", "çiçek", "çim", "çimen", "çiy", "çöl",
  "dağ", "dal", "damla", "deniz", "dere", "deprem", "doğa", "dolu", "duman",
  "erozyon",
  "fidan", "fırtına", "fiyort", "fosil",
  "gezegen", "gök", "gökkuşağı", "gökyüzü", "göl", "güneş", "girdap",
  "hava", "heyelan", "hortum",
  "ırmak", "iklim",
  "kanyon", "kar", "kaya", "kasırga", "kırağı", "kıta", "kıyı", "körfez", "koy", "krater", "kum", "kumsal", "kuraklık", "kutup",
  "lav", "lodos",
  "mağara", "manzara", "mehtap", "meltem", "mercan", "meteor", "mevsim",
  "nehir", "nem",
  "okyanus", "orman", "ot", "ova",
  "patika", "plaj", "plato", "poyraz", "pus",
  "rüzgar",
  "sabah", "sahil", "sel", "sis", "su",
  "şelale", "şimşek",
  "taş", "tepe", "tohum", "toprak", "toz", "tundra", "tsunami",
  "uğultu",
  "vadi", "vaha", "volkan",
  "yabani", "yağmur", "yakamoz", "yamaç", "yanardağ", "yaprak", "yarımada", "yayla", "yıldırım", "yıldız", "yosun",
  "zirve",
  // Yeni eklemeler
  "alüvyon", "antiklinal", "artezyen",
  "bakı", "bozkır",
  "debi", "delta", "düden",
  "ekvator", "enlem", "epirojenez",
  "fay hattı",
  "gecekondu", "gelgit",
  "harita ölçeği", "hinterland",
  "izohips",
  "jeoloji", "jeotermal",
  "karstik", "kıta sahanlığı", "konum", "kroki",
  "lagün",
  "maki", "meridyen", "muson",
  "nüfus",
  "obruk", "orojenez",
  "paralel", "peri bacası", "platolar",
  "rakım",
  "savan", "step",
  "tektonik", "traverten",
  "volkanizma",
  "yağış rejimi", "yerel saat"
]);

const emotions = prepareList([
  "acı", "aşk", "arzu", "anksiyete",
  "bağlılık", "barış", "bıkkınlık", "bunalım",
  "cesaret", "coşku",
  "dehşet", "dinginlik", "dostluk",
  "endişe", "empati",
  "ferahlık",
  "gurur", "güven",
  "hasret", "hayal", "hayranlık", "hayret", "hazan", "heves", "heyecan", "hiddet", "huzur", "hüzün",
  "ıstırap",
  "imrenme", "inanç", "istek",
  "kader", "kahkaha", "karamsar", "kararsızlık", "keder", "kıskançlık", "kızgınlık", "korku", "kuşku",
  "melankoli", "memnuniyet", "merak", "merhamet", "minnet", "mutluluk",
  "nefret", "neşe", "nostalji",
  "öfke", "özgüven", "özlem",
  "panik", "pişmanlık",
  "rahatlama",
  "sabır", "saygı", "sempati", "sevgi", "sevinç", "sıkıntı", "sinir", "stres", "suçluluk",
  "şaşkınlık", "şefkat", "şüphe",
  "telaş", "tereddüt", "tutku",
  "umut", "utanç", "uyum",
  "vefa", "vicdan",
  "yalnızlık", "yas", "yorgunluk"
]);

// --- ELİT / KÜLTÜR SANAT KATEGORİLERİ ---

const literature = prepareList([
  "ahenk", "anafikir", "anı", "ansiklopedi", "antoloji",
  "başlık", "betimleme", "beyit", "bibliyografya", "biyografi",
  "cilt", "coşku",
  "deneme", "dergi", "destan", "deyim", "dipnot", "dize", "dram", "düzyaşı",
  "edebiyat", "editör", "eleştiri", "epope", "eser",
  "fabl", "fıkra", "folklör",
  "gazel", "gazete", "gezi", "giriş",
  "halk", "hece", "hikaye", "hiciv",
  "içerik", "imge", "imla", "inceleme",
  "kafiye", "kahraman", "karakter", "karikatür", "kaside", "kitap", "klasik", "komedi", "kompozisyon", "konu", "kurgu", "kütüphane",
  "lirik",
  "makale", "mani", "masal", "matbaa", "mecaz", "meddah", "mersiye", "metin", "mısra", "mizah", "monolog", "müze",
  "nesir", "noktalama", "nutuk",
  "okur", "olay", "ozan",
  "öykü", "özet", "özne",
  "paragraf", "piyes", "poetika",
  "realizm", "redif", "roman", "röportaj",
  "sahne", "sanat", "satır", "sayfa", "senaryo", "sergi", "sone", "söyleşi", "sözlük",
  "şair", "şiir", "şive",
  "tema", "teşbih", "tiyatro", "töre", "trajed", "tür",
  "uyak", "üslup",
  "yazar", "yayın",
  "zıt",
  // Yeni eklemeler
  "akrostiş", "aruz", "aşık",
  "bakış açısı", "belagat", "beş hececiler", "bilim kurgu", "boğumlama",
  "cinas",
  "dadaizm", "didaktik", "doğaçlama",
  "epik",
  "fecriati", "fonetik",
  "garip akımı", "gülmece",
  "halk edebiyatı", "hamse", "hece ölçüsü", "hümanizm", "hüsnütalil",
  "ikinci yeni", "intak", "ironi",
  "kafiye şeması", "karagöz", "katarsis", "kinaye", "klasisizm", "koşma",
  "leksikoloji",
  "mahlas", "manzum", "mazmun", "mecazımürsel", "mesnevi", "mübalağa", "münazara",
  "naat", "natüralizm", "nazım birimi",
  "olay örgüsü", "orta oyunu", "otobiyografi",
  "panel", "pantomim", "parodi", "pastoral", "polemik",
  "realizm", "romantizm", "rubai",
  "satirik", "seci", "sembolizm", "serim", "servetifünun", "söylev", "sürrealizm",
  "taşlama", "tekerleme", "telmih", "teşhis", "tezat", "trajedi",
  "varsağı",
  "yedimeşaleciler"
]);

const cinema = prepareList([
  "açı", "adapte", "afiş", "aksiyon", "aktör", "aktris", "animasyon", "anime", "arşiv", "asistan",
  "belgesel", "bilet", "biyografi", "bütçe",
  "cameo", "cekim",
  "dublaj", "dublör", "dizi", "drama",
  "efekt", "ekran", "estetik",
  "festival", "figüran", "film", "final", "flashback", "odak", "fragman",
  "gala", "gerilim", "gişe", "gösterim",
  "hababam", "hollywood",
  "ışık",
  "jenerik", "jüri",
  "kadraj", "kamera", "kanal", "karakter", "klaket", "klip", "komedi", "kostüm", "korku", "kulis", "kurgu", "kült",
  "lens",
  "macera", "makyaj", "matine", "medya", "montaj", "müzikal",
  "odül", "operatör", "oscar", "oyuncu",
  "panorama", "patlamış mısır", "perde", "platform", "plato", "polisiye", "poster", "prodüksiyon", "proje",
  "reji", "reklam", "remake", "replik", "rol", "romantik",
  "sahne", "salon", "sanat", "sansür", "sekans", "senarist", "senaryo", "ses", "sezon", "sinema", "sitcom", "siyah beyaz", "spinoff", "spoiler", "stüdyo", "subtitl", "sunucu",
  "televizyon", "tema", "tosun paşa", "türkan",
  "uyarlama",
  "vizyon",
  "western",
  "yayın", "yapımcı", "yeşilçam", "yönetmen", "yıldız",
  "zombi", "zoom"
]);

const mythology = prepareList([
  // Yunan & Genel
  "anka", "antika", "ares", "athena", "atlas", "aura",
  "batıl", "bilge", "büyü", "büyücü",
  "cadı", "canavar", "cennet", "cehennem", "cin", "cüce",
  "destan", "dev", "dilek",
  "efsane", "ejderha", "elf", "enerji",
  "fal", "fantezi", "felek", "folklor",
  "gizem", "gulyabani",
  "hades", "hayalet", "herkül", "hidra", "hikaye",
  "ikon", "iksir", "ilah",
  "kahin", "kahraman", "kentaurs", "kıyamet", "kısmet", "kurtadam",
  "lamba", "lanet",
  "masal", "medusa", "melek", "merlin", "mit", "mitoloji", "mucize", "müneccim",
  "nazar", "nemesis",
  "odysseus", "olimpos", "ork",
  "pegasus", "peri", "poseidon", "prens", "prenses",
  "ruh", "rüya",
  "sihir", "siren", "simurg", "sonsuzluk", "soylu", "sfenks", "sunak",
  "şaman", "şeytan", "şans", "şifacı",
  "talisman", "tanrı", "tanrıça", "tapınak", "tepegöz", "tılsım", "totem", "truva",
  "unicorn", "uyku",
  "vampir",
  "yaratık", "yeti",
  "zeus", "zombi", "zümrüdüanka",
  
  // Türk Mitolojisi (YENİ EKLENENLER)
  "abra", "albastı", "alkarısı", "arçura", "asena", "ay ata", "azrail",
  "baksı", "balbal", "bozkurt", "bürküt", "büget",
  "cebrail",
  "dede korkut", "demirkıynak",
  "erlik",
  "gök tanrı", "gün ana",
  "hıbılık", "hızır", "hüma",
  "itbarak",
  "kam", "kayra", "kızıl elma", "kurgan", "kut",
  "mergen",
  "od ana", "ötüken",
  "şahmeran",
  "tengri", "tulpar", "turan",
  "umay", "ülgen",
  "yada", "yer su", "yutpa"
]);

// Sanat = Müzik + Sinema + Edebiyat + (Duygular dahil)
const arts = prepareList([
  ...music,
  ...cinema,
  ...literature,
  ...emotions
]);

// --- YENİ KATEGORİLER (Uzay, Tarih, Başkentler) ---

// `space` merged into consolidated `science` list

const history = prepareList([
  "abide", "ahilik", "akıncı", "anıt", "anlaşma", "antik", "anzak", "arkeoloji", "asır", "ateşkes", "ayan", "azınlık",
  "babıali", "balyoz", "barış", "bedesten", "berat", "beylerbeyi", "beylik", "bimarhane", "bizans",
  "cariye", "cemiyet", "cephe", "cihat", "cumhuriyet", "cülus",
  "çağ", "çanakkale", "çini",
  "darphane", "darüşşafaka", "devlet", "devrim", "devşirme", "divan", "donanma",
  "efsane", "emperyalizm", "enderun", "ergenekon",
  "ferman", "fes", "fetih", "firavun",
  "gaza", "gedik", "gladyatör", "göbeklitepe", "göçebe",
  "hakan", "hamam", "han", "hanedan", "harb", "harekat", "harem", "hattat", "hegemonya", "hiyeroglif", "hitit", "hükümdar", "hutbe",
  "ıslahat", "ibrik", "ihtilal", "ilhak", "imaret", "imparator", "iskan", "istiklal", "istiklal marşı", "isyan", "ittihat",
  "kadı", "kağan", "kale", "kervansaray", "keşif", "kitabe", "koloni", "kongre", "kral", "kronoloji", "kutsal ittifak", "külliye", "kuvayimilliye",
  "laiklik", "lale devri", "lonca", "lozan",
  "maarif", "manda", "manastır", "mecelle", "meclis", "medeniyet", "medrese", "mehter", "meşrutiyet", "milli mücadele", "minyatür", "misakımilli", "monarşi", "muharebe", "müdafaa", "müderris", "mütareke", "müze",
  "nizamıcedit",
  "oğuz kağan", "osmanlı",
  "padişah", "panslavizm", "papirüs", "paşa", "payitaht", "piramit",
  "reform", "rönesans",
  "sadaret", "sadrazam", "sancak", "sancaktar", "saray", "savaş", "savaş tazminatı", "sefer", "selçuklu", "sevr", "sipahi", "siyasetname", "soykırım", "sömürge", "sultan", "sümer", "sürgün",
  "şamanizm", "şark meselesi", "şehzade", "şeyhülislam", "şövalye",
  "tanzimat", "tarih", "tbmm", "tekalifimilliye", "tekke", "tehcir", "telgraf", "tımar", "topkapı", "tuğ", "tuğra", "töre", "turan", "türbe",
  "uç beyi", "ulema", "uygarlık",
  "vakıf", "valide sultan", "vatan", "veraset", "vezir",
  "yasa", "yazıt", "yeniçeri", "yüzyıl",
  "zafer", "zaviye", "zırh",
  // Yeni eklemeler
  "anayasa", "asimilasyon",
  "bakır çağı", "bürokrasi",
  "cilalı taş", "çivi yazısı",
  "demokrasi", "denge politikası", "diplomasi", "dogmatik", "duyunuumumiye",
  "feodalite", "fetret",
  "göç",
  "halifelik", "hıdıv", "hukuk",
  "ilk çağ", "imparatorluk",
  "kabotaj", "kapitülasyon", "kazasker", "kurultay", "kut anlayışı", "kültür",
  "milliyetçilik", "manda ve himaye", "mütareke",
  "oligarşi", "orta çağ", "örfi",
  "sanayi inkılabı", "senediittifak", "soğuk savaş", "sömürgecilik",
  "teokrasi", "teokratik", "töre",
  "yeni çağ", "yerleşik hayat"
  ,
  // Kullanıcı tarafından eklenen tarih terimleri
  "amasya genelgesi", "anadolu ajansı", "ayaklanma", "bağımsızlık", "batı cephesi", "büyük taarruz", "cemiyetler", "cephe", "cumhuriyetçilik", "demokrasi", "devletçilik", "doğu cephesi", "düzenli ordu", "egemenlik", "erzurum kongresi", "genelge", "güney cephesi", "halkçılık", "hıyanet", "hukuk", "inkılap", "istiklal mahkemesi", "itilaf", "ittifak", "kabotaj kanunu", "kapitülasyon", "kongre", "kuvayimilliye", "laiklik", "lozan", "maarif kongresi", "mandater", "mebus", "meclis", "medeni kanun", "misakımilli", "mondros", "mudanya", "muhalefet", "nüfus mübadelesi", "saltanat", "sakarya savaşı", "sivas kongresi", "siyasi parti", "soyadı kanunu", "söylev", "şeriat", "tekalifimilliye", "teşkilat", "temsil heyeti", "tevhiditedrisat", "vilayet"
]);

const worldCapitals = prepareList([
  "amsterdam", "atina", 
  "bağdat", "bakü", "bangkok", "pekin", "berlin", "brüksel", "budapeşte", "bükreş", 
  "kahire", "canberra", 
  "dakkan", "delhi", "dublin", 
  "helsinki", 
  "islamabad", 
  "kabil", "kiev", "kopenhag", "kudüs", 
  "lizbon", "londra", 
  "madrid", "moskova", 
  "nairobi", "new york", 
  "oslo", "ottawa", 
  "paris", "prag", 
  "rabat", "riyad", "roma", 
  "saraybosna", "seul", "sofya", "stokholm", 
  "tahran", "tiflis", "tokyo", "tunus", 
  "viyana", 
  "washington", 
  "zagreb"
]);

// Coğrafya = Ülkeler + Şehirler + Başkentler + Doğa (birleştirilmiş)
const geography = prepareList([
  ...countries,
  ...cities,
  ...worldCapitals,
  ...nature
]);

// --- EĞİTİM (OKUL) ODAKLI KATEGORİLER ---

const turkishGrammar = prepareList([
  "ad", "alfabe", "anafikir", "anlam", "anlatım", "atasözü",
  "bağlaç", "basit", "başlık", "benzeşme", "betimleme", "birleşik", "büyük",
  "cins", "cümle",
  "çoğul", "çekim",
  "deyim", "dil", "dilbilgisi", "dolaylı", "dönüşlü",
  "edat", "ek", "emir", "eşanlam", "etken", "eylem",
  "fiil", "fiilimsi",
  "geçişli", "geniş", "gerçek", "gövde", "giriş",
  "haber", "hece", "hikaye",
  "isim", "işaret", "iletişim", "imla",
  "kaynaştırma", "kelime", "kip", "kişi", "kök", "kural", "kurallı",
  "mastar", "mecaz", "metin",
  "nesne", "nokta", "noktalama",
  "olumlu", "olumsuz", "ortaç",
  "özne", "özel",
  "paragraf", "pekiştirme",
  "kök",
  "roman",
  "sesteş", "sıfat", "soru", "sözcük", "sözlük",
  "şiir", "şahıs",
  "tamlama", "terim", "türemiş", "tür",
  "ulaç",
  "ünlem", "ünsüz", "ünlü", "uyum",
  "virgül",
  "yansıma", "yapı", "yapım", "yardımcı", "yazım", "yüklem",
  "zamir", "zarf", "zıt"
  ,
  // Yeni eklemeler
  "adıl", "ahenk", "ana duygu", "anlatım bozukluğu", "ara söz", "bağlam", "bakış açısı",
  "belgisiz", "betimleme", "biçim", "birleşik zaman", "büyük ünlü uyumu",
  "çatı", "çoğullaştırma",
  "devrik", "dilek kipi", "dolaylama", "dönüşlülük",
  "ek eylem", "etken", "ettirgen",
  "fiilimsi",
  "geçişsiz", "gizli özne", "gövde",
  "haber kipi", "hal eki",
  "ikileme", "ilgeç", "iyelik",
  "kaynaştırma", "kişi eki", "kurallı", "küçük ünlü uyumu",
  "mastar", "mecaz",
  "nesnel", "niteleme",
  "oldurgan", "ögeler", "ön ad", "öznel",
  "pekiştirme",
  "sıfat fiil", "somut", "soyut", "söz sanatı",
  "tamlayan", "tamlanan", "türemiş",
  "ulama",
  "vurgu",
  "yapım eki", "yardımcı fiil", "yapıca",
  "zarf fiil", "zincirleme"
  ,
  // Kullanıcı tarafından eklenen Türkçe dilbilgisi terimleri
  "açıklama", "akıcılık", "anı", "arasöz", "bağlaşıklık", "biyografi", "çağrışım", "devrik cümle", "duru", "duyu", "düşünce", "eleştiri", "fıkra", "gezi yazısı", "günlük", "haber metni", "hikaye edici", "içerik", "karşılaştırma", "kişileştirme", "konuşturma", "kurgusal", "makale", "manzum", "mecaz anlam", "nesnel", "noktalı virgül", "otobiyografi", "öznel", "sebep sonuç", "söyleşi", "söz sanatları", "tanık gösterme", "tanımlama", "tartışma", "terim anlam", "tiyatro", "üç nokta", "ünlem", "üslup", "varsayım", "virgül", "yakınma", "yan anlam", "yansıma", "yüklem"
]);

// `chemistry` merged into consolidated `science` list

// `body` merged into consolidated `science` list

const science = prepareList([
  "adaptasyon", "ağız", "akciğer", "akım", "akustik", "alyuvar", "ametal", "amip", "amper", "ampul", "anatomi", "anot", "antikor", "arter", "asit", "asteroid", "astronomi", "atmosfer", "atom", "ay", "ayrışma",
  "bağırsak", "bağışıklık", "bakteri", "basınç", "baz", "besin", "besin zinciri", "beyin", "beyincik", "bileşik", "bileşke", "biyoçeşitlilik", "biyoteknoloji", "böbrek", "bronş", "buharlaşma", "burun", "buzul",
  "canlı", "cıva",
  "çekirdek", "çekim", "çiçek", "çıkrık", "çimlenme", "çözelti", "çözücü", "çözünme",
  "dalga", "damar", "damıtma", "dengelenmiş", "denklem", "deri", "destek", "devre", "dışkı", "dinamometre", "direnç", "diş", "dişli", "diyafram", "diyaliz", "dizi", "dna", "doğa", "doku", "dolaşım", "dolunay", "donma", "dönme", "dünya",
  "efor", "eğik düzlem", "eklem", "ekosistem", "eksen", "elektrik", "elektromagnet", "elektron", "element", "embriyo", "enerji", "enzim", "erime", "erozyon", "esneklik", "eşeyli", "eşeysiz", "evren", "evrim",
  "fermantasyon", "fetüs", "fizik", "fiziksel", "fosil", "fotosentez", "frekans",
  "galaksi", "gaz", "gen", "genetik", "genleşme", "genotip", "geri dönüşüm", "gerilim", "gezegen", "göktaşı", "gölge", "göz", "gübre", "güç", "güneş",
  "hacim", "hareket", "hava", "hazımsızlık", "helyum", "heterojen", "heyelan", "hız", "hidroliz", "hidrojen", "hipofiz", "homojen", "hormon", "hücre",
  "ısı", "iletken", "ince bağırsak", "iskelet", "izolatör", "iş", "ivme",
  "jeneratör", "jüpiter",
  "kalın bağırsak", "kaldıraç", "kaldırma kuvveti", "kalıtım", "kalp", "kan", "kapakçık", "karaciğer", "karbondioksit", "karışım", "kas", "kasnak", "katı", "katman", "katot", "kaynama", "kemik", "kıkırdak", "kimya", "kimyasal", "kinetik", "kist", "klorofil", "kloroplast", "koful", "koza", "kromozom", "kulak", "kuyrukluyıldız", "kuvvet", "küf", "küresel ısınma", "kütle",
  "lav", "lens", "lenf", "lizozom",
  "madde", "magma", "makara", "manyetizma", "mantar", "mars", "mayoz", "mercek", "merkür", "metal", "metabolizma", "meteor", "mevsim", "mıknatıs", "mide", "mikrop", "mikroskop", "mitokondri", "mitoz", "modifikasyon", "molekül", "mutasyon",
  "nabız", "nefes", "neptün", "newton", "nötr", "nötron", "nükleotid",
  "odak", "ohm", "omurga", "omurilik", "omurgalı", "omurgasız", "organ", "organel", "organizma", "oksijen",
  "pankreas", "paralel", "parazit", "periyodik", "ph", "pil", "plazma", "popülasyon", "potansiyel", "prizma", "protein", "proton",
  "radyasyon", "reaksiyon", "refleks", "renk", "ribozom", "roket", "rüzgar",
  "safra", "salgı", "saman yolu", "satürn", "sel", "sembol", "sera etkisi", "seri", "ses", "sıcaklık", "sıvı", "sigorta", "sindirim", "sinir", "sistem", "sitoplazma", "soluk", "solunum", "sperm", "steteskop", "su", "süblimleşme", "sürat", "sürtünme", "süzme",
  "tanecik", "tansiyon", "teleskop", "tepkime", "termometre", "titreşim", "tohum", "toplardamar", "topraklama", "tutulma", "tür",
  "uydular", "uzay", "uranüs", "üreme",
  "vakum", "venüs", "vida", "virüs", "vitamin", "volt", "voltmetre", "volkan", "vücut",
  "yağış", "yakıt", "yalıtkan", "yankı", "yanma", "yaprak", "yansıma", "yarı iletken", "yerkabuğu", "yenilenebilir", "yoğunlaşma", "yoğunluk", "yörünge", "yük", "yumurta", "yumurtalık", "yutak", "yıldız",
  "zar", "zigot"
  ,
  // Kullanıcı tarafından eklenmesi istenen terimler
  "alaşım", "alkol", "aşı", "ayna", "beher", "büzülme", "çukur ayna", "deney", "doku kültürü", "düz ayna", "erlenmayer", "genlik", "gök cismi", "ışık yılı", "izotop", "kara delik", "kırılma", "klonlama", "kutup yıldızı", "maden", "opak", "ozon", "periskop", "saydam", "soğurulma", "soygaz", "takımyıldız", "tümsek ayna", "tüp", "varyasyon", "yarı saydam",
  "akyuvar", "başkalaşım", "biyolojik birikim", "döl yatağı", "golgi", "kan pulcuğu", "kapsül", "organ nakli", "plazenta", "sentrozom", "sindirim enzimi", "sperm kanalı", "trombosit", "tozlaşma", "üreter", "üretra", "vajina", "yavru",
  "aerosol", "süspansiyon", "emülsiyon", "bağ", "buhar", "çiy", "çökelti", "denge sıcaklığı", "destilasyon", "eleme", "endotermik", "ekzotermik", "fiziksel değişim", "ısı yalıtkanı", "ısı iletkeni", "kırağı", "kimyasal bağ", "kimyasal değişim", "kireç suyu", "kolonya", "kovalent", "metalik", "mıknatıslanma", "öz ısı", "sis", "yarı metal",
  "ağırlık merkezi", "anahtar", "armut ampul", "barometre", "bileşik makine", "çekim potansiyel", "desibel", "duy", "eğik atış", "elektroskop", "floresan", "gerilme", "hava direnci", "hidrolik", "iş birimi", "iletken tel", "joule", "kama", "kiriş", "manometre", "mekanik enerji", "palanga", "pascal", "piston", "reosta", "sabit makara", "serbest düşme", "su direnci", "su cenderesi", "toprak hattı", "torricelli", "watt",
  "asal eksen", "astronot", "beyaz ışık", "çukur", "dağınık yansıma", "doğrusal", "düzgün yansıma", "fiber optik", "gök", "gökbilim", "gökada", "ışık kirliliği", "ışık spektrumu", "ışık ışını", "kalın kenarlı", "karanlık oda", "kırılma açısı", "kırmızı", "mercek", "mor", "normal", "odak noktası", "orion", "renk tayfı", "rasathane", "sanal görüntü", "ses yalıtımı", "soğurma", "soner", "spektrum", "tam gölge", "teleskop", "tümsek", "uydu", "uzay mekiği", "uzay sondası", "uzay istasyonu", "yarı gölge", "yansıtıcı", "yapay uydu", "yıldız kayması",
  "asit yağmuru", "ayrıştırıcı", "besin ağı", "biyokütle", "çevre kirliliği", "doğal seçilim", "ekolojik ayak izi", "endemik", "enerji piramidi", "fosil yakıt", "küresel iklim", "ozon tabakası", "sera gazı", "su döngüsü", "sürdürülebilir"
]);

const mathTerms = prepareList([
  "açı", "açıortay", "alan", "algoritma", "altıgen", "artı", "aritmetik", "asal",
  "bağıntı", "basamak", "beşgen", "bilinmeyen", "birim", "birleşme", "bölme", "bölüm", "bölünen", "bölen", "boyut", "bütünler",
  "cebir", "cetvel",
  "çap", "çarpım", "çarpma", "çarpan", "çember", "çeşitkenar", "çevre", "çıkarma", "çift", "çizgi",
  "daire", "dar", "değer", "denklem", "derece", "dik", "dikdörtgen", "dizi", "doğal", "doğru", "dörtgen", "düzlem",
  "eğik", "eğim", "ebob", "ekok", "eksi", "eksilen", "eleman", "eşit", "eşkenar", "evrensel",
  "faiz", "fark", "fonksiyon", "formül",
  "geniş", "genişletme", "geometri", "grafik",
  "hacim", "hesap", "hipotenüs", "hız",
  "işlem", "ikizkenar", "integral", "rasyonel",
  "kalan", "kare", "karekök", "karmaşık", "kat", "kesir", "kenar", "kesişim", "kiriş", "kombinasyon", "komşu", "koni", "koordinat", "kosinüs", "köşegen", "küme", "küp", "küre",
  "limit", "logaritma",
  "matematik", "matris", "medyan", "merkez", "milyar", "milyon", "mod", "mutlak",
  "negatif", "nokta",
  "ondalık", "onluk", "oran", "orantı", "orta",
  "rakam", "rasyonel", "reel",
  "sabit", "sadeleştirme", "sayı", "sekizgen", "sıfır", "silindir", "sinüs", "sonsuz",
  "taban", "tamsayı", "tanjant", "tek", "teorem", "terim", "toplam", "toplama", "tümler", "türev",
  "uzay", "uzunluk",
  "üçgen", "üs", "üslü",
  "vektör", "verim",
  "yamuk", "yarıçap", "yay", "yedigen", "yükseklik", "yüzde", "yüzey",
  // Kullanıcı tarafından eklenen matematik terimleri
  "araştırma sorusu", "aritmetik ortalama", "arazi", "basit olay", "birim küp", "birim kesir", "bütünler açı", "cebirsel ifade", "çetele tablosu", "çevre uzunluğu", "dal", "dar açı", "dekar", "desimetre", "dik prizma", "dik üçgen", "dönme", "dönüşüm", "eşlik", "eşitsizlik", "evrensel küme", "geniş açı", "geometrik cisim", "grafik", "hektar", "hektolitre", "histogram", "imkansız olay", "izometrik kağıt", "kare prizma", "kareli kağıt", "kesin olay", "koni", "koordinat sistemi", "köşe", "köşegen", "küp açılımı", "litre", "metrekare", "mililitre", "mutlak değer", "olasılık", "ondalık gösterim", "orijin", "ortak bölen", "ortak kat", "öteleme", "özdeşlik", "paralelkenar", "pay", "payda", "pergel", "piramit", "pisagor", "poligon", "sabit terim", "santimetre", "sayı doğrusu", "sıklık tablosu", "silindir", "simetri", "sütun grafiği", "ters açı", "ters orantı", "tümler açı", "veri", "veri analizi", "yamuk", "yay", "yok etme", "yüzde", "yüzey alanı"
]);

// --- DIŞA AKTARILAN KATEGORİ LİSTESİ ---

export const CATEGORIES: Category[] = [
  // --- GENERAL GROUP ---
  { id: 'animals', label: 'Hayvanlar Alemi', icon: '🦁', words: animals, group: 'general' },
  { id: 'food', label: 'Yiyecek & İçecek', icon: '🍎', words: food, group: 'general' },
  // Eşyalara mutfak ve taşıtları da ekledim
  { id: 'objects', label: 'Eşyalar', icon: '🎒', words: generalObjects, group: 'general' },
  { id: 'clothes', label: 'Kıyafet & Moda', icon: '👕', words: clothes, group: 'general' },
  { id: 'colors', label: 'Renkler', icon: '🎨', words: colors, group: 'general' },
  { id: 'sports', label: 'Sporlar', icon: '⚽', words: sports, group: 'general' },
  { id: 'professions', label: 'Meslekler', icon: '🧑‍⚕️', words: professions, group: 'general' },
  { id: 'technology', label: 'Teknoloji', icon: '💻', words: technology, group: 'general' },

  // Yeni: Coğrafya (Ülkeler + Şehirler + Başkentler + Doğa)
  { id: 'geography', label: 'Coğrafya & Seyahat', icon: '🗺️', words: geography, group: 'general' },

  // --- SANAT & EĞLENCE ---
  { id: 'arts', label: 'Sanat & Eğlence', icon: '🎭', words: arts, group: 'general' },

  // --- CULTURE GROUP (Diğer alt başlık kalmadı) ---
  

  { id: 'mythology', label: 'Mitoloji & Efsaneler', icon: '🐉', words: mythology, group: 'general' },
  
  // --- EDUCATION GROUP ---
  { id: 'science', label: 'Ortaokul Fen Bilimleri', icon: '🔬', words: science, group: 'education' },
  { id: 'history', label: 'Tarih Terimleri', icon: '📜', words: history, group: 'education' },
  
  { id: 'math_basic', label: 'Matematik', icon: '📐', words: mathTerms, group: 'education' },
  { id: 'turkish_grammar', label: 'Türkçe Dilbilgisi', icon: '📚', words: turkishGrammar, group: 'education' },
];