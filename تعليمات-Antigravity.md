# تعليمات لـAntigravity: توليد صور موقع الذاكرة عتاد الثائرين

أنت تولّد سبع صور لموقع جاهز، وتضعها في مجلده بأسماء محددة، ثم تتحقق أن الموقع يعرضها. لا تعدّل أي ملف غير ما ذُكر هنا. هذا الملف كافٍ بنفسه ولا تحتاج قراءة غيره.

## المكان

المستودع: `kakramah/khaldoun`، الفرع: `claude/dhakira-etad-site` (لا تنشئ فرعاً جديداً ولا طلب دمج جديداً، فالطلب رقم 7 مفتوح).
المجلد: `sites/al-dhakira-etad/img/`

## الملفات المطلوبة بأسمائها

| الاسم | موضعها في الموقع | المقاس | الحد الأقصى للحجم |
|---|---|---|---|
| `hero.jpg` | الشاشة الأولى | 3840×2160 (16:9) | 2.5 ميغابايت |
| `c1.jpg` | الفصل الأول، صباح | 3000×1200 (5:2) | 1.5 ميغابايت |
| `c2.jpg` | الفصل الثاني، غسق | 3000×1200 | 1.5 ميغابايت |
| `c3.jpg` | الفصل الثالث، ليل | 3000×1200 | 1.5 ميغابايت |
| `c4.jpg` | الفصل الرابع، طريق | 3000×1200 | 1.5 ميغابايت |
| `c5.jpg` | الفصل الخامس، مصباح وأوراق | 3000×1200 | 1.5 ميغابايت |
| `c6.jpg` | الفصل السادس، فجر | 3000×1200 | 1.5 ميغابايت |

صيغة JPEG بجودة نحو 88 ومساحة ألوان sRGB. إن لم تدعم الأداة النسبة بدقة فولّد بأقرب نسبة ثم اقصّ من الوسط إلى المقاس أعلاه.

## قيود التركيب (يقصّ الموقع الصورة ويذيب حوافها)

- يُخفي الموقع نحو 24% من أعلى الصورة وأسفلها بتدرج. ضع كل ما يهمّ في **الوسط الرأسي**.
- في `hero.jpg` يُكتب العنوان فوق **النصف الأسفل**: اجعل أسفل الصورة هادئاً غير مزدحم، والمباني في الوسط والأعلى.
- الصورة تتحرك بضع بكسلات مع التمرير، فلا تجعل التفصيل الأهم على الحافة.

## قواعد تسري على السبع كلها

- لا نص مقروء داخل الصورة، لا لافتات ولا أرقام ولا حروف.
- لا علم ولا شعار ولا رمز سياسي.
- لا وجوه. لا دم ولا ركام ولا أسلحة ولا دخان حريق.
- لا ناس إلا اليدان في `c5.jpg`.
- الضوء والحبيبة واللون **متجانسة بين السبع**: ألوان خافتة دافئة، حبيبة فيلم ناعمة، لا تشبّع صارخ، لا توهج مفتعل.
- يجب ألا تدل الصورة على أنها مولَّدة: بلا سطوح بلاستيكية، بلا نظافة مفرطة، بلا تماثل مفرط، مع لا انتظام حقيقي في الخرسانة والنوافذ والشرفات.
- بناء سكني شامي عام. لا تقلّد مدينة بعينها ولا تصوّر مكاناً بعينه مدمَّراً.
- لا توقيع ولا أفاتار داخل الصورة.

## البرومبتات (الصق كل واحد كما هو في أداة التوليد)

### hero.jpg

```
Documentary photograph, wide, a Levantine concrete apartment block facade at blue hour seen from low street level, balconies with potted plants and laundry lines, roughly one third of the windows lit with warm tungsten light, the rest dark; no people, no vehicles, no signage text.
Camera: Sony A7 IV, 35mm f/1.4 at f/2.8, 1/60s, ISO 1600, Kodak Portra 800 film-grain look.
Light: ambient blue-hour sky from above-left at 9500K, window light at 2800K, soft falloff, deep shadows on the lower floors with detail still readable in the shadow map.
Layer 4: no human surface visible; if a figure appears it is only a distant silhouette behind a curtain, no skin detail needed.
Surfaces: weathered unpainted concrete with water stains, rust streaks under balcony rails, slightly uneven window shutters, real asymmetry.
Negative space: the upper third is calm dusk sky, and the lower third stays quiet and uncluttered for overlaid text.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c1.jpg

```
Documentary photograph, wide, the same kind of apartment block in early morning, a few windows open with curtains moving, a small neighborhood shop shutter half raised at street level with no readable signage, sunlight just touching the upper floors; no people.
Camera: Leica Q2, 28mm f/1.7 at f/4, 1/250s, ISO 400, Fuji Pro 400H film look.
Light: low sun from camera-right at 4800K grazing the upper facade, cool shaded street at 6500K, long soft shadow map.
Layer 4: no human surface visible.
Surfaces: matte concrete, peeling paint, dust on glass, a plastic chair left on a balcony.
Negative space: wide pale sky on the left third.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c2.jpg

```
Documentary photograph, wide, a residential street at dusk, metal shutters of ground-floor shops pulled down, upper windows with curtains drawn and a few lit, a bare concrete wall in the foreground with faint remains of old posters scraped off (no readable text), nobody in frame.
Camera: Canon EOS R6, 50mm f/1.2 at f/2.8, 1/80s, ISO 3200, CineStill 800T halation subtle.
Light: last daylight from behind-left at 7500K, sodium street lamp at 2200K on the wall, hard-edged shadow map under the lamp.
Layer 4: no human surface visible.
Surfaces: scraped plaster, tape residue, dust, rusted shutter rails.
Negative space: dark empty right half of the wall.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c3.jpg

```
Documentary photograph, wide, apartment block at night with almost all windows dark and exactly one window lit warm in the upper right area, faint stars, no people, no text.
Camera: Sony A7S III, 35mm f/1.4 at f/2, 1/30s tripod, ISO 3200, slight long-exposure softness.
Light: one window at 2700K with a small natural bloom, moonless sky at 11000K, very low ambient, shadow map nearly black with texture still visible in the concrete.
Layer 4: no human surface visible, no silhouette in the lit window.
Surfaces: damp concrete, a rusted water tank on the roof, uneven cable lines.
Negative space: the dark left half stays quiet.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c4.jpg

```
Documentary photograph, wide, an empty two-lane asphalt road running straight toward a hazy horizon between wooden electricity poles with sagging wires, flat farmland on both sides, morning fog thick in the distance, no vehicles, no people, no ruins, no text.
Camera: Hasselblad X2D, 90mm at f/8, 1/125s, ISO 200, Kodak Ektar-muted grade.
Light: flat overcast at 6000K, fog diffusion, shadow map almost absent, desaturated ash palette.
Layer 4: no human surface visible.
Surfaces: cracked asphalt with faded center line, gravel shoulder, damp wood on the poles.
Negative space: the upper half is empty pale fog.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c5.jpg

```
Documentary photograph, wide, a desk lamp lighting a stack of loose papers and photographs lying face down, a pair of weathered adult hands squaring the edge of a folder, no face, no readable text on any paper, a dark room around.
Camera: Nikon Z6 II, 85mm f/1.8 at f/2.2, 1/60s, ISO 1600, Kodak Vision3 500T look.
Light: single incandescent desk lamp from upper-left at 2700K, falloff to near black at the right, dust motes in the cone, shadow map with deep contrast.
Layer 4 for the hands: matte dry skin with fine creases, visible pores on the knuckles, slight redness at the fingertips, short unpolished nails, no sheen, no retouched smoothness, tone between warm beige and olive.
Surfaces: worn wooden desk with ring marks, soft paper edges, a metal paperclip.
Negative space: the right third stays dark and empty.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c6.jpg

```
Documentary photograph, wide, the apartment block at first light, pale green-grey sky, a handful of windows beginning to glow warm, a ground-floor door standing open with light inside, no people, no text.
Camera: Fujifilm GFX 100S, 45mm at f/5.6, 1/125s, ISO 400, Fuji Pro 160NS pastel look.
Light: dawn from camera-right at 5600K, window light at 3000K, gentle shadow map, cool shaded facade, a faint mist at street level.
Layer 4: no human surface visible.
Surfaces: clean-washed concrete after rain, wet asphalt reflections, a bicycle leaning on the wall.
Negative space: soft empty sky across the top.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

## فحص كل صورة قبل قبولها

ارفض الصورة وأعد توليدها (حتى ثلاث محاولات) إن وُجد فيها أي مما يلي:
- نص أو حروف أو أرقام، أو علم أو شعار.
- وجه أو شخص (عدا اليدين في `c5.jpg`).
- نوافذ أو شرفات متماثلة تماماً، أو خرسانة ملساء كالبلاستيك، أو توهج مبالغ.
- ألوان صارخة أو أصفر أو برتقالي مشبع، أو أزرق ساطع.
- اختلاف واضح في الحبيبة أو درجة الألوان عن بقية السبع.

إن فشلت صورة بعد ثلاث محاولات فاتركها فارغة في `manifest.json` (سيبقى الموقع يعرض الرسم البرمجي مكانها) واذكرها في التقرير.

## ربط الصور بالموقع

عدّل `img/manifest.json` بحيث يحمل اسم كل ملف نجح، ومن فشل يبقى نصاً فارغاً:

```json
{ "hero": "hero.jpg", "c1": "c1.jpg", "c2": "c2.jpg", "c3": "c3.jpg", "c4": "c4.jpg", "c5": "c5.jpg", "c6": "c6.jpg" }
```

## التحقق (إلزامي قبل أن تقول تمّ)

1. من داخل `sites/al-dhakira-etad` شغّل `python3 -m http.server 8000` وافتح الصفحة في متصفح فعلي.
2. التقط الشاشة بعرض 390 وبعرض 1440 للهيرو ولكل فصل من الستة.
3. تأكد في كل لقطة أن الصورة ظهرت مكان الرسم (العنصر `img.plate-img` موجود داخل `.plate`)، وأن حوافها تذوب في خلفية الصفحة دون حد مستطيل، وأن النص مقروء فوق الهيرو.
4. تأكد أن لوحة الأخطاء في المتصفح فارغة، وأنه لا تمرير أفقياً.
5. إن بدت صورة أفتح أو أغمق من خلفية فصلها بحيث يظهر حد قاطع، فلا تعدّل الصفحة. أعد توليدها بإضاءة أقرب إلى الخلفية، أو أبلغ بذلك.

## الحفظ

```
git add sites/al-dhakira-etad/img
git commit -m "صور موقع الذاكرة عتاد الثائرين"
git push origin claude/dhakira-etad-site
```

## التقرير (ثلاثة أسطر)

تمّ: أي الصور وُلّدت وظهرت في الموقع.
لم يتمّ: أي صورة فشلت وسببها.
عليّ: ما يحتاج قرار خلدون، أو لا شيء.
