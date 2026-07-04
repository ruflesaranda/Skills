/**
 * Utilities Skill
 * Funciones auxiliares y de soporte
 */

/**
 * Formateador de Textos
 */
class TextFormatter {
  static capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static toTitleCase(text) {
    return text.replace(/\w\S*/g, txt => this.capitalize(txt));
  }

  static truncate(text, length = 100, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  }

  static pluralize(word, count) {
    return count === 1 ? word : word + 's';
  }

  static formatCurrency(amount, currency = 'EUR', locale = 'es-ES') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static formatPercent(value, decimals = 2) {
    return (value * 100).toFixed(decimals) + '%';
  }
}

/**
 * Utilidades de Fechas
 */
class DateUtils {
  static now() {
    return new Date();
  }

  static format(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  static daysAgo(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static getDayName(date, locale = 'es-ES') {
    return new Date(date).toLocaleDateString(locale, { weekday: 'long' });
  }

  static getMonthName(date, locale = 'es-ES') {
    return new Date(date).toLocaleDateString(locale, { month: 'long' });
  }
}

/**
 * Calculadora de Estadísticas
 */
class Calculator {
  static sum(numbers) {
    return numbers.reduce((a, b) => a + b, 0);
  }

  static average(numbers) {
    return numbers.length > 0 ? this.sum(numbers) / numbers.length : 0;
  }

  static median(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  static max(numbers) {
    return Math.max(...numbers);
  }

  static min(numbers) {
    return Math.min(...numbers);
  }

  static standardDeviation(numbers) {
    const avg = this.average(numbers);
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    return Math.sqrt(this.average(squareDiffs));
  }

  static percentage(value, total) {
    return total > 0 ? (value / total) * 100 : 0;
  }

  static percentageChange(oldValue, newValue) {
    return oldValue > 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;
  }

  static compound(principal, rate, time) {
    return principal * Math.pow(1 + rate, time);
  }
}

/**
 * Logger
 */
class Logger {
  constructor(name = 'Logger', level = 'INFO') {
    this.name = name;
    this.level = level;
    this.levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    this.logs = [];
  }

  _log(level, message, data = null) {
    if (this.levels[level] >= this.levels[this.level]) {
      const timestamp = DateUtils.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      const logEntry = {
        timestamp,
        level,
        name: this.name,
        message,
        data,
        formatted: `[${timestamp}] [${level}] ${this.name}: ${message}${data ? ' ' + JSON.stringify(data) : ''}`
      };
      this.logs.push(logEntry);
      console.log(logEntry.formatted);
    }
  }

  debug(message, data) { this._log('DEBUG', message, data); }
  info(message, data) { this._log('INFO', message, data); }
  warn(message, data) { this._log('WARN', message, data); }
  error(message, data) { this._log('ERROR', message, data); }

  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

/**
 * Cache en Memoria
 */
class Cache {
  constructor(ttl = 3600000) { // 1 hora por defecto
    this.store = new Map();
    this.ttl = ttl;
  }

  set(key, value, ttl = this.ttl) {
    const expiry = Date.now() + ttl;
    this.store.set(key, { value, expiry });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    const item = this.store.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  size() {
    return this.store.size;
  }

  getAll() {
    const now = Date.now();
    const result = {};
    
    for (const [key, item] of this.store.entries()) {
      if (now <= item.expiry) {
        result[key] = item.value;
      } else {
        this.store.delete(key);
      }
    }
    
    return result;
  }
}

module.exports = {
  TextFormatter,
  DateUtils,
  Calculator,
  Logger,
  Cache
};
