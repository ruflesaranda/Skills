/**
 * Recommendation Engine Skill
 * Motor de generación de recomendaciones personalizadas
 */

class RecommendationEngine {
  constructor() {
    this.recommendationDatabase = {
      retail: {
        high_priority: [
          { id: 'r1', title: 'Presencia Digital Omnicanal', description: 'Integra tienda física con presencia online', impact: 0.95, effort: 'medium', timeframe: '3-6 meses' },
          { id: 'r2', title: 'Sistema de Gestión de Inventario', description: 'Controla stock en tiempo real', impact: 0.85, effort: 'medium', timeframe: '2-4 meses' },
          { id: 'r3', title: 'Programa de Fidelización', description: 'Retención de clientes mediante puntos y beneficios', impact: 0.75, effort: 'low', timeframe: '1-2 meses' }
        ],
        medium_priority: [
          { id: 'r4', title: 'Análisis de Datos de Ventas', description: 'Entiende patrones de compra de clientes', impact: 0.7, effort: 'low', timeframe: '1 mes' },
          { id: 'r5', title: 'Integración de Pagos Digitales', description: 'Múltiples métodos de pago', impact: 0.8, effort: 'medium', timeframe: '2-3 meses' }
        ]
      },
      service: {
        high_priority: [
          { id: 'r6', title: 'Plataforma de Gestión de Clientes', description: 'CRM especializado para servicios', impact: 0.9, effort: 'medium', timeframe: '2-3 meses' },
          { id: 'r7', title: 'Sistema de Reservas Online', description: 'Permite clientes agendar servicios 24/7', impact: 0.85, effort: 'medium', timeframe: '1-2 meses' },
          { id: 'r8', title: 'Automatización de Seguimiento', description: 'Contacto automático post-servicio', impact: 0.7, effort: 'low', timeframe: '1 mes' }
        ],
        medium_priority: [
          { id: 'r9', title: 'Portal de Servicios Online', description: 'Consulta y contratación desde web', impact: 0.75, effort: 'high', timeframe: '3-4 meses' }
        ]
      },
      technology: {
        high_priority: [
          { id: 'r10', title: 'Infraestructura en la Nube', description: 'Escalabilidad y confiabilidad mejorada', impact: 0.95, effort: 'high', timeframe: '2-3 meses' },
          { id: 'r11', title: 'CI/CD Pipeline', description: 'Automatización de despliegues', impact: 0.85, effort: 'medium', timeframe: '1-2 meses' },
          { id: 'r12', title: 'Monitoreo y Observabilidad', description: 'Visibilidad del sistema en tiempo real', impact: 0.8, effort: 'medium', timeframe: '1 mes' }
        ],
        medium_priority: [
          { id: 'r13', title: 'API Rest Modernizada', description: 'Mejorar integración con terceros', impact: 0.75, effort: 'high', timeframe: '2 meses' }
        ]
      },
      food_beverage: {
        high_priority: [
          { id: 'r14', title: 'App de Delivery Integrada', description: 'Múltiples plataformas de entrega', impact: 0.9, effort: 'medium', timeframe: '2-3 meses' },
          { id: 'r15', title: 'Gestión Digital de Menús', description: 'Menú dinámico y actualizable', impact: 0.7, effort: 'low', timeframe: '2 semanas' },
          { id: 'r16', title: 'Sistema POS Moderno', description: 'Caja registradora digital integrada', impact: 0.85, effort: 'medium', timeframe: '1-2 meses' }
        ],
        medium_priority: [
          { id: 'r17', title: 'Programa de Lealtad Digital', description: 'Tarjeta de cliente electrónica', impact: 0.65, effort: 'low', timeframe: '1 mes' }
        ]
      }
    };
    
    this.scoringFactors = {
      businessSize: { small: 0.8, medium: 0.9, large: 1.0 },
      industryAlignment: 1.2,
      urgencyFactor: 1.0
    };
  }

  /**
   * Genera recomendaciones personalizadas
   * @param {object} businessAnalysis - Análisis del negocio
   * @param {object} userPreferences - Preferencias del usuario
   * @param {number} maxRecommendations - Máximo de recomendaciones
   * @returns {object} Recomendaciones ordenadas
   */
  generate(businessAnalysis, userPreferences = {}, maxRecommendations = 5) {
    const businessType = businessAnalysis.classification.primary_type;
    const recommendations = this.getRecommendationsForType(businessType);
    
    // Calcular scores
    const scored = recommendations.map(rec => ({
      ...rec,
      score: this.calculateScore(rec, businessAnalysis, userPreferences),
      reasoning: this.generateReasoning(rec, businessAnalysis)
    }));
    
    // Ordenar por score
    const ranked = scored.sort((a, b) => b.score - a.score).slice(0, maxRecommendations);
    
    return {
      recommendations: ranked,
      reasoning: {
        business_type: businessType,
        confidence: businessAnalysis.confidence,
        methodology: 'Scoring based on business type, size, and preferences'
      },
      metrics: {
        total_recommendations: ranked.length,
        average_score: ranked.reduce((sum, r) => sum + r.score, 0) / ranked.length,
        coverage: (ranked.length / recommendations.length * 100).toFixed(2) + '%',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Obtiene recomendaciones para un tipo de negocio
   * @param {string} businessType - Tipo de negocio
   * @returns {array} Lista de recomendaciones
   */
  getRecommendationsForType(businessType) {
    const typeRecs = this.recommendationDatabase[businessType] || {};
    return [
      ...(typeRecs.high_priority || []),
      ...(typeRecs.medium_priority || [])
    ];
  }

  /**
   * Calcula score de una recomendación
   * @param {object} recommendation - Recomendación
   * @param {object} businessAnalysis - Análisis del negocio
   * @param {object} userPreferences - Preferencias del usuario
   * @returns {number} Score calculado (0-100)
   */
  calculateScore(recommendation, businessAnalysis, userPreferences) {
    let score = 50; // Base score
    
    // Factor de impacto
    score += recommendation.impact * 30;
    
    // Factor de esfuerzo (menos esfuerzo = más score)
    const effortScore = {
      low: 15,
      medium: 10,
      high: 5
    };
    score += effortScore[recommendation.effort] || 5;
    
    // Factor de análisis del negocio
    score += businessAnalysis.confidence * 10;
    
    // Factor de preferencias del usuario
    if (userPreferences.budget && userPreferences.budget === 'low') {
      score += recommendation.effort === 'low' ? 5 : -5;
    }
    if (userPreferences.speed && userPreferences.speed === 'fast') {
      const monthsMin = parseInt(recommendation.timeframe);
      score += monthsMin <= 2 ? 10 : -5;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Genera explicación de una recomendación
   * @param {object} recommendation - Recomendación
   * @param {object} businessAnalysis - Análisis del negocio
   * @returns {string} Explicación
   */
  generateReasoning(recommendation, businessAnalysis) {
    return `Esta recomendación tiene un impacto potencial de ${(recommendation.impact * 100).toFixed(0)}% para ${businessAnalysis.classification.primary_type} como el tuyo. ` +
           `Requiere esfuerzo ${recommendation.effort} y puede implementarse en ${recommendation.timeframe}.`;
  }

  /**
   * Filtra recomendaciones por criterios
   * @param {array} recommendations - Recomendaciones
   * @param {object} filters - Criterios de filtro
   * @returns {array} Recomendaciones filtradas
   */
  filterRecommendations(recommendations, filters = {}) {
    let filtered = [...recommendations];
    
    if (filters.max_effort) {
      filtered = filtered.filter(r => this.effortLevel(r.effort) <= this.effortLevel(filters.max_effort));
    }
    
    if (filters.min_impact) {
      filtered = filtered.filter(r => r.impact >= filters.min_impact);
    }
    
    if (filters.max_months) {
      filtered = filtered.filter(r => {
        const months = parseInt(r.timeframe);
        return months <= filters.max_months;
      });
    }
    
    return filtered;
  }

  /**
   * Convierte nivel de esfuerzo a número
   * @param {string} effort - Nivel de esfuerzo
   * @returns {number} Valor numérico
   */
  effortLevel(effort) {
    const levels = { low: 1, medium: 2, high: 3 };
    return levels[effort] || 2;
  }
}

module.exports = RecommendationEngine;
