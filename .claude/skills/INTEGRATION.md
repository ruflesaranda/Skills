# Claude Skills - Recomendaciones de Negocios WhatsApp

## 🎯 Visión General

Sistema profesional e integrado de Claude Skills para analizar negocios y enviar recomendaciones personalizadas mediante WhatsApp. Diseñado para ser modular, escalable y fácil de mantener.

## 📁 Estructura de Archivos

```
.claude/skills/
├── business-analyzer/           # Análisis de negocios
│   ├── skill.json              # Configuración del skill
│   ├── index.js                # Implementación
│   └── README.md               # Documentación
├── recommendation-engine/       # Motor de recomendaciones
│   ├── skill.json
│   ├── index.js
│   └── README.md
├── whatsapp-integration/        # Integración WhatsApp
│   ├── skill.json
│   ├── index.js
│   └── README.md
├── data-processing/            # Procesamiento de datos
│   ├── skill.json
│   ├── index.js
│   └── README.md
├── utilities/                  # Funciones auxiliares
│   ├── skill.json
│   ├── index.js
│   └── README.md
├── orchestrator.js             # Orquestador de skills
├── config.json                 # Configuración global
├── README.md                   # Este archivo
└── INTEGRATION.md              # Guía de integración
```

## 🚀 Skills Disponibles

### 1. **Business Analyzer** 📊
**Propósito:** Analizar y clasificar características de negocios

**Capacidades:**
- Clasificación automática por tipo
- Identificación de características
- Detección de oportunidades
- Cálculo de confianza

**Entrada:**
```json
{
  "business_name": "Mi Tienda",
  "business_type": "retail",
  "location": "Madrid",
  "employees": 5
}
```

**Salida:**
```json
{
  "classification": { "primary_type": "retail", "confidence": 0.95 },
  "opportunities": ["Digital presence", "E-commerce integration"],
  "timestamp": "2026-07-04T05:51:00Z"
}
```

---

### 2. **Recommendation Engine** 🎁
**Propósito:** Generar recomendaciones personalizadas

**Capacidades:**
- Recomendaciones específicas por industria
- Scoring inteligente
- Filtrado personalizado
- Análisis de impacto

**Entrada:**
```json
{
  "business_analysis": { ... },
  "user_preferences": { "budget": "medium", "speed": "fast" },
  "max_recommendations": 5
}
```

**Salida:**
```json
{
  "recommendations": [
    {
      "title": "Presencia Digital",
      "impact": 0.95,
      "effort": "medium",
      "score": 92
    }
  ],
  "metrics": { "average_score": 87.4 }
}
```

---

### 3. **WhatsApp Integration** 💬
**Propósito:** Enviar recomendaciones formateadas por WhatsApp

**Capacidades:**
- Formateo optimizado para WhatsApp
- Control de límites de tasa
- Múltiples tipos de mensaje (resumen, detallado, interactivo)
- Registro de historial

**Entrada:**
```json
{
  "phone_number": "+34123456789",
  "recommendations": [ ... ],
  "message_type": "summary",
  "business_name": "Mi Tienda"
}
```

**Salida:**
```json
{
  "success": true,
  "message_id": "msg_1719052425000_a1b2c3d4e",
  "messages_sent": 4,
  "delivery_status": { "status": "sent" }
}
```

---

### 4. **Data Processing** 🔧
**Propósito:** Normalizar y validar datos de entrada

**Capacidades:**
- Validación de tipos y formatos
- Normalización automática
- Detección de anomalías
- Enriquecimiento de datos
- Cálculo de calidad

**Entrada:**
```json
{
  "raw_data": {
    "business_name": "  Mi Tienda  ",
    "business_type": "retail"
  }
}
```

**Salida:**
```json
{
  "processed_data": {
    "business_name": "mi tienda",
    "business_type": "retail"
  },
  "quality_score": 98
}
```

---

### 5. **Utilities** 🛠️
**Propósito:** Funciones auxiliares y herramientas comunes

**Módulos:**
- **TextFormatter**: Formateo de textos (mayúsculas, truncar, moneda, %)
- **DateUtils**: Manejo de fechas
- **Calculator**: Estadísticas y cálculos
- **Logger**: Logging y debugging
- **Cache**: Cache en memoria con TTL

**Uso:**
```javascript
const { TextFormatter, Cache, Logger } = require('./utilities/index.js');

const formatted = TextFormatter.formatCurrency(1234.56, 'EUR');
const logger = new Logger('MyModule');
logger.info('Mensaje', { data: 'value' });
```

---

## 🔄 Flujo de Ejecución Completo

```
1. ENTRADA (Datos del negocio)
   |
   v
2. DATA PROCESSING (Validar y normalizar)
   |
   v
3. BUSINESS ANALYZER (Clasificar y analizar)
   |
   v
4. RECOMMENDATION ENGINE (Generar recomendaciones)
   |
   v
5. WHATSAPP INTEGRATION (Formatear y enviar)
   |
   v
6. SALIDA (Confirmación de entrega)
```

## 📊 Tipos de Negocios Soportados

| Tipo | Categoría | Recomendaciones Principales |
|------|-----------|----------------------------|
| **retail** | Comercio | Presencia digital, Inventario, Fidelización |
| **service** | Servicios | CRM, Reservas online, Automatización |
| **technology** | Tecnología | Cloud, CI/CD, Monitoreo |
| **food_beverage** | Alimentos | Delivery, POS, Menús |
| **healthcare** | Salud | Telemedicina, Registros digitales |
| **education** | Educación | Cursos online, LMS |
| **finance** | Finanzas | Fintech, Gestión de riesgos |
| **real_estate** | Inmuebles | Tours virtuales, CRM |
| **tourism** | Turismo | Booking, Reviews, Multi-idioma |
| **manufacturing** | Manufactura | Supply chain, Calidad, Analytics |

## 🔌 Integración con Orquestador

Usando `SkillsOrchestrator` para ejecutar el flujo completo:

```javascript
const SkillsOrchestrator = require('./.claude/skills/orchestrator.js');

const orchestrator = new SkillsOrchestrator({
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  }
});

const result = await orchestrator.processFullFlow(
  {
    business_name: 'Mi Tienda',
    business_type: 'retail',
    location: 'Madrid',
    employees: 5
  },
  '+34123456789',
  {
    preferences: { budget: 'medium', speed: 'fast' },
    messageType: 'summary',
    maxRecommendations: 5
  }
);

console.log(result);
```

## 🎛️ Configuración

### Variables de Entorno Necesarias

```bash
# WhatsApp
WHATSAPP_API_KEY=your_api_key_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WEBHOOK_URL=https://your-domain.com/webhook

# Opcional
LOG_LEVEL=INFO
CACHE_TTL=3600000
```

### config.json

Ver `.claude/skills/config.json` para configuración global del proyecto.

## 📈 Métricas y Monitoreo

Cada skill proporciona:
- **Quality Score**: Puntuación de calidad de datos (0-100)
- **Confidence**: Nivel de confianza de resultados (0-1)
- **Performance Metrics**: Timestamps y duración
- **Error Tracking**: Logging completo de errores
- **Message Statistics**: Para WhatsApp integration

## ✅ Checklist de Uso

- [ ] Configurar variables de entorno
- [ ] Validar datos de entrada con DataProcessor
- [ ] Analizar negocio con BusinessAnalyzer
- [ ] Generar recomendaciones con RecommendationEngine
- [ ] Formatear y enviar con WhatsAppIntegration
- [ ] Monitorear logs y métricas
- [ ] Cachear resultados cuando sea apropiado

## 🤝 Colaboración y Mantenimiento

- Cada skill es independiente pero puede usarse en conjunto
- Las pruebas unitarias van en cada carpeta de skill
- La documentación se actualiza con cada cambio
- Los logs se mantienen para auditoría

## 📝 Notas Importantes

1. **Privacidad**: Los números de teléfono se enmascaran en logs
2. **Límites**: WhatsApp tiene límites de 60 msg/min, 1000 msg/día
3. **Cacheo**: Las recomendaciones se cachean por 1 hora por defecto
4. **Errores**: Todos los errores se loguean automáticamente
5. **Escalabilidad**: Diseñado para manejar miles de negocios

## 🔗 Recursos Adicionales

- [Guía de Integración](./INTEGRATION.md)
- [Business Analyzer](./business-analyzer/README.md)
- [Recommendation Engine](./recommendation-engine/README.md)
- [WhatsApp Integration](./whatsapp-integration/README.md)
- [Data Processing](./data-processing/README.md)
- [Utilities](./utilities/README.md)

## 📞 Soporte

Para issues o preguntas:
- Revisa la documentación específica de cada skill
- Consulta los logs para troubleshooting
- Verifica la calidad de los datos de entrada

---

**Versión**: 1.0.0  
**Última actualización**: 2026-07-04  
**Estado**: ✅ Completamente funcional
