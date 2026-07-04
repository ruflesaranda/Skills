/**
 * Business Analyzer Skill
 * Analiza y clasifica características de negocios
 */

class BusinessAnalyzer {
  constructor() {
    this.businessTypes = [
      'retail',
      'service',
      'technology',
      'food_beverage',
      'healthcare',
      'education',
      'finance',
      'real_estate',
      'tourism',
      'manufacturing'
    ];
    
    this.industryKeywords = {
      retail: ['tienda', 'shop', 'venta', 'products', 'comercio'],
      service: ['servicio', 'consultoría', 'asesoría', 'support', 'atención'],
      technology: ['software', 'tech', 'digital', 'app', 'sistema'],
      food_beverage: ['comida', 'restaurante', 'café', 'bebida', 'food'],
      healthcare: ['salud', 'médico', 'hospital', 'clínica', 'health'],
      education: ['educación', 'curso', 'enseñanza', 'training', 'learning'],
      finance: ['finanzas', 'banco', 'inversión', 'crédito', 'finance'],
      real_estate: ['inmuebles', 'propiedad', 'vivienda', 'real estate', 'arrendamiento'],
      tourism: ['turismo', 'hotel', 'viaje', 'tour', 'hospedaje'],
      manufacturing: ['manufactura', 'producción', 'fábrica', 'industry', 'factory']
    };
  }

  /**
   * Analiza un negocio
   * @param {object} businessData - Datos del negocio
   * @returns {object} Análisis completo
   */
  analyze(businessData) {
    const classification = this.classifyBusiness(businessData);
    const characteristics = this.extractCharacteristics(businessData);
    const opportunities = this.identifyOpportunities(classification, characteristics);
    
    return {
      classification,
      characteristics,
      opportunities,
      timestamp: new Date().toISOString(),
      confidence: this.calculateConfidence(businessData)
    };
  }

  /**
   * Clasifica el tipo de negocio
   * @param {object} businessData - Datos del negocio
   * @returns {object} Clasificación
   */
  classifyBusiness(businessData) {
    const { business_type, business_name, description = '' } = businessData;
    const text = `${business_name} ${business_type} ${description}`.toLowerCase();
    
    const scores = {};
    for (const [type, keywords] of Object.entries(this.industryKeywords)) {
      scores[type] = keywords.filter(k => text.includes(k)).length;
    }
    
    const topType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || business_type;
    
    return {
      primary_type: topType,
      specified_type: business_type,
      confidence: scores[topType] / (Object.keys(this.industryKeywords[topType] || []).length || 1)
    };
  }

  /**
   * Extrae características del negocio
   * @param {object} businessData - Datos del negocio
   * @returns {array} Características extraídas
   */
  extractCharacteristics(businessData) {
    const characteristics = [];
    
    if (businessData.size) characteristics.push({ type: 'size', value: businessData.size });
    if (businessData.location) characteristics.push({ type: 'location', value: businessData.location });
    if (businessData.employees) characteristics.push({ type: 'employees', value: businessData.employees });
    if (businessData.founded) characteristics.push({ type: 'age', value: businessData.founded });
    if (businessData.revenue) characteristics.push({ type: 'revenue', value: businessData.revenue });
    
    return characteristics;
  }

  /**
   * Identifica oportunidades de mejora
   * @param {object} classification - Clasificación
   * @param {array} characteristics - Características
   * @returns {array} Oportunidades
   */
  identifyOpportunities(classification, characteristics) {
    const opportunities = [];
    const businessType = classification.primary_type;
    
    const typeOpportunities = {
      retail: ['Digital presence', 'E-commerce integration', 'Customer loyalty program'],
      service: ['Service automation', 'Client management system', 'Online booking'],
      technology: ['Cloud migration', 'API integration', 'Scalability improvement'],
      food_beverage: ['Menu optimization', 'Delivery integration', 'Loyalty rewards'],
      healthcare: ['Telemedicine', 'Patient records digitization', 'Appointment system'],
      education: ['Online courses', 'Learning management system', 'Student engagement tools'],
      finance: ['Fintech integration', 'Risk management', 'Customer analytics'],
      real_estate: ['Virtual tours', 'CRM system', 'Lead management'],
      tourism: ['Booking system', 'Customer reviews management', 'Multi-language support'],
      manufacturing: ['Supply chain optimization', 'Quality management', 'Production analytics']
    };
    
    return typeOpportunities[businessType] || [];
  }

  /**
   * Calcula nivel de confianza del análisis
   * @param {object} businessData - Datos del negocio
   * @returns {number} Confianza (0-1)
   */
  calculateConfidence(businessData) {
    let score = 0;
    const fields = ['business_name', 'business_type', 'location', 'size', 'description'];
    
    fields.forEach(field => {
      if (businessData[field]) score += 0.2;
    });
    
    return Math.min(score, 1);
  }
}

module.exports = BusinessAnalyzer;
