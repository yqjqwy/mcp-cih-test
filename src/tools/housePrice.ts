import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface CityPriceRecord {
  currency: string; // e.g., CNY
  unit: string; // e.g., 元/平方米
  average: number; // average price per square meter
  updated_at: string; // ISO date string
  note?: string;
}

export interface PriceResult {
  city: string;
  normalizedCity: string;
  average: number;
  currency: string;
  unit: string;
  updatedAt: string;
  source: string;
  confidence: number;
  message?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadDataset(): Record<string, CityPriceRecord> {
  const dataPath = path.resolve(__dirname, '../../data/city_prices.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

const synonyms: Record<string, string> = {
  // Beijing
  'beijing': '北京',
  'bj': '北京',
  // Shanghai
  'shanghai': '上海',
  'sh': '上海',
  // Shenzhen
  'shenzhen': '深圳',
  'sz': '深圳',
  // Guangzhou
  'guangzhou': '广州',
  'gz': '广州',
  // Hangzhou
  'hangzhou': '杭州',
  'hz': '杭州',
  // Nanjing
  'nanjing': '南京',
  'nj': '南京',
  // Chengdu
  'chengdu': '成都',
  'cd': '成都',
  // Chongqing
  'chongqing': '重庆',
  'cq': '重庆',
  // Wuhan
  'wuhan': '武汉',
  'wh': '武汉',
  // Xi'an
  "xi'an": '西安',
  'xian': '西安',
  'xa': '西安',
  // Tianjin
  'tianjin': '天津',
  'tj': '天津',
  // Qingdao
  'qingdao': '青岛',
  'qd': '青岛',
  // Suzhou
  'suzhou': '苏州',
  'szs': '苏州'
};

function normalizeCityName(input: string): string {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  if (synonyms[lower]) return synonyms[lower];
  // 简单去除“市”字
  const noShi = trimmed.endsWith('市') ? trimmed.slice(0, -1) : trimmed;
  return noShi;
}

export function getAveragePrice(city: string): PriceResult {
  const dataset = loadDataset();
  const normalized = normalizeCityName(city);

  const direct = dataset[normalized];
  if (direct) {
    return {
      city,
      normalizedCity: normalized,
      average: direct.average,
      currency: direct.currency,
      unit: direct.unit,
      updatedAt: direct.updated_at,
      source: 'data/city_prices.json',
      confidence: 0.8
    };
  }

  // 兜底：尝试大小写/空格变化（中文一般不需要）
  const alt = dataset[normalized.toLowerCase()] || dataset[normalized.toUpperCase()];
  if (alt) {
    return {
      city,
      normalizedCity: normalized,
      average: alt.average,
      currency: alt.currency,
      unit: alt.unit,
      updatedAt: alt.updated_at,
      source: 'data/city_prices.json',
      confidence: 0.6,
      message: '基于模糊匹配获得结果，请核对城市名称。'
    };
  }

  return {
    city,
    normalizedCity: normalized,
    average: NaN,
    currency: 'CNY',
    unit: '元/平方米',
    updatedAt: new Date().toISOString(),
    source: 'data/city_prices.json',
    confidence: 0,
    message: '未找到该城市的均价，请补充数据或使用外部数据源。'
  };
}

export function listSupportedCities(): string[] {
  const dataset = loadDataset();
  return Object.keys(dataset);
}