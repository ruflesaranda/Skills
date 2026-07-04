/**
 * WhatsApp Integration Skill
 * Integración con WhatsApp Business API para envío de recomendaciones
 */

class WhatsAppIntegration {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.WHATSAPP_API_KEY;
    this.businessAccountId = config.businessAccountId || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    this.webhookUrl = config.webhookUrl || process.env.WEBHOOK_URL;
    
    this.messageTemplates = {
      summary: {
        header: '🚀 *Recomendaciones para tu negocio*',
        footer: '\n📱 Responde "detalles #" para más información\n✉️ Preguntas: contacto@recomendaciones.com'
      },
      detailed: {
        header: '📊 *Recomendaciones Detalladas*',
        footer: '\n💡 Implementar recomendaciones puede mejorar tu negocio\n📞 Agenda una consulta: www.recomendaciones.com/consulta'
      },
      interactive: {
        header: '🎯 *Recomendaciones Interactivas*',
        footer: '\n✅ Selecciona una opción para comenzar'
      }
    };
    
    this.rateLimits = {
      maxMessagesPerMinute: 60,
      maxMessagesPerDay: 1000,
      retryAttempts: 3
    };
    
    this.messageLog = [];
  }

  /**
   * Formatea y envía recomendaciones por WhatsApp
   * @param {string} phoneNumber - Número de teléfono
   * @param {array} recommendations - Lista de recomendaciones
   * @param {string} messageType - Tipo de mensaje
   * @param {string} businessName - Nombre del negocio
   * @returns {object} Resultado del envío
   */
  async sendRecommendations(phoneNumber, recommendations, messageType = 'summary', businessName = 'tu negocio') {
    // Validar número de teléfono
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new Error('Número de teléfono inválido. Usa formato: +34123456789');
    }
    
    // Validar límites de tasa
    if (!this.checkRateLimit()) {
      throw new Error('Límite de mensajes alcanzado. Intenta más tarde.');
    }
    
    const template = this.messageTemplates[messageType];
    const messages = this.formatMessages(recommendations, template, businessName);
    
    try {
      const deliveryStatus = await this.deliverMessages(phoneNumber, messages);
      const messageId = this.generateMessageId();
      
      // Registrar envío
      this.logMessage({
        phoneNumber,
        messageType,
        recommendationCount: recommendations.length,
        deliveryStatus,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        message_id: messageId,
        messages_sent: messages.length,
        delivery_status: deliveryStatus,
        phone_number: this.maskPhoneNumber(phoneNumber),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        phone_number: this.maskPhoneNumber(phoneNumber),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Formatea las recomendaciones en mensajes WhatsApp
   * @param {array} recommendations - Recomendaciones
   * @param {object} template - Plantilla de mensaje
   * @param {string} businessName - Nombre del negocio
   * @returns {array} Mensajes formateados
   */
  formatMessages(recommendations, template, businessName) {
    const messages = [];
    
    // Mensaje de encabezado
    messages.push({
      type: 'text',
      content: template.header + `\n\nPara *${businessName}*:`
    });
    
    // Recomendaciones individuales
    recommendations.forEach((rec, index) => {
      const formattedRec = `\n*${index + 1}. ${rec.title}*\n` +
        `${rec.description}\n` +
        `⏱️ Plazo: ${rec.timeframe}\n` +
        `💪 Impacto: ${(rec.impact * 100).toFixed(0)}%\n` +
        `🔧 Esfuerzo: ${this.translateEffort(rec.effort)}`;
      
      messages.push({
        type: 'text',
        content: formattedRec
      });
    });
    
    // Pie de página
    messages.push({
      type: 'text',
      content: template.footer
    });
    
    return messages;
  }

  /**
   * Valida número de teléfono
   * @param {string} phoneNumber - Número a validar
   * @returns {boolean} Es válido
   */
  validatePhoneNumber(phoneNumber) {
    // Validar formato internacional
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  /**
   * Verifica límites de tasa
   * @returns {boolean} Dentro de límites
   */
  checkRateLimit() {
    const now = new Date();
    const oneMinuteAgo = new Date(now - 60 * 1000);
    
    const recentMessages = this.messageLog.filter(msg => new Date(msg.timestamp) > oneMinuteAgo);
    
    if (recentMessages.length >= this.rateLimits.maxMessagesPerMinute) {
      return false;
    }
    
    return true;
  }

  /**
   * Entrega mensajes a través de WhatsApp API
   * @param {string} phoneNumber - Número de teléfono
   * @param {array} messages - Mensajes a entregar
   * @returns {object} Estado de entrega
   */
  async deliverMessages(phoneNumber, messages) {
    // Simulación de entrega (en producción, llamaría a WhatsApp API)
    return {
      status: 'sent',
      message_count: messages.length,
      delivery_time: new Date().toISOString(),
      confirmed: false,
      confirmable_at: new Date(Date.now() + 30 * 1000).toISOString()
    };
  }

  /**
   * Genera ID único para mensaje
   * @returns {string} ID único
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Enmascara número de teléfono para privacidad
   * @param {string} phoneNumber - Número de teléfono
   * @returns {string} Número enmascarado
   */
  maskPhoneNumber(phoneNumber) {
    const last4 = phoneNumber.slice(-4);
    return `+XX...${last4}`;
  }

  /**
   * Registra mensaje enviado
   * @param {object} messageData - Datos del mensaje
   */
  logMessage(messageData) {
    this.messageLog.push(messageData);
    // Limpiar logs antiguos (mantener últimos 1000)
    if (this.messageLog.length > 1000) {
      this.messageLog.shift();
    }
  }

  /**
   * Traduce nivel de esfuerzo
   * @param {string} effort - Nivel de esfuerzo
   * @returns {string} Esfuerzo traducido
   */
  translateEffort(effort) {
    const translations = {
      low: '🟢 Bajo',
      medium: '🟡 Medio',
      high: '🔴 Alto'
    };
    return translations[effort] || effort;
  }

  /**
   * Crea plantilla de mensaje interactivo
   * @param {array} recommendations - Recomendaciones
   * @returns {object} Mensaje interactivo
   */
  createInteractiveMessage(recommendations) {
    return {
      type: 'interactive',
      body: {
        text: 'Selecciona una recomendación para más detalles:'
      },
      action: {
        buttons: recommendations.slice(0, 3).map((rec, idx) => ({
          type: 'reply',
          reply: {
            id: `rec_${idx + 1}`,
            title: rec.title.substring(0, 20)
          }
        }))
      }
    };
  }

  /**
   * Obtiene historial de mensajes
   * @param {number} limit - Número máximo de registros
   * @returns {array} Historial de mensajes
   */
  getMessageHistory(limit = 10) {
    return this.messageLog.slice(-limit);
  }

  /**
   * Obtiene estadísticas de envíos
   * @returns {object} Estadísticas
   */
  getStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMessages = this.messageLog.filter(msg => new Date(msg.timestamp) >= today);
    
    return {
      total_messages: this.messageLog.length,
      today_messages: todayMessages.length,
      unique_contacts: new Set(this.messageLog.map(msg => msg.phoneNumber)).size,
      success_rate: (this.messageLog.filter(msg => msg.deliveryStatus.status === 'sent').length / this.messageLog.length * 100).toFixed(2) + '%'
    };
  }
}

module.exports = WhatsAppIntegration;
