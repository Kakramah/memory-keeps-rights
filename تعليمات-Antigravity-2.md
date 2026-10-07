# تعليمات Antigravity، الجولة الثانية: صور شامية وأزواج متمازجة

المجلد: `sites/al-dhakira-etad/img/` على الفرع `claude/dhakira-etad-site`. لا تعدّل غير الصور و`img/manifest.json`.

## لماذا جولة ثانية

صور الجولة الأولى: `hero.jpg` و`c5.jpg` ممتازتان وتبقيان كما هما، فلا تلمسهما. أما الباقي فرفضتُه لسببين:
1. ثلاث صور ليست شامية: الفصل الثاني شارع بريطاني، والثالث عمارة سوفييتية أمام غابة بتولا، والسادس مبنى ألماني بأشجار صنوبر. الموقع عن سوريا، ولا يليق أن يرى القارئ عمارة أوروبية على أنها بيوت أهلها.
2. الفصلان الثالث والسادس كانت حركتهما أن تنطفئ النوافذ أو تُضاء مع القراءة. الصورة الواحدة تُفقدهما ذلك، فنحتاج **صورتين متطابقتي التكوين** لكل منهما يمزج الموقع بينهما.

## الملفات المطلوبة

| الملف | المحتوى | ملاحظة |
|---|---|---|
| `c1.jpg` | الفصل الأول، صباح | صورة جديدة |
| `c2.jpg` | الفصل الثاني، غسق وشارع | صورة جديدة شامية |
| `c3.jpg` | الفصل الثالث، مساء ونوافذ كثيرة مضاءة | الأساس |
| `c3b.jpg` | **التعديل نفسه على c3**: ليل ونافذة واحدة مضاءة | تعديل صورة بصورة (image-to-image) |
| `c4.jpg` | الفصل الرابع، طريق وضباب | تُستبدل بمنظر متوسطي |
| `c6.jpg` | الفصل السادس، فجر ونوافذ قليلة مضاءة | الأساس |
| `c6b.jpg` | **التعديل نفسه على c6**: أكثر من نصف النوافذ مضاءة والباب مفتوح بضوء | تعديل صورة بصورة |

المقاس والحجم والصيغة كما في الجولة الأولى: `c*.jpg` بمقاس 3000×1200 وأقل من 1.5 ميغابايت، JPEG بجودة 88 وsRGB. استعمل `git add -f` فالمستودع يستثني jpg.

## قاعدة الزوج (c3 مع c3b، وc6 مع c6b)

الصورتان يجب أن تكونا **المبنى نفسه والزاوية نفسها والتكوين نفسه**، تختلفان في الإضاءة والنوافذ فقط، لأن الموقع يمزج الثانية فوق الأولى بالتدريج. ولّد الأولى، ثم **عدّلها** بأداة تعديل الصور ("اجعل كل النوافذ مظلمة إلا نافذة واحدة" مثلاً) ولا تولّد الثانية من الصفر. إن لم تتوفر أداة تعديل فاذكر ذلك في تقريرك ولا تسلّم زوجاً مختلف التكوين، فالمزج بينهما سيبدو خطأً.

## مرجع بصري حقيقي (إن دعمت أداتك صورة مرجعية)

في بيتك على جهازك صور حقيقية لجبلة: `/Users/khaldounaakramah/khaldoun/photos/صور-جبلة-الحقيقية/` (الفهرس في `knowledge/visual/jableh-real-photos-index.md`). استعمل منها **المباني والشوارع فقط** مرجعاً للعمارة والألوان والمواد، ولا تنقل منها وجوهاً ولا ناساً.

## قاعدة الطابع الشامي في كل برومبت

كل صورة تحمل هذه الإشارات: بناء سكني من الثمانينيات أو التسعينيات في مدينة ساحلية سورية (على طراز اللاذقية وجبلة)، سطح مستوٍ بخزانات مياه سوداء بلاستيكية وسخانات شمسية، أطباق استقبال، شرفات بدرابزين حديد وأصص نباتات، خرسانة مطلية بلون بيج ورمادي مبقّع بالرطوبة، أبواب محال معدنية مسحوبة، نخيل وحمضيات وسرو.

**ممنوع في كل الصور:** أشجار بتولا أو صنوبر شمالية، عمارة ألواح سوفييتية، بيوت طوب أحمر متلاصقة، ثلج، أثاث شارع أوروبي، أي نص لاتيني أو سيريلي أو عربي مقروء، وجوه، دم، ركام، أعلام.

وتبقى القواعد المشتركة من الجولة الأولى: ألوان خافتة دافئة، حبيبة فيلم ناعمة، لا توهج مفتعل، ولا نظافة بلاستيكية ولا تماثل مفرط، والضوء والحبيبة متجانسة بين كل الصور.

## البرومبتات

### c1.jpg

```
Documentary photograph, wide, a Syrian coastal-city residential block from the 1980s in early morning, beige and grey painted concrete with damp stains, balconies with iron railings and potted plants, black plastic water tanks and solar water heaters on the flat roof, satellite dishes, the metal rolling shutter of a small corner shop half raised with no readable signage, a few windows open with curtains moving, citrus and palm trees along a narrow street, sunlight just touching the upper floors; no people, no vehicles.
Camera: Leica Q2, 28mm f/1.7 at f/4, 1/250s, ISO 400, Fuji Pro 400H film look.
Light: low sun from camera-right at 4800K grazing the upper facade, cool shaded street at 6500K, long soft shadow map.
Layer 4: no human surface visible.
Surfaces: matte painted concrete with peeling patches, dust on glass, a plastic chair left on a balcony.
Negative space: wide pale sky on the left third.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c2.jpg

```
Documentary photograph, wide, a narrow residential street in a Syrian coastal city at dusk, four-storey concrete blocks with iron-railed balconies, plants and hanging laundry, ground-floor metal rolling shutters pulled down, upper windows with curtains drawn and a few lit, a bare concrete wall in the foreground with faint remains of old posters scraped off (no readable text), one sodium street lamp, a palm and a cypress in the distance, nobody in frame.
Camera: Canon EOS R6, 50mm f/1.2 at f/2.8, 1/80s, ISO 3200, CineStill 800T halation subtle.
Light: last daylight from behind-left at 7500K, sodium street lamp at 2200K on the wall, hard-edged shadow map under the lamp.
Layer 4: no human surface visible.
Surfaces: scraped plaster, tape residue, dust, rusted shutter rails.
Negative space: dark empty right half of the wall.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c3.jpg (الأساس: مساء ونوافذ كثيرة مضاءة)

```
Documentary photograph, wide, a Syrian coastal-city residential block from the 1980s at early evening seen from across a quiet street, about sixty percent of the windows lit with warm light, balconies with iron railings and plants, black plastic water tanks and solar water heaters on the flat roof, satellite dishes, a palm tree at the edge of frame; no people, no vehicles, no text.
Camera: Sony A7 IV, 35mm f/1.4 at f/2.8, 1/60s, ISO 1600.
Light: deep blue dusk sky at 9500K, window light at 2800K, soft falloff.
Layer 4: no human surface visible.
Surfaces: beige and grey painted concrete with damp stains, rust under balcony rails.
Negative space: dark sky across the upper third.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c3b.jpg (عدّل c3.jpg بأداة تعديل الصور بهذا الأمر، ولا تولّد من الصفر)

```
Edit the attached image without changing the building, framing, camera angle or composition: make it deep night with a moonless starry sky, turn off the light in every window except exactly one window in the upper right area which stays warm at 2700K with a small natural bloom, keep the damp-stained concrete texture visible in the shadows, keep the same grain. Add no people, no text.
```

### c4.jpg (تُستبدل)

```
Documentary photograph, wide, an empty two-lane asphalt road running straight toward a hazy horizon on a Mediterranean plain, ploughed red-brown fields and olive trees on both sides, concrete electricity poles with sagging wires, thick low morning mist in the distance, faint outline of hills barely visible, no vehicles, no people, no ruins, no text.
Camera: Hasselblad X2D, 90mm at f/8, 1/125s, ISO 200, muted grade.
Light: flat overcast at 6000K, fog diffusion, almost no shadows, desaturated ash palette.
Layer 4: no human surface visible.
Surfaces: cracked asphalt with a faded centre line, gravel shoulder, damp concrete poles.
Negative space: the upper half is empty pale fog.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c6.jpg (الأساس: فجر ونوافذ قليلة)

```
Documentary photograph, wide, a Syrian coastal-city residential block from the 1980s at first light, pale green-grey sky, only about fifteen percent of the windows glowing warm, the ground-floor entrance door closed and dark, balconies with iron railings and potted plants, black water tanks on the flat roof, palm and cypress trees, wet asphalt after rain with a faint mist at street level, a bicycle leaning on the wall; no people, no text.
Camera: Fujifilm GFX 100S, 45mm at f/5.6, 1/125s, ISO 400, pastel look.
Light: dawn from camera-right at 5600K, window light at 3000K, gentle shadow map.
Layer 4: no human surface visible.
Surfaces: beige painted concrete washed by rain, damp stains, reflections on the road.
Negative space: soft empty sky across the top.
Generate the visual core without any signature or avatar. Reserve quiet space for the approved signature-and-avatar unit to be composited afterward according to canonical-values §1–2.
```

### c6b.jpg (عدّل c6.jpg بأداة تعديل الصور بهذا الأمر، ولا تولّد من الصفر)

```
Edit the attached image without changing the building, framing, camera angle or composition: light up more than half of the windows with warm glow at 3000K, open the ground-floor entrance door with warm light spilling out, keep the same pale green-grey dawn sky, mist, wet road and grain. Add no people, no text.
```

## ربطها بالموقع

```json
{ "hero": "hero.jpg", "c1": "c1.jpg", "c2": "c2.jpg", "c3": "c3.jpg", "c3b": "c3b.jpg", "c4": "c4.jpg", "c5": "c5.jpg", "c6": "c6.jpg", "c6b": "c6b.jpg" }
```

الصورة التي تفشل تُترك قيمتها نصاً فارغاً، ويعرض الموقع مكانها الرسم التفاعلي. **زوج ناقص (أساس بلا ثانيته) يُترك كلاهما فارغاً.**

## الأولوية إن نفد رصيد التوليد

ارفع بعد كل دفعة بـ commit مستقل بهذا الترتيب: ١) `c2` ٢) زوج `c3` ٣) زوج `c6` ٤) `c1` ٥) `c4`.

## الفحص قبل أن تقول تمّ

ارفض أي صورة وأعد توليدها (حتى ثلاث محاولات) إن ظهر فيها ما يخالف قاعدة الطابع الشامي أعلاه، أو نص مقروء، أو وجه، أو ناس. وبعد الدفعة:

1. `git pull` في مجلد العمل أولاً، فقد تغيّر `app.js` و`style.css` و`index.html` من جهتي ليدعم الأزواج.
2. شغّل الموقع (`python3 -m http.server 8000`) والتقط لقطات بعرض 390 و1440.
3. الفصل الثالث: مرّر القراءة وتأكد أن صورة الليل تظهر تدريجياً فوق صورة المساء. الفصل السادس: افتح الحقوق الأربعة واحداً بعد آخر وتأكد أن صورة النوافذ المضاءة تظهر تدريجياً.
4. لوحة أخطاء المتصفح فارغة، ولا تمرير أفقياً، وحواف الصور تذوب في الصفحة.

## التقرير (ثلاثة أسطر)

تمّ: أي الصور رُفعت وظهرت.
لم يتمّ: أي صورة أو زوج فشل وسببه.
عليّ: ما يحتاج قرار خلدون، أو لا شيء.
