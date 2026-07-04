/**
 * Data Processing Skill
 * Normalización, validación y limpieza de datos
 */

class DataProcessor {
  constructor() {
    this.validationRules = {
      business_name: { type: 'string', minLength: 2, maxLength: 100 },
      business_type: { type: 'string', enum: ['retail', 'service', 'technology', 'food_beverage', 'healthcare', 'education', 'finance', 'real_estate', 'tourism', 'manufacturing'] },
      location: { type: 'string', minLength: 2, maxLength: 100 },
      size: { type: 'string', enum: ['pequeño', 'mediano', 'grande', 'small', 'medium', 'large'] },
      employees: { type: 'number', min: 1, max: 10000 },
      revenue: { type: 'number', min: 0 },
      phone_number: { type: 'string', pattern: /^\+?[1-9]\d{1,14}$/ },
      email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    };
    
    this.normalizations = {
      size: {
        'pequeño': 'small',
        'pequeño': 'small',
        'sm': 'small',
        's': 'small',
        'mediano': 'medium',
        'mediana': 'medium',
        'md': 'medium',
        'm': 'medium',
        'grande': 'large',
        'lg': 'large',
        'l': 'large'
      },
      business_type: {
        'tienda': 'retail',
        'comercio': 'retail',
        'shop': 'retail',
        'consultoría': 'service',
        'consulting': 'service',
        'software': 'technology',
        'tech': 'technology',
        'comida': 'food_beverage',
        'restaurante': 'food_beverage',
        'salud': 'healthcare',
        'hospital': 'healthcare',
        'educación': 'education',
        'training': 'education',
        'finanzas': 'finance',
        'bank': 'finance',
        'inmuebles': 'real_estate',
        'property': 'real_estate',
        'turismo': 'tourism',
        'hotel': 'tourism',
        'fabrica': 'manufacturing',
        'factory': 'manufacturing'
      }
    };
  }

  /**
   * Procesa y normaliza datos
   * @param {object} rawData - Datos crudos
   * @param {object} schema - Esquema de validación
   * @param {boolean} strictMode - Modo estricto
   * @returns {object} Datos procesados
   */
  process(rawData, schema = null, strictMode = false) {
    const validationReport = {};
    const processedData = {};
    const errors = [];
    const warnings = [];

    // Validar y procesar cada campo
    for (const [key, value] of Object.entries(rawData)) {
      const rule = schema?.[key] || this.validationRules[key];
      
      if (!rule) {
        warnings.push(`Campo desconocido: ${key}`);
        continue;
      }

      const validation = this.validateField(key, value, rule);
      
      if (!validation.valid) {
        errors.push(validation.error);
        if (strictMode) continue;
      }

      processedData[key] = this.normalizeField(key, value);
      validationReport[key] = validation;
    }

    if (strictMode && errors.length > 0) {
      throw new Error(`Validación fallida: ${errors.join(', ')}`);
    }

    return {
      processed_data: processedData,
      validation_report: {
        total_fields: Object.keys(rawData).length,
        valid_fields: Object.keys(processedData).length,
        errors,
        warnings,
        strict_mode: strictMode
      },
      quality_score: this.calculateQualityScore(rawData, processedData, errors)
    };
  }

  /**
   * Valida un campo individual
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Valor a validar
   * @param {object} rule - Regla de validación
   * @returns {object} Resultado de validación
   */
  validateField(fieldName, value, rule) {
    // Validar tipo
    if (rule.type) {
      const actualType = typeof value;
      if (actualType !== rule.type && !(rule.type === 'number' && !isNaN(value))) {
        return {
          valid: false,
          error: `${fieldName}: tipo esperado ${rule.type}, recibido ${actualType}`
        };
      }
    }

    // Validar enum
    if (rule.enum && !rule.enum.includes(value)) {
      return {
        valid: false,
        error: `${fieldName}: valor debe ser uno de [${rule.enum.join(', ')}]`
      };
    }

    // Validar longitud de string
    if (rule.minLength && value.length < rule.minLength) {
      return {
        valid: false,
        error: `${fieldName}: longitud ménima ${rule.minLength}`
      };
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return {
        valid: false,
        error: `${fieldName}: longitud máxima ${rule.maxLength}`
      };
    }

    // Validar rango de número
    if (rule.min !== undefined && value < rule.min) {
      return {
        valid: false,
        error: `${fieldName}: valor mínimo ${rule.min}`
      };
    }
    if (rule.max !== undefined && value > rule.max) {
      return {
        valid: false,
        error: `${fieldName}: valor máximo ${rule.max}`
      };
    }

    // Validar patrón regex
    if (rule.pattern && !rule.pattern.test(value)) {
      return {
        valid: false,
        error: `${fieldName}: formato inválido`
      };
    }

    return { valid: true };
  }

  /**
   * Normaliza un campo
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Valor a normalizar
   * @returns {any} Valor normalizado
   */
  normalizeField(fieldName, value) {
    // Convertir strings a minúscula
    if (typeof value === 'string') {
      value = value.trim().toLowerCase();
    }

    // Aplicar normalización especística del campo
    if (this.normalizations[fieldName] && this.normalizations[fieldName][value]) {
      return this.normalizations[fieldName][value];
    }

    // Normalizar números de teléfono
    if (fieldName === 'phone_number') {
      return this.normalizePhoneNumber(value);
    }

    // Normalizar correos electrónicos
    if (fieldName === 'email') {
      return value.toLowerCase();
    }

    return value;
  }

  /**
   * Normaliza números de teléfono
   * @param {string} phoneNumber - Número de teléfono
   * @returns {string} Número normalizado
   */
  normalizePhoneNumber(phoneNumber) {
    // Eliminar espacios y caracteres especiales
    let normalized = phoneNumber.replace(/[^\d+]/g, '');
    
    // Añadir + si no lo tiene
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }
    
    return normalized;
  }

  /**
   * Calcula puntuación de calidad de datos
   * @param {object} rawData - Datos crudos
   * @param {object} processedData - Datos procesados
   * @param {array} errors - Errores encontrados
   * @returns {number} Puntuación de calidad (0-100)
   */
  calculateQualityScore(rawData, processedData, errors) {
    const totalFields = Object.keys(rawData).length;
    const validFields = Object.keys(processedData).length;
    const errorCount = errors.length;
    
    // Cálculo: 60% por campos válidos + 40% por ausencia de errores
    const validFieldsScore = (validFields / totalFields) * 60;
    const errorScore = Math.max(0, 40 - (errorCount * 5));
    
    return Math.round(validFieldsScore + errorScore);
  }

  /**
   * Detecta anomalías en datos
   * @param {object} data - Datos a analizar
   * @returns {array} Lista de anomalías detectadas
   */
  detectAnomalies(data) {
    const anomalies = [];
    
    // Anomalía: número de empleados muy alto sin ingresos
    if (data.employees && data.employees > 100 && (!data.revenue || data.revenue === 0)) {
      anomalies.push('Muchos empleados pero sin ingresos reportados');
    }
    
    // Anomalía: nombre de negocio muy corto
    if (data.business_name && data.business_name.length < 3) {
      anomalies.push('Nombre de negocio muy corto');
    }
    
    // Anomalía: tipo de negocio no reconocido
    if (data.business_type && !this.validationRules.business_type.enum.includes(data.business_type)) {
      anomalies.push('Tipo de negocio no reconocido');
    }
    
    return anomalies;
  }

  /**
   * Enriquece datos con información adicional
   * @param {object} data - Datos a enriquecer
   * @returns {object} Datos enriquecidos
   */
  enrichData(data) {
    const enriched = { ...data };
    
    // Añadir timestamp
    enriched.processed_at = new Date().toISOString();
    
    // Añadir código de país del teléfono
    if (enriched.phone_number) {
      enriched.country_code = this.extractCountryCode(enriched.phone_number);
    }
    
    // Añadir dominio de correo
    if (enriched.email) {
      enriched.email_domain = enriched.email.split('@')[1];
    }
    
    // Añadir rango de tamaño estimado si hay empleados
    if (enriched.employees) {
      enriched.size_category = this.estimateSizeCategory(enriched.employees);
    }
    
    return enriched;
  }

  /**
   * Extrae código de país del teléfono
   * @param {string} phoneNumber - Número de teléfono
   * @returns {string} Código de país
   */
  extractCountryCode(phoneNumber) {
    const match = phoneNumber.match(/^\+(\d{1,3})/);
    return match ? match[1] : null;
  }

  /**
   * Estima categoría de tamaño
   * @param {number} employees - Número de empleados
   * @returns {string} Categoría de tamaño
   */
  estimateSizeCategory(employees) {
    if (employees <= 10) return 'small';
    if (employees <= 50) return 'medium';
    if (employees <= 250) return 'large';
    return 'enterprise';
  }
}

module.exports = DataProcessor;
