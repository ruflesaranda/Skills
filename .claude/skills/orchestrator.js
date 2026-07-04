/**
 * Skills Orchestrator
 * Orquestador principal que integra todos los skills
 */

const BusinessAnalyzer = require('./business-analyzer/index.js');
const RecommendationEngine = require('./recommendation-engine/index.js');
const WhatsAppIntegration = require('./whatsapp-integration/index.js');
const DataProcessor = require('./data-processing/index.js');
const { Logger, Cache } = require('./utilities/index.js');

class SkillsOrchestrator {
  constructor(config = {}) {
    this.logger = new Logger('SkillsOrchestrator', 'INFO');
    this.cache = new Cache(config.cacheTTL || 3600000);
    
    this.businessAnalyzer = new BusinessAnalyzer();
    this.recommendationEngine = new RecommendationEngine();
    this.whatsappIntegration = new WhatsAppIntegration(config.whatsapp || {});
    this.dataProcessor = new DataProcessor();
    
    this.config = config;
    this.logger.info('Skills Orchestrator inicializado');
  }

  /**
   * Flujo completo: Procesar datos -> Analizar -> Recomendar -> Enviar por WhatsApp
   * @param {object} businessData - Datos del negocio
   * @param {string} phoneNumber - Número de teléfono
   * @param {object} options - Opciones adicionales
   * @returns {object} Resultado completo
   */
  async processFullFlow(businessData, phoneNumber, options = {}) {
    try {
      this.logger.info('Iniciando flujo completo', { business: businessData.business_name });

      // Fase 1: Procesar y validar datos
      this.logger.info('Fase 1: Procesando datos...');
      const dataResult = this.dataProcessor.process(businessData, null, false);
      
      if (dataResult.quality_score < 50) {
        this.logger.warn('Calidad de datos baja', { score: dataResult.quality_score });
      }
      
      const processedData = this.dataProcessor.enrichData(dataResult.processed_data);

      // Fase 2: Analizar negocio
      this.logger.info('Fase 2: Analizando negocio...');
      const analysis = this.businessAnalyzer.analyze(processedData);

      // Fase 3: Generar recomendaciones
      this.logger.info('Fase 3: Generando recomendaciones...');
      const recommendationOptions = options.preferences || {};
      const maxRecs = options.maxRecommendations || 5;
      const recommendations = this.recommendationEngine.generate(
        analysis,
        recommendationOptions,
        maxRecs
      );

      // Fase 4: Enviar por WhatsApp
      this.logger.info('Fase 4: Enviando por WhatsApp...');
      const messageType = options.messageType || 'summary';
      const deliveryResult = await this.whatsappIntegration.sendRecommendations(
        phoneNumber,
        recommendations.recommendations,
        messageType,
        processedData.business_name
      );

      // Compilar resultado final
      const result = {
        success: deliveryResult.success,
        flow_id: this.generateFlowId(),
        phases: {
          data_processing: {
            status: 'completed',
            quality_score: dataResult.quality_score,
            fields_processed: Object.keys(processedData).length
          },
          business_analysis: {
            status: 'completed',
            business_type: analysis.classification.primary_type,
            confidence: analysis.classification.confidence
          },
          recommendations: {
            status: 'completed',
            count: recommendations.recommendations.length,
            average_score: recommendations.metrics.average_score
          },
          whatsapp_delivery: {
            status: deliveryResult.success ? 'completed' : 'failed',
            message_id: deliveryResult.message_id,
            messages_sent: deliveryResult.messages_sent,
            error: deliveryResult.error
          }
        },
        data: {
          processed_business: processedData,
          analysis,
          recommendations: recommendations.recommendations.slice(0, 3), // Top 3
          delivery: deliveryResult
        },
        timestamp: new Date().toISOString()
      };

      this.logger.info('Flujo completado exitosamente', { flow_id: result.flow_id });
      return result;

    } catch (error) {
      this.logger.error('Error en flujo completo', { error: error.message });
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Procesa datos solo
   * @param {object} businessData - Datos del negocio
   * @returns {object} Datos procesados
   */
  processData(businessData) {
    this.logger.info('Procesando datos', { business: businessData.business_name });
    return this.dataProcessor.process(businessData);
  }

  /**
   * Analiza negocio solo
   * @param {object} businessData - Datos del negocio
   * @returns {object} Análisis
   */
  analyzeBusiness(businessData) {
    this.logger.info('Analizando negocio', { type: businessData.business_type });
    return this.businessAnalyzer.analyze(businessData);
  }

  /**
   * Genera recomendaciones solo
   * @param {object} analysis - Análisis del negocio
   * @param {object} preferences - Preferencias del usuario
   * @param {number} maxRecs - Máximo de recomendaciones
   * @returns {object} Recomendaciones
   */
  generateRecommendations(analysis, preferences = {}, maxRecs = 5) {
    this.logger.info('Generando recomendaciones', { businessType: analysis.classification.primary_type });
    return this.recommendationEngine.generate(analysis, preferences, maxRecs);
  }

  /**
   * Envía por WhatsApp solo
   * @param {string} phoneNumber - Número de teléfono
   * @param {array} recommendations - Recomendaciones
   * @param {string} messageType - Tipo de mensaje
   * @param {string} businessName - Nombre del negocio
   * @returns {object} Resultado de entrega
   */
  async sendViaWhatsApp(phoneNumber, recommendations, messageType = 'summary', businessName = 'tu negocio') {
    this.logger.info('Enviando por WhatsApp', { phone: phoneNumber.slice(-4) });
    return this.whatsappIntegration.sendRecommendations(
      phoneNumber,
      recommendations,
      messageType,
      businessName
    );
  }

  /**
   * Genera ID único para flujo
   * @returns {string} Flow ID
   */
  generateFlowId() {
    return `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene estado del orquestador
   * @returns {object} Estado
   */
  getStatus() {
    return {
      status: 'running',
      timestamp: new Date().toISOString(),
      cache_size: this.cache.size(),
      logger_level: this.logger.level
    };
  }
}

module.exports = SkillsOrchestrator;
