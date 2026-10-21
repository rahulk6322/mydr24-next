import type { L10n } from "@/i18n/config";

export type Faq = { q: L10n; a: L10n };

export const FAQS: Faq[] = [
  {
    q: { en: "How quickly can I talk to a doctor?", hi: "डॉक्टर से कितनी जल्दी बात हो सकती है?" },
    a: {
      en: "Quick Consult usually connects you in about two minutes. At busy times or in some regions it can take longer; the app shows an estimated wait before you join.",
      hi: "क्विक कंसल्ट में आमतौर पर लगभग दो मिनट में जुड़ जाते हैं। व्यस्त समय में या कुछ इलाकों में ज़्यादा समय लग सकता है; जुड़ने से पहले ऐप अनुमानित इंतज़ार दिखाता है।",
    },
  },
  {
    q: { en: "Is MyDR24 a replacement for 112 or 108?", hi: "क्या MyDR24, 112 या 108 का विकल्प है?" },
    a: {
      en: "No. In a life-threatening emergency, call 112 or 108 first. MyDR24's Quick Medical Service supports coordination and guidance and works alongside public emergency services.",
      hi: "नहीं। जान के खतरे वाली स्थिति में पहले 112 या 108 पर कॉल करें। MyDR24 की त्वरित चिकित्सा सेवा तालमेल और मार्गदर्शन में मदद करती है और सरकारी आपात सेवाओं के साथ काम करती है।",
    },
  },
  {
    q: { en: "Will it work with a weak network or a basic phone?", hi: "क्या यह कमज़ोर नेटवर्क या साधारण फ़ोन पर चलेगा?" },
    a: {
      en: "Yes. Consults switch to audio-only on weak 2G/3G connections, and you can also request a callback on any phone, including feature phones.",
      hi: "हाँ। कमज़ोर 2G/3G पर परामर्श अपने-आप सिर्फ़-ऑडियो पर चला जाता है, और आप फ़ीचर फ़ोन समेत किसी भी फ़ोन पर कॉलबैक माँग सकते हैं।",
    },
  },
  {
    q: { en: "Which languages do doctors speak?", hi: "डॉक्टर कौन-कौन सी भाषाएँ बोलते हैं?" },
    a: {
      en: "Hindi and English are available everywhere, along with major regional languages including Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada, Odia and more, depending on availability.",
      hi: "हिन्दी और अंग्रेज़ी हर जगह उपलब्ध हैं, साथ ही उपलब्धता के अनुसार बांग्ला, मराठी, तमिल, तेलुगु, गुजराती, कन्नड़, ओड़िया जैसी प्रमुख क्षेत्रीय भाषाएँ भी।",
    },
  },
  {
    q: { en: "Are prescriptions from an online consult valid?", hi: "क्या ऑनलाइन परामर्श का पर्चा मान्य है?" },
    a: {
      en: "Doctors issue e-prescriptions according to India's Telemedicine Practice Guidelines. Some medicines cannot be prescribed remotely, and the doctor will tell you if you need an in-person visit.",
      hi: "डॉक्टर भारत के टेलीमेडिसिन प्रैक्टिस दिशानिर्देशों के अनुसार ई-प्रिस्क्रिप्शन देते हैं। कुछ दवाएँ दूर से नहीं लिखी जा सकतीं, और ज़रूरत होने पर डॉक्टर आपको क्लिनिक जाने की सलाह देंगे।",
    },
  },
  {
    q: { en: "How is my health data protected?", hi: "मेरा स्वास्थ्य डेटा कैसे सुरक्षित रहता है?" },
    a: {
      en: "Data is encrypted in transit and at rest, used only for the purposes you consent to, and never sold. You can view, correct or delete your data under the DPDP Act, 2023.",
      hi: "डेटा भेजते और संग्रहित करते समय एन्क्रिप्ट रहता है, सिर्फ़ उन्हीं कामों में उपयोग होता है जिनकी आपने सहमति दी है, और कभी बेचा नहीं जाता। DPDP अधिनियम, 2023 के तहत आप अपना डेटा देख, सुधार या मिटा सकते हैं।",
    },
  },
];

// ILLUSTRATIVE testimonials — replace with real, consented reviews before launch.
export type Testimonial = { name: string; initials: string; role: L10n; quote: L10n; rating: number; warm?: boolean };

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sneha K.", initials: "SK", rating: 5,
    role: { en: "Daughter · Pune", hi: "बेटी · पुणे" },
    quote: {
      en: "I work in Pune and Papa lives in our village near Nashik. The nurse visits every week, and I get the BP report the same evening.",
      hi: "मैं पुणे में काम करती हूँ और पापा नासिक के पास हमारे गाँव में रहते हैं। नर्स हर हफ़्ते आती हैं और उसी शाम मुझे BP रिपोर्ट मिल जाती है।",
    },
  },
  {
    name: "Ramesh Y.", initials: "RY", rating: 5, warm: true,
    role: { en: "Parent · Gorakhpur", hi: "पिता · गोरखपुर" },
    quote: {
      en: "At 11 at night my son had a high fever. The doctor spoke to us in Bhojpuri and told us exactly what to do.",
      hi: "रात 11 बजे मेरे बेटे को तेज़ बुखार था। डॉक्टर ने हमसे भोजपुरी में बात की और ठीक-ठीक बताया कि क्या करना है।",
    },
  },
  {
    name: "Vignesh M.", initials: "VM", rating: 4,
    role: { en: "Son · Dubai", hi: "बेटा · दुबई" },
    quote: {
      en: "Amma doesn't use a smartphone, but the reminder calls in Tamil mean she hasn't missed her medicines in months.",
      hi: "अम्मा स्मार्टफ़ोन नहीं चलातीं, लेकिन तमिल में आने वाले रिमाइंडर कॉल की वजह से महीनों से उनकी कोई दवा नहीं छूटी।",
    },
  },
];
