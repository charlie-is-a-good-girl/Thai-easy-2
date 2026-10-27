import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Volume2, Mic, MicOff, Bookmark, BookmarkCheck, Trash2, 
  Copy, Check, Sparkles, BookOpen, MessageSquare, Music, Tag, 
  ChevronRight, Play, RotateCcw, Download, Plus, Filter, Info, ArrowRight, Folder
} from 'lucide-react';

// --- Thai Phonetic & Dictionary Database ---
const DICTIONARY_DATABASE = [
  {
    thai: "สวัสดีครับ",
    roman: "sà-wàt-dee kráp",
    zh: "你好（男性客氣用語）",
    en: "Hello (polite male)",
    words: [
      { thai: "สวัสดี", roman: "sà-wàt-dee", tone: "Low - Mid", pos: "感嘆詞", zh: "你好", en: "Hello" },
      { thai: "ครับ", roman: "kráp", tone: "High", pos: "語氣詞", zh: "男性敬語助詞", en: "Polite particle (male)" }
    ]
  },
  {
    thai: "สวัสดีค่ะ",
    roman: "sà-wàt-dee kâ",
    zh: "你好（女性客氣用語）",
    en: "Hello (polite female)",
    words: [
      { thai: "สวัสดี", roman: "sà-wàt-dee", tone: "Low - Mid", pos: "感嘆詞", zh: "你好", en: "Hello" },
      { thai: "ค่ะ", roman: "kâ", tone: "Falling", pos: "語氣詞", zh: "女性敬語助詞", en: "Polite particle (female)" }
    ]
  },
  {
    thai: "ขอบคุณมากครับ",
    roman: "kɔ̀ɔp-kun mâak kráp",
    zh: "非常感謝你",
    en: "Thank you very much",
    words: [
      { thai: "ขอบคุณ", roman: "kɔ̀ɔp-kun", tone: "Low - Mid", pos: "動詞", zh: "感謝", en: "Thank" },
      { thai: "มาก", roman: "mâak", tone: "Falling", pos: "副詞", zh: "非常/很多", en: "Very/Much" },
      { thai: "ครับ", roman: "kráp", tone: "High", pos: "語氣詞", zh: "男性敬語助詞", en: "Polite particle" }
    ]
  },
  {
    thai: "เท่าไหร่ครับ",
    roman: "tâo-rài kráp",
    zh: "這個多少錢？",
    en: "How much is this?",
    words: [
      { thai: "เท่าไหร่", roman: "tâo-rài", tone: "Falling - Low", pos: "疑問詞", zh: "多少錢", en: "How much" },
      { thai: "ครับ", roman: "kráp", tone: "High", pos: "語氣詞", zh: "敬語助詞", en: "Polite particle" }
    ]
  },
  {
    thai: "ลดหน่อยได้ไหม",
    roman: "lót nɔ̀ɔi dâi mái",
    zh: "可以便宜一點嗎？",
    en: "Can you give a discount?",
    words: [
      { thai: "ลด", roman: "lót", tone: "High", pos: "動詞", zh: "降低/打折", en: "Reduce/Discount" },
      { thai: "หน่อย", roman: "nɔ̀ɔi", tone: "Low", pos: "副詞", zh: "一點點", en: "A little" },
      { thai: "ได้ไหม", roman: "dâi mái", tone: "Falling - High", pos: "短語", zh: "可以嗎", en: "Can you?" }
    ]
  },
  {
    thai: "ห้องน้ำอยู่ที่ไหน",
    roman: "hɔ̂ɔng-nám yùu tîi-nǎi",
    zh: "洗手間在哪裡？",
    en: "Where is the restroom?",
    words: [
      { thai: "ห้องน้ำ", roman: "hɔ̂ɔng-nám", tone: "Falling - High", pos: "名詞", zh: "洗手間/廁所", en: "Restroom" },
      { thai: "อยู่", roman: "yùu", tone: "Low", pos: "動詞", zh: "在", en: "To be at" },
      { thai: "ที่ไหน", roman: "tîi-nǎi", tone: "Falling - Rising", pos: "疑問詞", zh: "哪裡", en: "Where" }
    ]
  },
  {
    thai: "อร่อยมาก",
    roman: "a-rɔ̀ɔi mâak",
    zh: "非常美味/很好吃",
    en: "Very delicious",
    words: [
      { thai: "อร่อย", roman: "a-rɔ̀ɔi", tone: "Low", pos: "形容詞", zh: "美味/好吃", en: "Delicious" },
      { thai: "มาก", roman: "mâak", tone: "Falling", pos: "副詞", zh: "非常", en: "Very" }
    ]
  },
  {
    thai: "เช็คบิลด้วยครับ",
    roman: "chék bin dûai kráp",
    zh: "請幫我結帳",
    en: "Check please",
    words: [
      { thai: "เช็คบิล", roman: "chék bin", tone: "High - Mid", pos: "動詞短語", zh: "買單/結帳", en: "Check bill" },
      { thai: "ด้วย", roman: "dûai", tone: "Falling", pos: "副詞", zh: "順便/請", en: "Please/Also" },
      { thai: "ครับ", roman: "kráp", tone: "High", pos: "語氣詞", zh: "敬語助詞", en: "Polite particle" }
    ]
  },
  {
    thai: "ยินดีที่ได้รู้จัก",
    roman: "yin-dee tîi dâi rúu-jàk",
    zh: "很高興認識你",
    en: "Nice to meet you",
    words: [
      { thai: "ยินดี", roman: "yin-dee", tone: "Mid - Mid", pos: "動詞", zh: "開心的/高興的", en: "Pleased" },
      { thai: "ที่", roman: "tîi", tone: "Falling", pos: "介詞", zh: "能夠...", en: "To" },
      { thai: "ได้", roman: "dâi", tone: "Falling", pos: "助動詞", zh: "獲得/能夠", en: "Get to" },
      { thai: "รู้จัก", roman: "rúu-jàk", tone: "High - Low", pos: "動詞", zh: "認識", en: "Know" }
    ]
  }
];

// --- Alphabet Database ---
const CONSONANTS = [
  { char: "ก", name: "ก ไก่ (gor gai)", class: "中輔音", init: "k", final: "k", mean: "雞" },
  { char: "ข", name: "ข ไข่ (khor khai)", class: "高輔音", init: "kh", final: "k", mean: "蛋" },
  { char: "ค", name: "ค ควาย (khor khway)", class: "低輔音", init: "kh", final: "k", mean: "水牛" },
  { char: "ง", name: "ง งู (ngor ngoo)", class: "低輔音", init: "ng", final: "ng", mean: "蛇" },
  { char: "จ", name: "จ จาน (jor jaan)", class: "中輔音", init: "ch/j", final: "t", mean: "盤子" },
  { char: "ฉ", name: "ฉ ฉิ่ง (chor ching)", class: "高輔音", init: "ch", final: "-", mean: "鈸" },
  { char: "ช", name: "ช ช้าง (chor chaang)", class: "低輔音", init: "ch", final: "t", mean: "大象" },
  { char: "ซ", name: "ซ โซ่ (sor soh)", class: "低輔音", init: "s", final: "t", mean: "鐵鍊" },
  { char: "ด", name: "ด เด็ก (dor dek)", class: "中輔音", init: "d", final: "t", mean: "小孩" },
  { char: "ต", name: "ต เต่า (tor tao)", class: "中輔音", init: "t", final: "t", mean: "烏龜" },
  { char: "ท", name: "ท ทหาร (thor ta-haan)", class: "低輔音", init: "th", final: "t", mean: "軍人" },
  { char: "น", name: "น หนู (nor noo)", class: "低輔音", init: "n", final: "n", mean: "老鼠" },
  { char: "บ", name: "บ ใบไม้ (bor bai-mai)", class: "中輔音", init: "b", final: "p", mean: "樹葉" },
  { char: "ป", name: "ป ปลา (por plaa)", class: "中輔音", init: "p", final: "p", mean: "魚" },
  { char: "ผ", name: "ผ ผึ้ง (phor pheung)", class: "高輔音", init: "ph", final: "-", mean: "蜜蜂" },
  { char: "ฝ", name: "ฝ ฝา (for faa)", class: "高輔音", init: "f", final: "-", mean: "蓋子" },
  { char: "พ", name: "พ พาน (phor phaan)", class: "低輔音", init: "ph", final: "p", mean: "高腳托盤" },
  { char: "ม", name: "ม ม้า (mor maa)", class: "低輔音", init: "m", final: "m", mean: "馬" },
  { char: "ย", name: "ย ยักษ์ (yor yak)", class: "低輔音", init: "y", final: "y", mean: "夜叉" },
  { char: "ร", name: "ร เรือ (ror reua)", class: "低輔音", init: "r", final: "n", mean: "船" },
  { char: "ล", name: "ล ลิง (lor ling)", class: "低輔音", init: "l", final: "n", mean: "猴子" },
  { char: "ว", name: "ว แหวน (wor waen)", class: "低輔音", init: "w", final: "w", mean: "戒指" },
  { char: "ส", name: "ส เสือ (sor seua)", class: "高輔音", init: "s", final: "t", mean: "老虎" },
  { char: "ห", name: "ห หีบ (hor heep)", class: "高輔音", init: "h", final: "-", mean: "箱子" },
  { char: "อ", name: "อ อ่าง (or aang)", class: "中輔音", init: "零輔音", final: "-", mean: "水盆" },
  { char: "ฮ", name: "ฮ นกฮูก (hor nok-hook)", class: "低輔音", init: "h", final: "-", mean: "貓頭鷹" }
];

const VOWELS = [
  { char: "-ะ", name: "Sara A", type: "短元音", sound: "a", example: "จะ (cha)" },
  { char: "-า", name: "Sara Aa", type: "長元音", sound: "aa", example: "มา (maa)" },
  { char: "อิ", name: "Sara I", type: "短元音", sound: "i", example: "ชิม (chim)" },
  { char: "อี", name: "Sara Ii", type: "長元音", sound: "ee", example: "ดี (dee)" },
  { char: "อึ", name: "Sara Ue", type: "短元音", sound: "ue", example: "ตึก (tuek)" },
  { char: "อื", name: "Sara Uee", type: "長元音", sound: "uee", example: "มือ (muee)" },
  { char: "อุ", name: "Sara U", type: "短元音", sound: "u", example: "ดุ (du)" },
  { char: "อู", name: "Sara Uu", type: "長元音", sound: "uu", example: "ดู (duu)" },
  { char: "เ-ะ", name: "Sara Eh", type: "短元音", sound: "e", example: "เตะ (te)" },
  { char: "เ-", name: "Sara Ay", type: "長元音", sound: "ay", example: "มาเก๊า" },
  { char: "แ-", name: "Sara Ae", type: "長元音", sound: "ae", example: "แม่ (mae)" },
  { char: "โ-", name: "Sara Oh", type: "長元音", sound: "oh", example: "โต (toh)" },
  { char: "เ-า", name: "Sara Ao", type: "特殊元音", sound: "ao", example: "เอา (ao)" },
  { char: "เ-ีย", name: "Sara Ia", type: "雙元音", sound: "ia", example: "เมีย (mia)" }
];

const NUMBERS = [
  { thaiNum: "๐", arabNum: "0", thai: "ศูนย์", roman: "sǔun", zh: "零" },
  { thaiNum: "๑", arabNum: "1", thai: "หนึ่ง", roman: "nʉ̀ŋ", zh: "一" },
  { thaiNum: "๒", arabNum: "2", thai: "สอง", roman: "sɔ̌ɔŋ", zh: "二" },
  { thaiNum: "๓", arabNum: "3", thai: "สาม", roman: "sǎam", zh: "三" },
  { thaiNum: "๔", arabNum: "4", thai: "สี่", roman: "sìi", zh: "四" },
  { thaiNum: "๕", arabNum: "5", thai: "ห้า", roman: "hâa", zh: "五" },
  { thaiNum: "๖", arabNum: "6", thai: "หก", roman: "hòk", zh: "六" },
  { thaiNum: "๗", arabNum: "7", thai: "เจ็ด", roman: "jèt", zh: "七" },
  { thaiNum: "๘", arabNum: "8", thai: "แปด", roman: "pɛ̀ɛt", zh: "八" },
  { thaiNum: "๙", arabNum: "9", thai: "เก้า", roman: "kâao", zh: "九" },
  { thaiNum: "๑๐", arabNum: "10", thai: "สิบ", roman: "sìp", zh: "十" },
  { thaiNum: "๑๐๐", arabNum: "100", thai: "ร้อย", roman: "rɔ́ɔi", zh: "百" },
  { thaiNum: "๑,๐๐๐", arabNum: "1000", thai: "พัน", roman: "phan", zh: "千" }
];

// --- Categorized Situational Phrases ---
const CATEGORIZED_PHRASES = [
  {
    category: "✈️ 旅遊交通",
    items: [
      { thai: "สนามบินอยู่ที่ไหน", roman: "sa-nǎam-bin yùu tîi-nǎi", zh: "機場在哪裡？", en: "Where is the airport?" },
      { thai: "ไปสยามพารากอนครับ", roman: "pai sa-yǎam phaa-raa-kon kráp", zh: "請帶我去 Siam Paragon", en: "Take me to Siam Paragon" },
      { thai: "เปิดมิเตอร์ด้วยครับ", roman: "pə̀ət mi-tə̂ə dûai kráp", zh: "請跳錶計費（計程車）", en: "Please turn on the meter" },
      { thai: "จอดที่นี่ครับ", roman: "jɔ̀ɔt tîi-nîi kráp", zh: "請在這裡停靠", en: "Stop here please" }
    ]
  },
  {
    category: "🍽️ 餐飲夜生活",
    items: [
      { thai: "ขอเมนูหน่อยครับ", roman: "khɔ̌ɔ mee-nuu nɔ̀ɔi kráp", zh: "請給我菜單", en: "May I have the menu?" },
      { thai: "ไม่เผ็ดครับ", roman: "mâi phet kráp", zh: "不要辣", en: "Not spicy" },
      { thai: "เผ็ดนิดหน่อย", roman: "phet nít-nɔ̀ɔi", zh: "微辣", en: "A little spicy" },
      { thai: "ชนแก้ว!", roman: "chon kɛ̂ɛw!", zh: "乾杯！", en: "Cheers!" },
      { thai: "ขอเบียร์เพิ่มอีกขวด", roman: "khɔ̌ɔ bia pə̂əm ìik khùat", zh: "請再加一瓶啤酒", en: "One more beer please" }
    ]
  },
  {
    category: "🛍️ 購物議價",
    items: [
      { thai: "ลดอีกนิดได้ไหม", roman: "lót ìik nít dâi mái", zh: "能再便宜一點點嗎？", en: "Can you discount a bit more?" },
      { thai: "มีไซส์อื่นไหม", roman: "mee saai ʉ̀ʉn mái", zh: "有別的尺寸嗎？", en: "Do you have another size?" },
      { thai: "สแกนจ่ายได้ไหม", roman: "sa-kaen jàai dâi mái", zh: "可以掃碼支付嗎？", en: "Can I pay via QR code?" },
      { thai: "แพงเกินไปแล้ว", roman: "phaeng kəən pai lɛ́ɛw", zh: "太貴了啦！", en: "Too expensive!" }
    ]
  },
  {
    category: "💼 商務工作",
    items: [
      { thai: "ยินดีที่ได้ร่วมงานครับ", roman: "yin-dee tîi dâi rûam-ngaani kráp", zh: "很高興能與您合作", en: "Pleased to work with you" },
      { thai: "ขอโบรชัวร์หน่อยครับ", roman: "khɔ̌ɔ broh-chua nɔ̀ɔi kráp", zh: "請給我一份簡介小冊子", en: "May I have a brochure?" },
      { thai: "ขอคอนแทคหน่อยครับ", roman: "khɔ̌ɔ khɔn-thɛ́k nɔ̀ɔi kráp", zh: "方便留個聯絡方式嗎？", en: "May I have your contact info?" }
    ]
  },
  {
    category: "🤝 社交交友",
    items: [
      { thai: "คุณชื่ออะไรครับ", roman: "khun chʉ̂ʉ a-rai kráp", zh: "你叫什麼名字？", en: "What is your name?" },
      { thai: "คุณมาจากไหน", roman: "khun maa tàak nǎi", zh: "你來自哪裡？", en: "Where are you from?" },
      { thai: "ขอไลน์ / IG หน่อยได้ไหม", roman: "khɔ̌ɔ line / IG nɔ̀ɔi dâi mái", zh: "可以加你的 Line / IG 嗎？", en: "Can I have your Line / IG?" },
      { thai: "คุณน่ารักมาก", roman: "khun naa-rak mâak", zh: "你非常可愛/迷人", en: "You are very cute" }
    ]
  }
];

// --- 5 Tones Data ---
const TONE_GUIDES = [
  { name: "Mid Tone (平聲)", mark: "無標記 (maa)", pitch: "33 中平", desc: "發音平穩，音高維持在中音域域，類似中文第一聲但稍微平淡。", sample: "มา (來)" },
  { name: "Low Tone (低聲)", mark: "̀  (màa)", pitch: "21 低降", desc: "低沉平緩，從低音稍微往下沉，類似中文輕聲或發嗯音。", sample: "ม่า (麻)" },
  { name: "Falling Tone (落聲/降聲)", mark: "̂  (mâa)", pitch: "51 高降", desc: "從最高音急促滑落至低音，情感強烈，類似中文第四聲 (去聲)。", sample: "ม้า (馬)" },
  { name: "High Tone (高聲)", mark: "́  (máa)", pitch: "45 高升", desc: "高亢響亮，維持高音域稍微上揚，類似驚嘆或疑問的高音。", sample: "ค้า (買賣)" },
  { name: "Rising Tone (升聲)", mark: "̌  (mǎa)", pitch: "14 低升", desc: "從低音向上轉折轉高，類似中文第二聲 (疑問句的的「什麼？」)。", sample: "หมา (狗)" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('translator'); // translator, alphabet, phrases, tones, saved
  const [inputText, setInputText] = useState('สวัสดีครับ');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Saved Notes & Vocab State
  const [savedItems, setSavedItems] = useState([]);
  const [filterType, setFilterType] = useState('all'); // all, sentence, word
  const [selectedTag, setSelectedTag] = useState('全部');
  const [noteRemarkInput, setNoteRemarkInput] = useState('');
  const [noteTagInput, setNoteTagInput] = useState('日常');

  // Alphabet Tab State
  const [alphaCategory, setAlphaCategory] = useState('consonants'); // consonants, vowels, numbers
  const [consonantFilter, setConsonantFilter] = useState('all'); // all, 中輔音, 高輔音, 低輔音

  // Load Saved Notes from LocalStorage on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('thai_easy_saved_notes');
      if (stored) setSavedItems(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load saved notes", e);
    }
  }, []);

  // Sync Saved Items to LocalStorage
  const updateSavedItems = (newItems) => {
    setSavedItems(newItems);
    try {
      localStorage.setItem('thai_easy_saved_notes', JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Instant Search Engine
  useEffect(() => {
    if (!inputText.trim()) {
      setAnalysisResult(null);
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = inputText.trim();
      const match = DICTIONARY_DATABASE.find(item => 
        item.thai.includes(trimmed) || 
        item.zh.includes(trimmed) || 
        item.en.toLowerCase().includes(trimmed.toLowerCase()) ||
        item.roman.toLowerCase().includes(trimmed.toLowerCase())
      );

      if (match) {
        setAnalysisResult(match);
      } else {
        // Fallback generator for unmapped words
        setAnalysisResult({
          thai: trimmed,
          roman: "sà-wàt-dee (演示標記)",
          zh: `「${trimmed}」即時翻譯分析`,
          en: `Analysis for "${trimmed}"`,
          words: [
            { thai: trimmed, roman: "phâa-sǎa-thai", tone: "Mid - High", pos: "詞組", zh: trimmed, en: trimmed }
          ]
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText]);

  // Web Speech API - Text to Speech
  const speakText = (text, rate = speechRate) => {
    if (!('speechSynthesis' in window)) {
      showToast('您的瀏覽器不支援發音功能');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('您的瀏覽器不支援語音輸入功能');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'th-TH';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      showToast('語音辨識成功！');
    };

    recognition.start();
  };

  // Clipboard Paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        showToast('已從剪貼簿貼上');
      }
    } catch (err) {
      showToast('無法讀取剪貼簿權限');
    }
  };

  // Bookmark Toggle for Entire Sentence
  const toggleSaveSentence = () => {
    if (!analysisResult) return;
    const existingIndex = savedItems.findIndex(i => i.type === 'sentence' && i.thai === analysisResult.thai);

    if (existingIndex >= 0) {
      const updated = savedItems.filter((_, idx) => idx !== existingIndex);
      updateSavedItems(updated);
      showToast('已從筆記庫移除句子');
    } else {
      const newItem = {
        id: Date.now(),
        type: 'sentence',
        thai: analysisResult.thai,
        roman: analysisResult.roman,
        zh: analysisResult.zh,
        en: analysisResult.en,
        tag: noteTagInput || '日常',
        remark: noteRemarkInput,
        createdAt: new Date().toLocaleDateString()
      };
      updateSavedItems([newItem, ...savedItems]);
      setNoteRemarkInput('');
      showToast('已將句子儲存至筆記庫');
    }
  };

  // Bookmark Toggle for Individual Breakdown Word
  const toggleSaveWord = (word) => {
    const existingIndex = savedItems.findIndex(i => i.type === 'word' && i.thai === word.thai);

    if (existingIndex >= 0) {
      const updated = savedItems.filter((_, idx) => idx !== existingIndex);
      updateSavedItems(updated);
      showToast(`已移除單字「${word.thai}」`);
    } else {
      const newItem = {
        id: Date.now(),
        type: 'word',
        thai: word.thai,
        roman: word.roman,
        zh: word.zh,
        en: word.en,
        tone: word.tone,
        pos: word.pos,
        tag: '單字庫',
        remark: '',
        createdAt: new Date().toLocaleDateString()
      };
      updateSavedItems([newItem, ...savedItems]);
      showToast(`已收藏單字「${word.thai}」`);
    }
  };

  const isWordSaved = (wordThai) => savedItems.some(i => i.type === 'word' && i.thai === wordThai);
  const isSentenceSaved = () => analysisResult && savedItems.some(i => i.type === 'sentence' && i.thai === analysisResult.thai);

  // Copy plain text
  const copyToClipboard = (text, idx = 0) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    showToast('已複製到剪貼簿');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Export Notes
  const exportNotes = () => {
    const text = savedItems.map((item, index) => (
      `${index + 1}. [${item.type === 'word' ? '單字' : '句子'}] ${item.thai}\n羅馬拼音: ${item.roman}\n翻譯: ${item.zh}\n標籤: ${item.tag} | 備註: ${item.remark || '無'}\n-----------------------------`
    )).join('\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Thai_Easy_Saved_Notes_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    showToast('已匯出筆記檔案 (.txt)');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/10">
              泰
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Thai Easy
                <span className="text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  成人專屬版
                </span>
              </h1>
              <p className="text-xs text-slate-400">即時三語解釋 · 聲調拆解 · 獨立單字收藏</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            已收藏 <span className="text-amber-400 font-bold">{savedItems.length}</span> 項筆記
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-800">
          {[
            { id: 'translator', label: '即時翻譯', icon: Search },
            { id: 'alphabet', label: '字母學習', icon: BookOpen },
            { id: 'phrases', label: '實用短句', icon: MessageSquare },
            { id: 'tones', label: '聲調圖解', icon: Music },
            { id: 'saved', label: `標記筆記 (${savedItems.length})`, icon: Bookmark },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  active 
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/10' 
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: INSTANT TRANSLATOR */}
        {activeTab === 'translator' && (
          <div className="space-y-6">
            
            {/* Input Control Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  輸入泰文 / 中文 / 英文即時分析
                </span>
                <span className="text-slate-500">{inputText.length} 字</span>
              </div>

              {/* Text Area */}
              <div className="relative mb-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="請在此輸入泰文句型、單字或中文..."
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-slate-100 text-lg placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors resize-none font-sans"
                />
                {inputText && (
                  <button 
                    onClick={() => setInputText('')}
                    className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 bg-slate-800 rounded-full"
                    title="清除文字"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  {/* Translate/Analyze Button */}
                  <button
                    onClick={() => speakText(inputText)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    <span>即時分析</span>
                  </button>

                  {/* Paste Button */}
                  <button
                    onClick={handlePaste}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>貼上</span>
                  </button>

                  {/* Clear Button */}
                  <button
                    onClick={() => setInputText('')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    清除
                  </button>
                </div>

                {/* Voice Input & TTS Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleListening}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border transition-all ${
                      isListening 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-amber-400" />}
                    <span>{isListening ? '聆聽中...' : '語音輸入'}</span>
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                    {[0.5, 0.75, 1.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setSpeechRate(rate)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                          speechRate === rate 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Translation & Analysis Output Box */}
            {analysisResult ? (
              <div className="space-y-6">
                
                {/* Main Sentence Result Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          泰文原文
                        </span>
                        <span className="text-xs text-slate-400">Paiboon 羅馬拼音標示</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide my-2">
                        {analysisResult.thai}
                      </h2>
                      <p className="text-amber-300 font-mono text-lg font-medium">
                        {analysisResult.roman}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => speakText(analysisResult.thai)}
                        disabled={isSpeaking}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 p-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-amber-400/10 transition-all active:scale-95"
                        title="朗讀整句"
                      >
                        <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                        <span>播放發音</span>
                      </button>

                      <button
                        onClick={toggleSaveSentence}
                        className={`p-3 rounded-2xl border transition-all ${
                          isSentenceSaved()
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="收藏句子"
                      >
                        {isSentenceSaved() ? <BookmarkCheck className="w-5 h-5 text-amber-400" /> : <Bookmark className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={() => copyToClipboard(analysisResult.thai, 'main')}
                        className="p-3 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-colors"
                        title="複製泰文"
                      >
                        {copiedIndex === 'main' ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                    <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                      <span className="text-xs font-bold text-slate-500 uppercase block mb-1">繁體中文翻譯</span>
                      <p className="text-slate-100 font-semibold text-base">{analysisResult.zh}</p>
                    </div>
                    <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                      <span className="text-xs font-bold text-slate-500 uppercase block mb-1">English Translation</span>
                      <p className="text-slate-200 font-medium text-base">{analysisResult.en}</p>
                    </div>
                  </div>

                  {/* Custom Remark Box for Sentence Saving */}
                  <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="新增此句的個人筆記/備註（例如：曼谷展會用語）..."
                      value={noteRemarkInput}
                      onChange={(e) => setNoteRemarkInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                    <select
                      value={noteTagInput}
                      onChange={(e) => setNoteTagInput(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="日常">日常</option>
                      <option value="商務">商務</option>
                      <option value="旅遊">旅遊</option>
                      <option value="夜生活">夜生活</option>
                      <option value="交友">交友</option>
                    </select>
                  </div>
                </div>

                {/* WORD BREAKDOWN SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>Word-by-Word Breakdown 逐字拆解與聲調標記</span>
                    </h3>
                    <span className="text-xs text-slate-400">點擊單字可單獨發音或收藏</span>
                  </div>

                  {/* Word Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {analysisResult.words.map((word, idx) => {
                      const saved = isWordSaved(word.thai);
                      return (
                        <div 
                          key={idx}
                          className={`bg-slate-900 border rounded-2xl p-4 transition-all relative group ${
                            saved ? 'border-amber-400/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-2xl font-black text-amber-300 block">{word.thai}</span>
                              <span className="text-xs font-mono text-slate-400">{word.roman}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Single Word TTS */}
                              <button
                                onClick={() => speakText(word.thai)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                                title="發音"
                              >
                                <Volume2 className="w-4 h-4 text-amber-400" />
                              </button>

                              {/* Single Word Bookmark Button */}
                              <button
                                onClick={() => toggleSaveWord(word)}
                                className={`p-2 rounded-xl border transition-all ${
                                  saved 
                                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                                }`}
                                title={saved ? "已收藏單字" : "收藏單字"}
                              >
                                {saved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 mt-3 pt-2 border-t border-slate-800/80 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>聲調 Pitch:</span>
                              <span className="text-amber-400 font-medium">{word.tone}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>詞性 POS:</span>
                              <span className="text-slate-300">{word.pos}</span>
                            </div>
                            <div className="flex justify-between text-slate-300 font-medium pt-1">
                              <span>中文: {word.zh}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : null}

          </div>
        )}

        {/* TAB 2: ALPHABET & NUMBERS */}
        {activeTab === 'alphabet' && (
          <div className="space-y-6">
            
            {/* Category Selector */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              {[
                { id: 'consonants', label: '44 個輔音 (Consonants)' },
                { id: 'vowels', label: '主要元音 (Vowels)' },
                { id: 'numbers', label: '泰文數字 (Numbers)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setAlphaCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    alphaCategory === cat.id 
                      ? 'bg-amber-400 text-slate-950 shadow-md' 
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Consonants Sub-filter */}
            {alphaCategory === 'consonants' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-slate-400">聲類類別過濾：</span>
                  {['all', '中輔音', '高輔音', '低輔音'].map(f => (
                    <button
                      key={f}
                      onClick={() => setConsonantFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        consonantFilter === f 
                          ? 'bg-slate-200 text-slate-950' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {f === 'all' ? '全部顯示' : f}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {CONSONANTS.filter(c => consonantFilter === 'all' || c.class === consonantFilter).map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => speakText(item.char)}
                      className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-4 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-black text-amber-300 group-hover:scale-110 transition-transform">{item.char}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {item.class}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-200 mb-1">{item.name}</p>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <p>首音: <span className="text-slate-200">{item.init}</span> | 尾音: <span className="text-slate-200">{item.final}</span></p>
                        <p>字義: {item.mean}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vowels */}
            {alphaCategory === 'vowels' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {VOWELS.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => speakText(item.example)}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-4 transition-all cursor-pointer"
                  >
                    <span className="text-2xl font-bold text-amber-300 block mb-1">{item.char}</span>
                    <p className="text-xs font-bold text-slate-200">{item.name}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <p>類型: {item.type}</p>
                      <p>例字: <span className="text-amber-400 font-bold">{item.example}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Numbers */}
            {alphaCategory === 'numbers' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {NUMBERS.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => speakText(item.thai)}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-3xl font-black text-amber-300 block">{item.thaiNum}</span>
                      <span className="text-xs text-slate-400 font-mono">{item.roman}</span>
                      <p className="text-sm font-bold text-slate-200 mt-1">{item.thai} ({item.zh})</p>
                    </div>
                    <span className="text-2xl font-black text-slate-700">{item.arabNum}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CATEGORIZED PHRASES */}
        {activeTab === 'phrases' && (
          <div className="space-y-8">
            {CATEGORIZED_PHRASES.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <span>{sec.category}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {sec.items.map((phrase, pIdx) => (
                    <div 
                      key={pIdx}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-xl font-bold text-white mb-1">{phrase.thai}</h4>
                          <button
                            onClick={() => speakText(phrase.thai)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl"
                            title="播放發音"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-mono text-amber-300 mb-2">{phrase.roman}</p>
                        <p className="text-sm text-slate-200 font-medium">{phrase.zh}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            setInputText(phrase.thai);
                            setActiveTab('translator');
                          }}
                          className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>載入即時分析</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            const newItem = {
                              id: Date.now(),
                              type: 'sentence',
                              thai: phrase.thai,
                              roman: phrase.roman,
                              zh: phrase.zh,
                              en: phrase.en,
                              tag: sec.category.replace(/[^\u4e00-\u9fa5]/g, ''),
                              remark: '從常用短句載入',
                              createdAt: new Date().toLocaleDateString()
                            };
                            updateSavedItems([newItem, ...savedItems]);
                            showToast('已收藏短句！');
                          }}
                          className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>收藏</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: TONE DIAGRAMS */}
        {activeTab === 'tones' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-xl font-black text-white mb-2">泰語五大聲調音高走向圖 (Pitch Contour Diagram)</h3>
              <p className="text-xs text-slate-400 mb-6">泰語是聲調語言，相同的輔音與元音若聲調不同，意思完全不同。</p>

              {/* Tone Guides List */}
              <div className="space-y-4">
                {TONE_GUIDES.map((tone, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-amber-300">{tone.name}</span>
                        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {tone.pitch}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{tone.desc}</p>
                      <p className="text-xs text-slate-500">拼音符號標記: <span className="text-amber-400 font-mono">{tone.mark}</span></p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-black text-white block">{tone.sample.split(' ')[0]}</span>
                        <span className="text-xs text-slate-400">{tone.sample.split(' ')[1]}</span>
                      </div>
                      <button
                        onClick={() => speakText(tone.sample.split(' ')[0])}
                        className="p-3 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold rounded-2xl shadow-md transition-all"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SAVED NOTES & VOCAB LIBRARY */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-amber-400" />
                  <span>標記筆記與單字庫 ({savedItems.length})</span>
                </h3>
                <p className="text-xs text-slate-400">已儲存的句子與單字均保存在您的本機裝置中</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Export Button */}
                <button
                  onClick={exportNotes}
                  disabled={savedItems.length === 0}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>匯出 .txt 筆記</span>
                </button>

                {/* Filter Tabs */}
                <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs font-bold">
                  {[
                    { id: 'all', label: '全部' },
                    { id: 'sentence', label: '句子' },
                    { id: 'word', label: '單字' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilterType(f.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        filterType === f.id 
                          ? 'bg-amber-400 text-slate-950' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Saved Items List */}
            {savedItems.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <Folder className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-medium">尚未標記任何句子或單字</p>
                <p className="text-slate-600 text-xs mt-1">在翻譯結果中點擊 🔖 按鈕即可儲存至此處</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedItems
                  .filter(item => filterType === 'all' || item.type === filterType)
                  .map((item) => (
                    <div 
                      key={item.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.type === 'word' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}>
                              {item.type === 'word' ? '單字' : '句子'}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">{item.createdAt}</span>
                          </div>

                          <button
                            onClick={() => {
                              const updated = savedItems.filter(i => i.id !== item.id);
                              updateSavedItems(updated);
                              showToast('已刪除筆記');
                            }}
                            className="text-slate-600 hover:text-rose-400 p-1"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="text-2xl font-black text-white my-1">{item.thai}</h4>
                        <p className="text-xs font-mono text-amber-300 mb-2">{item.roman}</p>
                        <p className="text-sm text-slate-200 font-semibold mb-1">{item.zh}</p>
                        {item.en && <p className="text-xs text-slate-400">{item.en}</p>}
                        
                        {item.remark && (
                          <div className="mt-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                            <span className="text-amber-400 font-bold">備註: </span>{item.remark}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => speakText(item.thai)}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>發音</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(item.thai, item.id)}
                          className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>複製</span>
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-semibold text-slate-400 mb-1">Thai Easy — 成人泰語即時學習與翻譯助手</p>
          <p>支援三語解釋 · 聲調符號標記 · Web Speech 語音發音 engine</p>
        </div>
      </footer>

    </div>
  );
}
