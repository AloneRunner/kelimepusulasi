
import json

# Legacy Animals (A-Z) from wordFacts.ts (Lines 3-1723)
# I have manually extracted this from the view_file outputs.
# Note: I'm putting a placeholder here, I will populate the full dict in the actual execution logic if I can, 
# or I will just list the ones I know I need to keep.
# Actually, constructing this massive dict inside a python script string in a tool call is error prone.
# Better approach: 
# 1. Read the file content 3-1723 into a variable.
# 2. Parse it (it's TS/JS, not strict JSON, but keys are quoted).
# 3. Process.

# Since I can't "Read the file into a variable" in this script without reading the actual file on disk,
# AND the file is wordFacts.ts which is mixed.
# I will read wordFacts.ts, extract lines 3-1723, parse, merge, and output.

import re

def parse_ts_object(content):
    # Very basic parser for the specific format in wordFacts.ts
    # Key: "word": [ "fact1", "fact2" ],
    facts = {}
    current_key = None
    current_facts = []
    
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue
        if line.startswith('//'): continue
        
        # Match Key: "key": [
        key_match = re.search(r'^"([^"]+)": \[$', line)
        if key_match:
            current_key = key_match.group(1)
            current_facts = []
            continue
            
        # Match Fact: "fact",
        fact_match = re.search(r'^"(.*)"(?:,|\])$', line) # Matches "fact", or "fact"]
        if fact_match and current_key:
            # Check if it's the closing bracket line like "fact" ]
            # The regex ^"(.*)"(?:,|\])$ captures the content inside quotes.
            # But wait, the line might be just "],"
            # Let's be more robust.
            pass

    # Regex based full extraction might be better
    # Extract "key": [ ... ] blocks
    
    block_pattern = re.compile(r'"([^"]+)":\s*\[(.*?)\]', re.DOTALL)
    matches = block_pattern.findall(content)
    
    for key, block_content in matches:
        # block_content is:
        # "Fact 1",
        # "Fact 2"
        
        # Extract strings
        fact_lines = re.findall(r'"(.*?)"', block_content)
        facts[key] = fact_lines
        
    return facts

def main():
    # 1. Read the file
    try:
        with open('data/wordFacts.ts', 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print("File not found.")
        return

    # Extract Animals Block (Lines 2 to 1723 approx)
    # Start: "ağaçkakan" (Line 4 roughly)
    # End: "zürafa" (Line 1721)
    # We'll grab the whole chunk.
    
    start_line = 0
    end_line = 0
    
    for i, line in enumerate(lines):
        if '"ağaçkakan": [' in line:
            start_line = i
        if '"zürafa": [' in line:
            # We need to find the closing bracket of zürafa
            # It's usually 4 lines down
            end_line = i + 5
            break
            
    if start_line == 0 or end_line == 0:
        print(f"Could not locate start/end. Start: {start_line}, End: {end_line}")
        # Fallback to hardcoded knowledge or approximate
        # Based on view_file: start is line 4, end is line 1722
        start_line = 3 # 0-indexed
        end_line = 1723
        
    animals_content = "".join(lines[start_line:end_line])
    
    legacy_facts = parse_ts_object(animals_content)
    
    # 2. User's New Facts (Hardcoded from prompt)
    user_facts = {
    "ağaçkakan": [
        "Saniyede 20 kez gövdeye vurabilirler.",
        "Dilleri o kadar uzundur ki, kafataslarının etrafını sararak beyinlerini darbelerden korur.",
        "Gözlerini her darbede kapatarak fırlayan kıymıklardan korunurlar."
    ],
    "ahtapot": [
        "Üç kalbi ve mavi kanı vardır.",
        "Dokunaçlarında beyinlerinden bağımsız hareket edebilen mini sinir merkezleri bulunur.",
        "Vücutlarını bir madeni para genişliğindeki deliklerden geçirecek kadar esnetebilirler."
    ],
    "akbaş": [
        "Anadolu'ya özgü, tamamen beyaz tüyleriyle bilinen bir koruma canlısıdır.",
        "Sürüsünü korurken kurtlara karşı oldukça cesur davranan bir bekçidir.",
        "Gece görüşü çok keskindir ve iri gövdesiyle heybetli görünür."
    ],
    "akrep": [
        "Ultraviyole ışık altında neon mavisi renginde parlarlar.",
        "Bazı türleri hiçbir şey yemeden tam bir yıl boyunca hayatta kalabilir.",
        "Kuyruğunun ucundaki zehirli iğnesiyle hem avlanır hem de kendini korur."
    ],
    "aksolotl": [
        "Kayıp uzuvlarını ve hatta beyinlerinin bir kısmını tamamen iyileştirebilen nadir bir canlıdır.",
        "Aslında bir semender türüdür ama ömür boyu suda, bebeklik formunda kalır.",
        "Gülümser gibi görünen yüz hatlarıyla akvaryum dünyasında popülerdir."
    ],
    "alabalık": [
        "Soğuk ve bol oksijenli akarsuları seven, üzerindeki kırmızı beneklerle tanınan bir canlıdır.",
        "Akıntının tersine yüzebilen çok güçlü kas yapısına sahiptir.",
        "Temiz su kaynaklarının en önemli doğal göstergesidir."
    ],
    "alageyik": [
        "Erkeklerinin boynuzları her yıl düşer ve daha büyük olarak yeniden çıkar.",
        "Benekli kürkleri, orman zeminindeki ışık oyunlarında gizlenmelerine yardımcı olur.",
        "Çok iyi yüzücüdürler ve gerektiğinde geniş nehirleri kolayca geçebilirler."
    ],
    "albatros": [
        "Kanat açıklığı 3.5 metreye ulaşarak bu alanda dünya rekoruna sahip olan kuştur.",
        "Hiç kanat çırpmadan binlerce kilometre süzülebilir; hatta uçarken uyuyabilirler.",
        "Hayatlarının ilk birkaç yılını hiç karaya ayak basmadan açık denizlerde geçirirler."
    ],
    "alpaka": [
        "And Dağları'nda yaşayan, tüyleri çok yumuşak ve değerli olan bir memelidir.",
        "Kendilerini tehlikede hissettiklerinde tükürerek tepki vermeleriyle meşhurdurlar.",
        "Yalnız kaldıklarında strese girip hastalanabilen, sosyal bir sürü hayvanıdır."
    ],
    "arı": [
        "Kolonisi bir yılda 100 kilodan fazla gıda özütü üretebilir.",
        "Dünyanın en önemli tozlaştırıcısıdır; yediğimiz her 3 lokmadan biri onların emeğidir.",
        "Güneşin konumunu kullanarak yönlerini şaşmadan bulurlar."
    ],
    "aslan": [
        "Kükremesi 8 kilometre öteden duyulabilen ormanlar kralıdır.",
        "Sürünün bölgesini korumakla görevli olan, yelesiyle tanınan heybetli kedidir.",
        "Günde ortalama 20 saatini dinlenerek veya uyuyarak geçirir."
    ],
    "at": [
        "Ayakta uyuyabilirler çünkü bacaklarında özel bir kilit sistemi vardır.",
        "Gözleri bir memeli için dünyanın en büyüğüdür ve 360 derecelik bir görüş alanına sahiptirler.",
        "Duygularını ifade etmek için kulaklarını ve kişneme seslerini kullanırlar."
    ],
    "aygır": [
        "Sürünün liderliğini üstlenen, güçlü ve yetişkin erkek hayvandır.",
        "Sürüsünü koruma içgüdüsü çok yüksektir ve oldukça kaslı bir yapıya sahiptir.",
        "Asaleti ve hızıyla özgürlüğün sembolü kabul edilir."
    ],
    "bal arısı": [
        "Kovanı korumak için iğnesini kullandığında hayatını kaybeden çalışkan böcektir.",
        "Birbirleriyle haberleşmek için özel bir 'figür dansı' yaparlar.",
        "Doğadaki bitki çeşitliliğinin devamı için polen taşıyan en önemli canlıdır."
    ],
    "balina": [
        "Mavi türünün sadece dili bir fil ağırlığındadır.",
        "Kalbi bir otomobil büyüklüğündedir ve atışı kilometrelerce öteden duyulabilir.",
        "Nefes almak için su yüzeyine çıkarak devasa bir püskürtme yapar."
    ],
    "barbun": [
        "Deniz tabanındaki kumları bıyıklarıyla karıştırarak avlanan, pembe-kırmızı renkli balıktır.",
        "Lezzeti nedeniyle eski saray mutfaklarının en kıymetli deniz ürünlerinden biri olmuştur.",
        "Sıcak denizlerin kumluk ve kayalık bölgelerini sever."
    ],
    "baykuş": [
        "Boyunlarını 270 derece döndürebilirler ama göz kürelerini oynatamazlar.",
        "Tüylerindeki özel yapı sayesinde gece avlanırken tamamen sessiz uçabilirler.",
        "Kulakları kafalarında simetrik değildir; bu sayede sesin yerini üç boyutlu tespit ederler."
    ],
    "bukalemun": [
        "Renk değiştirmelerinin asıl sebebi gizlenmek değil, sıcaklık kontrolü ve ruh halini belli etmektir.",
        "Gözleri birbirinden bağımsız hareket ederek aynı anda iki farklı yöne bakabilir.",
        "Dilleri kendi vücut uzunluklarının iki katı kadar uzağa ışık hızında fırlayabilir."
    ],
    "buzağı": [
        "Sütten kesilme dönemine kadar olan genç büyükbaş yavrusudur.",
        "Doğduktan çok kısa bir süre sonra ayağa kalkıp annesini takip edebilir.",
        "Çiftliklerin en hareketli ve sevimli üyelerinden biridir."
    ],
    "caretta caretta": [
        "Doğdukları kumsalı asla unutmazlar ve yumurtlamak için binlerce mil öteden aynı yere dönerler.",
        "Yavruların cinsiyeti kumsalın sıcaklığına bağlıdır; sıcak kum dişileri, serin kum erkekleri çoğaltır.",
        "Denizlerin bu kadim yolcusu tek bir nefesle su altında saatlerce kalabilir."
    ],
    "ceylan": [
        "Yırtıcılardan kaçarken havaya zıplayarak 'gösteri' yapmasıyla tanınan zarif hayvandır.",
        "Su içmeden haftalarca yaşayabilir; ihtiyacı olan nemi yediği bitkilerden karşılar.",
        "Gözleri kafasının yanındadır, böylece otlarken bile 360 dereceyi kontrol edebilir."
    ],
    "çakal": [
        "Eşlerine çok sadıktırlar ve genellikle ömür boyu tek bir partnerle yaşarlar.",
        "Geceleri birbirlerini bulmak için siren benzeri çok karakteristik bir ses çıkarırlar.",
        "Bozkırların hem avcı hem de temizlikçi (leşçil) olan çevik üyesidir."
    ],
    "çita": [
        "0'dan 100 km hıza sadece 3 saniyede ulaşarak dünyanın en hızlı kara canlısı ünvanını alır.",
        "Koşarken kuyruğunu bir dümen gibi kullanarak keskin dönüşler yapabilir.",
        "Diğer büyük kedilerin aksine kükreyemez, sadece mırlar."
    ],
    "denizatı": [
        "Dünyada erkeklerin doğum yaptığı ve yavruları kesesinde taşıdığı tek canlı türüdür.",
        "Mideleri olmadığı için gün boyu sürekli beslenmek zorundadırlar.",
        "Kuyruklarıyla deniz bitkilerine tutunarak akıntıya kapılmaktan korunurlar."
    ],
    "denizanası": [
        "Vücutlarının %95'i sudur; beyinleri, kalpleri ve kemikleri bulunmaz.",
        "Dinozorlardan bile önce dünyada var olan, akıntıya göre sürüklenen bir canlıdır.",
        "Bazı türleri karanlık sularda kendi ışığını üretme özelliğine sahiptir."
    ],
    "deve": [
        "Hörgüçlerinde su değil, enerji kaynağı olarak yağ depolarlar.",
        "Kum fırtınalarından korunmak için burun deliklerini tamamen kapatabilme yetenekleri vardır.",
        "Çöl şartlarına uyum sağlamış, tek seferde 100 litreden fazla su içebilen memelidir."
    ],
    "devekuşu": [
        "Dünyanın en büyük kuşudur ama kanatları onu uçurmaya yetmez.",
        "Gözleri, beyinlerinden daha büyük olan tek kara canlısıdır.",
        "Çok güçlü bacakları vardır; tekmesi bir aslanı etkisiz hale getirebilir."
    ],
    "dinozor": [
        "Milyonlarca yıl önce dünyaya hükmeden, kelime anlamı 'korkunç kertenkele' olan canlıdır.",
        "Günümüzdeki kuşlar, aslında bu dev sürüngenlerin yaşayan en yakın akrabalarıdır.",
        "Fosilleri sayesinde geçmişe dair bildiğimiz en gizemli tarih öncesi varlıktır."
    ],
    "fil": [
        "Dünyanın en büyük kara memelisidir ve hortumunda 40 binden fazla kas bulunur.",
        "Ölen yakınları için yas tutan ve birbirlerini yıllar sonra bile tanıyan çok duygusal canlılardır.",
        "Yürürken yere basışları o kadar yumuşaktır ki, devasa cüsselerine rağmen sessizce ilerleyebilirler."
    ],
    "flamingo": [
        "Gri tüylerle doğarlar; o meşhur rengini yedikleri karideslerdeki pigmentten alırlar.",
        "Tek ayak üzerinde dururken daha az enerji harcarlar ve bu şekilde uyuyabilirler.",
        "Gagaları suyu süzmek için özel bir filtre sistemiyle donatılmıştır."
    ],
    "geko": [
        "Ayaklarındaki mikroskobik tüyler sayesinde camda veya tavanda baş aşağı yürüyebilirler.",
        "Göz kapakları yoktur; gözlerini temiz tutmak için dilleriyle yalarlar.",
        "Tehlike anında kuyruğunu bırakıp kaçabilir ve sonradan yenisini çıkarabilir."
    ],
    "goril": [
        "İnsanlarla %98'den fazla oranda benzer DNA'ya sahip dev bir primattır.",
        "Eğitildiklerinde işaret dili öğrenip insanlarla iletişim kurabilirler.",
        "Sürünün lideri olan 'gümüş sırtlı' erkek, tüm grubun güvenliğinden sorumludur."
    ],
    "güvercin": [
        "Yön bulma yetenekleri sayesinde eski zamanlarda en önemli haberci olarak kullanılmışlardır.",
        "Yavrularını 'kursak sütü' denilen özel bir sıvıyla besleyen nadir kuşlardandır.",
        "Dünya genelinde şehir meydanlarının ve barış sembollerinin vazgeçilmezidir."
    ],
    "hamamböceği": [
        "Kafaları kopsa bile bir hafta boyunca hayatta kalabilen inanılmaz dayanıklı bir böcektir.",
        "Radyasyona karşı insanlardan 15 kat daha dirençli olan çok eski bir türdür.",
        "Nefesini 40 dakika boyunca tutabilir ve suyun altında uzun süre kalabilir."
    ],
    "hindi": [
        "Kızdığında veya heyecanlandığında boyun derisi renk değiştirebilen bir yaban kuşudur.",
        "Görüş alanı 270 derecedir, arkasından gelen tehlikeleri kolayca fark eder.",
        "Erkekleri kanatlarını yana açıp kabararak dişileri etkilemeye çalışır."
    ],
    "kanguru": [
        "Geri geri yürüyemeyen nadir hayvanlardandır; sadece ileriye doğru sıçrarlar.",
        "Yavruları doğduğunda bir fasulye tanesi kadardır ve gelişimini annesinin kesesinde tamamlar.",
        "Kuyruklarını 'beşinci bacak' gibi kullanarak dengede dururlar."
    ],
    "karınca": [
        "Kendi vücut ağırlığının 50 katını kaldırabilen dünyanın en güçlü işçisidir.",
        "Akciğerleri yoktur; vücutlarındaki minik deliklerden nefes alırlar.",
        "Kolonileri içinde müthiş bir iş bölümü ve hiyerarşi olan sosyal böceklerdir."
    ],
    "kartal": [
        "Gözleri bir insanınkinden 8 kat daha keskindir ve kilometrelerce öteden avını seçebilir.",
        "Uçarken fırtınaları ve rüzgar akımlarını kullanarak hiç yorulmadan süzülürler.",
        "Yüksek kayalıklara kurdukları yuvaları, nesiller boyu aynı aile tarafından kullanılabilir."
    ],
    "kedi": [
        "Vücutlarında insanlardan daha fazla kemik bulunur ve köprücük kemikleri yoktur.",
        "Çıkardıkları mırlama sesinin insan kemik iyileşmesine yardımcı olduğu bilimsel olarak kanıtlanmıştır.",
        "Başlarının sığdığı her dar yerden tüm vücutlarını geçirebilirler."
    ],
    "kelebek": [
        "Tat alma duyuları ayaklarındadır; kondukları çiçeğin tadını böyle alırlar.",
        "Tırtıl halindeyken bir koza örüp içinde tamamen sıvılaşarak bu forma dönüşürler.",
        "Vücut ısılarını korumak için kanatlarını güneşe karşı açıp beklemeleri gerekir."
    ],
    "koala": [
        "Günde 22 saate kadar uyuyabilen, enerji tasarrufu uzmanı bir memelidir.",
        "Parmak izleri insan parmak izine o kadar benzer ki, adli durumlarda karışıklık yaratabilir.",
        "Sadece belirli bir ağacın yapraklarını yiyerek beslenirler ve su içmeye nadiren ihtiyaç duyarlar."
    ],
    "köpekbalığı": [
        "Vücutlarında hiç kemik yoktur; tüm iskeletleri kıkırdaktan oluşur.",
        "Bir damla kanı kilometrelerce öteden hissedebilen muazzam bir koku duyusuna sahiptirler.",
        "Dişleri hayatları boyunca sürekli dökülür ve yerine yenileri gelir."
    ],
    "kunduz": [
        "Nehirlerin üzerine barajlar kurarak ekosistemi değiştiren doğal mühendislerdir.",
        "Dişleri demir içerdiği için turuncu renktedir ve kemirdikçe aşınmayıp daha da keskinleşir.",
        "Suyun altında 15 dakika boyunca nefeslerini tutabilirler."
    ],
    "penguen": [
        "Uçamazlar ama su altında adeta uçuyormuş gibi çok hızlı yüzerler.",
        "Güney yarımkürenin dondurucu soğuklarında birbirlerine sokularak ısınan sosyal canlılardır.",
        "Eşlerine olan sadakatleriyle bilinirler ve kuluçka döneminde babalar fedakarlık yapar."
    ],
    "tavşan": [
        "Gözleri sayesinde neredeyse tam bir daireyi (360 derece) arkasını dönmeden görebilir.",
        "Havuçtan ziyade yeşil yapraklı otları tercih eden, dişleri ömür boyu uzayan kemirgendir.",
        "Tehlike anında arka ayaklarını yere vurarak diğer grup üyelerini uyarırlar."
    ],
    "yunus": [
        "Uykudayken beyinlerinin sadece bir yarısını dinlendirirler, diğer yarısı nefes almak için uyanık kalır.",
        "Birbirlerine özel ıslıklarla seslenirler; her birinin kendine has bir 'ismi' vardır.",
        "Çok zeki ve oyuncu olan bu memeli, suda ses dalgalarıyla (sonar) yolunu bulur."
    ],
    "zürafa": [
        "Dünyanın en uzun kara hayvanıdır ve kalbi bu mesafeye kan basmak için çok güçlüdür.",
        "Boyunlarında insanlarla aynı sayıda (7 adet) kemik bulunur, sadece kemikler çok daha büyüktür.",
        "Dilleri 50 cm uzunluktadır ve dikenli dalları yemek için zift siyahı-mor bir renktedir."
    ],
    "ağaç kurbağası": [
        "Vücutlarındaki suyun büyük bir kısmı donsa bile hayatta kalabilen türleri vardır.",
        "Ayak parmaklarındaki vantuzlar sayesinde dikey cam yüzeylere bile kolayca tırmanabilirler.",
        "Genellikle nemli ormanlarda ve yüksek dallarda yaşarlar."
    ],
    "ağaç kurdu": [
        "Ahşap yapıların ve mobilyaların içine tüneller açarak beslenen bir larva türüdür.",
        "Sessiz bir ortamda, odunu kemirirken çıkardıkları çıtırtı sesi duyulabilir.",
        "Aslında bir kın kanatlı böceğin yumurtalarından çıkan tırtıl formudur."
    ],
    "ağustosböceği": [
        "Yerin altında 17 yıl boyunca larva olarak yaşayıp, sadece birkaç hafta erginlik süren türleri vardır.",
        "Çıkardıkları ses 100 desibeli aşabilir; bu bir mısır patlatma makinesi kadar gürültülüdür.",
        "Sadece erkekleri, karınlarındaki özel zarları titreterek o meşhur sesi çıkarır."
    ],
    "akbaba": [
        "Mide asitleri o kadar güçlüdür ki şarbon ve kolera gibi ölümcül bakterileri bile yok edebilir.",
        "Doğanın temizlikçileridir; leşleri yiyerek salgın hastalık yayılmasını önlerler.",
        "Gözleri o kadar keskindir ki, binlerce metre yukarıdan yerdeki yiyeceği görebilirler."
    ],
    "anakonda": [
        "Dünyanın en ağır sürüngenlerinden biridir; ağırlığı bir aslanınkine (250 kg) yaklaşabilir.",
        "Avlarını zehirle değil, kaslı gövdeleriyle sarıp sıkarak etkisiz hale getirirler.",
        "Su altında gözleri ve burun delikleri yukarıda kalacak şekilde pusuya yatabilirler."
    ],
    "antilop": [
        "Bazı türleri saatte 90 kilometre hıza ulaşarak karadaki en hızlı ikinci canlı olur.",
        "Yırtıcılardan kaçmak için 3 metre yüksekliğe kadar zıplayarak havada süzülebilirler.",
        "Boynuzları kemik yapılıdır ve dökülmez; ömür boyu büyümeye devam eder."
    ],
    "arıkuşu": [
        "Havada uçan kanatlıları yakalamakta ustalaşmış, rengarenk tüyleri olan bir kuştur.",
        "Avladığı iğneli canlıları yemeden önce dala vurarak etkisiz hale getirir.",
        "Toprak yamaçlara açtığı derin tünellere yuva yaparak yavrularını büyütür."
    ],
    "armadillo": [
        "Kendini korumak için kusursuz bir top haline gelebilen zırhlı bir memelidir.",
        "Vücudunu kaplayan sert plakalar aslında derinin kemikleşmiş halidir.",
        "Neredeyse her zaman dördüz doğururlar ve yavruların hepsi aynı cinsiyettedir."
    ],
    "at sineği": [
        "Isırığı normal hemcinslerinden çok daha acı vericidir çünkü deriyi keserek beslenir.",
        "Genellikle meralarda ve sulak alanlarda büyükbaşları rahatsız eden iri bir kanatlıdır.",
        "Gözleri genellikle rengarenk ve metalik bir parıltıya sahiptir."
    ],
    "ateşböceği": [
        "Kimyasal bir tepkimeyle ürettikleri ışık, dünyanın en verimli ışığıdır ve ısı yaymaz.",
        "Her türün kendine has bir yanıp sönme ritmi ve 'kodu' vardır.",
        "Geceleri birbirlerini bulmak ve eşleşmek için bu biyolojik fenerlerini kullanırlar."
    ],
    "atmaca": [
        "Kısa ve yuvarlak kanatları sayesinde sık ormanların içinde inanılmaz manevralar yapabilir.",
        "Gözleri, havada süzülen en küçük hareketi bile saniyeler içinde analiz eder.",
        "Ülkemizde özellikle Karadeniz bölgesinde evcilleştirilip av eğitiminde kullanılan çevik bir kuştur."
    ],
    "av köpeği": [
        "Koku alma duyusu normal bir evcil türden kat kat daha gelişmiş olan özel bir yardımcıdır.",
        "Hedefi bulduğunda donup kalarak veya burnuyla işaret ederek sahibine rehberlik eder.",
        "Eğitilebilirliği çok yüksek olan, sadık ve enerjik bir saha dostudur."
    ],
    "ayı": [
        "Kutuplarda yaşayan türü aslında siyah derili ve şeffaf tüylüdür; güneş ısısını böyle emer.",
        "Kış uykusu sırasında kalp atışlarını dakikada 8'e kadar düşürebilen bir metabolizma uzmanıdır.",
        "Zekaları primatlara yakındır; doğada alet kullanabildikleri gözlemlenmiştir."
    ],
    "babun": [
        "250 üyeye kadar ulaşabilen, askeri bir disiplinle yönetilen karmaşık sürüler halinde yaşarlar.",
        "Tehlike anında korkutucu uzun köpek dişlerini göstererek 'esneme' hareketi yaparlar.",
        "Afrika'nın savan ve kayalık bölgelerinde yaşayan, oldukça agresif olabilen bir maymundur."
    ],
    "bağ ahtapotu": [
        "Kayalık kıyılarda yaşayan, gövde rengini zeminle aynı saniyede eşitleyen bir kamuflaj ustasıdır.",
        "Zekası ve problem çözme yeteneğiyle laboratuvar deneylerinde bilim insanlarını şaşırtan bir canlıdır.",
        "Sekiz kolundaki vantuzlar sayesinde en kaygan yüzeylere bile sıkıca tutunabilir."
    ],
    "bal porsuğu": [
        "Guinness Rekorlar Kitabı'na göre dünyanın en korkusuz ve hırçın hayvanıdır.",
        "Zehirli yılanlara karşı doğal bağışıklığı vardır; bir kobra tarafından ısırılsa bile sadece uyuyup uyanır.",
        "Derisi o kadar kalındır ki arı iğneleri veya köpek dişleri ona kolay kolay işlemez."
    ],
    "balık": [
        "Vücutlarını kaplayan pulları ve sudaki oksijeni süzen solungaçlarıyla yaşayan canlıların genel adıdır.",
        "Göz kapakları olmadığı için gözleri sürekli açık şekilde uyurlar.",
        "Yüzgeçlerini kullanarak suyun içinde denge kuran ve yön değiştiren omurgalılardır."
    ],
    "barakuda": [
        "Torpido şeklindeki vücuduyla suyun altında aniden çok yüksek hızlara çıkabilen bir avcıdır.",
        "Alt çenesi üst çenesinden daha uzundur ve ağzı sivri, jilet gibi dişlerle doludur.",
        "Gümüşi parlaklığı ve korkutucu bakışlarıyla 'denizlerin kurdu' olarak anılır."
    ],
    "barbunya": [
        "Sıcak denizlerin kumluk ve kayalık bölgelerinde yaşayan, gövdesi kırmızı benekli bir canlıdır.",
        "Aynı isimle bilinen bir baklagil türüyle karıştırılsa da aslında çok kıymetli bir su ürünüdür.",
        "Alt çenesindeki duyarlı bıyıklarıyla kumun altındaki küçük avlarını bulur."
    ],
    "basilisk": [
        "Su yüzeyinde batmadan saniyelerce koşabilme yeteneğiyle 'mucizevi' bir lakap almıştır.",
        "Tehlike anında arka ayakları üzerinde kalkarak göllerin üzerinde hızla ilerler.",
        "Orta Amerika'da yaşayan, başında taç benzeri bir deri bulunan ilginç bir sürüngendir."
    ],
    "bengal kaplanı": [
        "Hindistan'ın milli sembolü olan ve çizgileri her bireyde parmak izi gibi farklı olan dev kedidir.",
        "Yüzmeyi çok severler ve bir oturuşta 30 kilodan fazla et tüketebilirler.",
        "Kükremesi 3 kilometre öteden duyulabilen, ormanın en heybetli yırtıcısıdır."
    ],
    "bit": [
        "Kanatları olmamasına rağmen bir saç telinden diğerine çok hızlı tırmanabilen bir parazittir.",
        "Sirke adı verilen yumurtalarını saç tellerine özel bir sıvıyla kopmayacak şekilde yapıştırır.",
        "Canlıların vücudunda yaşayıp onlardan beslenen, gözle zor görülen bir haşeredir."
    ],
    "boa yılanı": [
        "Avını zehirle değil, güçlü kaslarıyla sarıp göğüs kafesini sıkıştırarak etkisiz hale getirir.",
        "Çenesi kafasından bağımsız hareket ederek kendinden çok daha geniş avları bütün yutabilir.",
        "Yumurtlamak yerine yavrularını canlı olarak dünyaya getiren nadir sürüngenlerdendir."
    ],
    "boğa": [
        "Sanılanın aksine kırmızı rengi ayırt edemez; sadece eldeki pelerin hareketine saldırır.",
        "Sığır sürülerinin en güçlü ve lider karakterli erkek üyesidir.",
        "Güçlü boyun kasları ve keskin boynuzlarıyla otoriteyi temsil eder."
    ],
    "bokböceği": [
        "Yönünü gökyüzündeki Samanyolu galaksisini kullanarak bulan dünyadaki tek böcek türüdür.",
        "Kendi ağırlığının 1000 katından fazlasını itebilen, doğanın en güçlü işçilerinden biridir.",
        "Atıkları top haline getirip yuvarlayarak toprağın altına taşıyan bir temizlikçidir."
    ],
    "böcek": [
        "Dünyadaki tüm hayvan türlerinin yaklaşık %90'ını oluşturan devasa bir sınıftır.",
        "Vücutları baş, göğüs ve karın olmak üzere üç bölümden ve altı bacak yapısından oluşur.",
        "Kutup bölgeleri hariç dünyanın her yerinde ve her iklimde yaşayabilen dayanıklı canlılardır."
    ],
    "bufalo": [
        "Afrika'nın 'Büyük Beşli' listesinde yer alan, dev boynuzlu ve oldukça saldırgan bir yaban sığırıdır.",
        "Hafızaları çok güçlüdür ve sürüsüne zarar veren bir avcıyı yıllar sonra bile tanıyıp saldırabilirler.",
        "Aslanların bile grup halinde değilse yaklaşmaya korktuğu heybetli bir memelidir."
    ],
    "bülbül": [
        "Sesi en melodik ve güzel olan canlı olarak dünya edebiyatına ve müziğine konu olmuştur.",
        "Gül ile olan efsanevi aşkıyla bilinen, genellikle gün batımında ve şafak vaktinde öten bir kuştur.",
        "Görünüşü oldukça sade ve kahverengi olsa da, çıkardığı namelerle hayranlık uyandırır."
    ],
    "camgöz": [
        "Gözlerinin yapısı kristal gibi parlak olduğu için bu ismi almış bir köpekbalığı türüdür.",
        "Genellikle derin denizlerde yaşayan, diğer akrabalarına göre daha uysal olan bir avcıdır.",
        "Kıkırdaklı iskelet yapısına sahip, denizlerin gri renkli sakinlerinden biridir."
    ],
    "ciklet balığı": [
        "Akvaryumcuların en renkli üyelerinden biridir; bazı türleri yavrularını ağzında taşıyarak korur.",
        "Kendi bölgesini savunurken oldukça sertleşebilen, karmaşık sosyal hiyerarşisi olan bir su canlısıdır.",
        "Çok farklı renk varyasyonlarına sahip, genellikle Afrika göllerine özgü bir türdür."
    ],
    "civciv": [
        "Yumurtadan çıkarken kabuğu kırmak için gagasının ucunda geçici bir 'elmas dişi' bulunan kuştur.",
        "Doğar doğmaz etrafı takip edebilen ve kendi kendine beslenmeye başlayan minik bir canlıdır.",
        "Kendi aralarında 'cik cik' sesleriyle haberleşen, kümeslerin en taze üyeleridir."
    ],
    "çarşaf balığı": [
        "Devasa kanatları sayesinde suyun altında uçuyormuş gibi görünen, en büyük vatoz türüdür.",
        "Manta vatozu olarak da bilinir; sadece planktonlarla beslenen barışçıl bir devdir.",
        "Zıplayarak su yüzeyinden yukarı fırlayabilen, denizlerin en zarif canlılarından biridir."
    ],
    "çekirge": [
        "Arka bacakları sayesinde kendi vücut uzunluğunun 20 katı kadar mesafeye zıplayabilir.",
        "Kulakları kafasında değil, karın bölgesinde bulunan ilginç bir eklem bacaklıdır.",
        "Sürü haline geldiklerinde bir günde koca bir tarlayı tamamen kurutabilen bir oburdur."
    ],
    "çekiç başlı köpekbalığı": [
        "Kafasının her iki yanına doğru genişleyen sıra dışı yapısı sayesinde 360 derecelik bir görüş açısına sahiptir.",
        "Kumun altındaki canlıların yaydığı zayıf elektrik sinyallerini algılayabilen özel bir duyu organı vardır.",
        "Okyanusların en ilginç görünümlü ve sosyal davranışı gelişmiş yırtıcısıdır."
    ],
    "çoban köpeği": [
        "Sürüleri korumak için gece gündüz uyanık kalan, bağımsız karar verebilen çok zeki bir yardımcıdır.",
        "Kurtlarla veya hırsızlarla mücadele edebilecek kadar güçlü ve cesur bir yapıya sahiptir.",
        "Sahibine olan sadakati ve koruma içgüdüsüyle bilinen, işçi köpekler sınıfının en büyüğüdür."
    ],
    "palamut": [
        "Büyüklüğüne göre 'çingene' veya 'torik' gibi farklı isimler alan, çok hızlı bir göç canlısıdır.",
        "Gümüşi pullu, eti koyu renkli ve torpido şeklinde bir vücut yapısına sahiptir.",
        "Eylül ayından itibaren Karadeniz'den Marmara'ya doğru sürüler halinde akmaya başlar."
    ],
    "kumru": [
        "Eşlerine olan bağlılıkları nedeniyle 'çifte ...' deyimine konu olmuş, narin yapılı bir kuştur.",
        "Güvercine çok benzemesine rağmen boynundaki siyah halka ve daha ince yapısıyla ayırt edilir.",
        "Sesiyle huzur veren, şehir parklarında ve bahçelerde sıkça görülen bir kanatlıdır."
    ],
    "deniz fili": [
        "Erkeklerinin burnu uzun bir hortumu andıracak şekilde sarkan, devasa bir fok türüdür.",
        "Okyanusun en derinlerine dalabilen ve su altında saatlerce kalabilen ağır sıklet bir memelidir.",
        "Plajlarda bölge hakimiyeti için birbiriyle dövüşen dev cüsseli bir canlıdır."
    ],
    "deniz hıyarı": [
        "Okyanus tabanındaki kumları temizleyerek ekosisteme dev bir filtre gibi hizmet ederler.",
        "Tehlike anında iç organlarını dışarı fırlatıp kaçan ve daha sonra bu organları yenileyebilen ilginç bir canlıdır.",
        "Görünüşü bir sebzeye benzediği için bu benzetme ile isimlendirilmiştir."
    ],
    "deniz ineği": [
        "Sadece su altındaki bitkilerle beslenen, 'manati' olarak da bilinen uysal ve dev bir memelidir.",
        "Denizkızı efsanelerine ilham kaynağı olduğu düşünülen, çok yavaş hareket eden bir canlıdır.",
        "Kuyruk yapısı bir balinayı andıran, barışçıl bir su devidir."
    ],
    "deniz kaplumbağası": [
        "Kafasını ve yüzgeçlerini sert kabuğunun içine çekemeyen, ömrünün neredeyse tamamını okyanusta geçiren bir canlıdır.",
        "Gözyaşı bezleri sayesinde vücudundaki fazla tuzu dışarı atar, bu yüzden sürekli ağlıyor gibi görünür.",
        "Yumurtalarını bırakmak için doğduğu kumsala binlerce mil öteden geri dönen kadim bir gezgindir."
    ],
    "deniz kestanesi": [
        "Vücudu tamamen sert ve sivri dikenlerle kaplı, küre şeklinde bir su canlısıdır.",
        "Kayalık kıyılarda yaşayan, üzerine basıldığında dikenleri deriye batan korumacı bir yapısı vardır.",
        "Ağız kısmı vücudunun tam altında bulunur ve sürekli yosunlarla beslenir."
    ],
    "deniz süngeri": [
        "Beyni, sinir sistemi ve kalbi olmayan, yer değiştirmeden bir kayaya yapışık yaşayan en basit hayvan formudur.",
        "Suyu gözeneklerinden süzerek beslenen, banyo aksesuarı olarak da bilinen doğal bir yapıdır.",
        "Okyanus temizliğinde hayati rol oynayan, yaşayan bir filtre gibidir."
    ],
    "deniz aslanı": [
        "Kulak kepçeleri olan ve arka yüzgeçlerini ayak gibi kullanarak karada yürüyebilen bir türdür.",
        "Sirklerde ve parklarda top sektirme gösterileriyle tanınan, çok zeki ve oyuncu bir memelidir.",
        "Su altında çok hızlı manevra yapabilen, kayalık sahilleri seven bir avcıdır."
    ],
    "kızıl panda": [
        "Bambu ormanlarında yaşayan, ismine rağmen dev akrabasından çok rakuna benzeyen bir canlıdır.",
        "Halkalı ve tüylü bir kuyruğu olan, ağaçların tepesinde vakit geçiren çok sevimli bir memelidir.",
        "Ayak tabanları karda üşümemesi için kalın tüylerle kaplı olan dağ sakinidir."
    ],
    "koç": [
        "Görkemli ve kıvrık boynuzlarıyla bilinen, sürünün yetişkin erkek üyesidir.",
        "Otorite kurmak için diğer rakipleriyle kafa kafaya vuruşarak dövüşen güçlü bir hayvandır.",
        "Yünlü bir kürkü olan ve liderlik özelliğiyle tanınan çiftlik hayvanıdır."
    ],
    "komodo ejderi": [
        "Dünyanın en büyük kertenkelesidir ve tek bir ısırığıyla dev avlarını bile yavaş yavaş etkisiz hale getirir.",
        "Çatallı diliyle havadaki koku moleküllerini toplayarak avının yerini kilometrelerce öteden bulabilir.",
        "Endonezya adalarına has, zırhlı derisi olan devasa bir sürüngendir."
    ],
    "kuzgun": [
        "Sesi kargadan daha kalın ve derindir; gökyüzündeki akrobatik uçuşlarıyla tanınan simsiyah bir kuştur.",
        "Bulmacaları çözebilen, insan yüzlerini unutmayan ve alet kullanabilen dünyanın en zeki canlılarından biridir.",
        "Mitolojide gizemli haberleri taşıyan, uzun ömürlü ve görkemli bir kanatlıdır."
    ],
    "mors": [
        "Kuzey kutbunun dondurucu sularında yaşayan, ağzından sarkan dev fildişleriyle tanınan bir memelidir.",
        "Kalın yağ tabakası ve fırça gibi bıyıklarıyla buzul dünyasına uyum sağlamış heybetli bir canlıdır.",
        "Fildişlerini buza tırmanmak ve su altında yol açmak için kullanan okyanus devidir."
    ],
    "ornitorenk": [
        "Memeli bir hayvan olmasına rağmen yumurtlayan, gagası ördeği andıran çok garip bir canlıdır.",
        "Erkeklerinin ayak bileğinde zehirli bir mahmuz bulunan, bilim dünyasını şaşırtan bir türdür.",
        "Kuyruğu kunduzu, ayakları ise perdeli yapısıyla bir su kuşunu andıran Avustralya yerlisidir."
    ]
    }

    # 3. Merge Logic
    # We want a final dict: final_facts
    # Iterate legacy keys.
    #   Normalize key (remove _DUP2 etc)
    #   If normalized key in user_facts -> Skip (will be added from user_facts)
    #   Else -> Remove _DUP2 from key, Add to final_facts with legacy content
    # Iterate user_facts -> Add to final_facts (overwrite if exists, but we handled that)
    
    final_facts = {}
    
    # Process Legacy
    for key, facts in legacy_facts.items():
        clean_key = key.replace('_DUP2', '').replace('_DUP_FOOD', '').replace('_DUP', '')
        
        # Check if this word is in User's New List
        if clean_key in user_facts:
            # User provided a better version, ignore legacy
            continue
        
        # Check if even after cleaning, it conflicts with something already in final (unlikely since we process legacy first)
        # But wait, maybe "akbaş" and "akbaş_DUP2" both existed in legacy?
        # If so, we take the first one? Or merged? 
        # For simplicity, if clean_key in final_facts, we ignore (deduplicate).
        if clean_key in final_facts:
            continue
            
        final_facts[clean_key] = facts
        
    # Process User
    for key, facts in user_facts.items():
        # User keys are already clean
        final_facts[key] = facts
        
    # 4. Sort Alphabetically
    sorted_keys = sorted(final_facts.keys(), key=lambda k: k.lower().replace('ç','c').replace('ğ','g').replace('ı','i').replace('ö','o').replace('ş','s').replace('ü','u'))
    
    # 5. Generate TS Output
    # We are replacing the first chunk of the file which was alphabetically sorted Animals.
    # The output should NOT have "export const WORD_FACTS = {" wrapper if we are replacing content inside.
    # BUT the target file starts with lines 1-2 wrapper.
    # We are replacing lines 3 to 1723.
    # So we should output just the key-value pairs formatted nicely.
    
    output_lines = []
    
    # Helper for letters headers? 
    # Legacy had // --- A HARFİ ---
    # We can try to recreate that if we want perfect style.
    
    current_letter = ""
    turkish_map = {'ç':'c', 'ğ':'g', 'ı':'i', 'ö':'o', 'ş':'s', 'ü':'u'}
    
    for key in sorted_keys:
        first_char = key[0].upper()
        # Handle i/İ logic roughly
        if first_char == 'İ': first_char = 'I'
        if first_char == 'Ç': first_char = 'C'
        if first_char == 'Ş': first_char = 'S'
        
        # Actually, let's just dump them. The headers are nice but optional.
        # But if we want to match the style...
        # Let's skip headers to avoid complexity in script.
        
        output_lines.append(f'    "{key}": [')
        for i, fact in enumerate(final_facts[key]):
            comma = "," if i < len(final_facts[key]) - 1 else ""
            output_lines.append(f'        "{fact}"{comma}')
        output_lines.append('    ],')
        
    # Save to temp file
    with open('data/temp_animals.ts', 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
        
    print("Successfully generated temp_animals.ts")

if __name__ == "__main__":
    main()
