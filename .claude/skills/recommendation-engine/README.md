# Recommendation Engine Skill

## Descripción
Motor inteligente que genera recomendaciones personalizadas basadas en el análisis del negocio y las preferencias del usuario.

## Funcionalidades

### 1. Generación de Recomendaciones
- Recomendaciones específicas por tipo de negocio
- Priorización automática
- Scoring basado en múltiples factores

### 2. Personalización
- Filtra según presupuesto disponible
- Ajusta según urgencia de implementación
- Considera preferencias del usuario

### 3. Análisis de Impacto
- Estima impacto potencial de cada recomendación
- Calcula esfuerzo de implementación
- Proporciona timeframe realista

## Entrada

```json
{
  "business_analysis": {
    "classification": {
      "primary_type": "retail",
      "confidence": 0.95
    },
    "characteristics": [
      { "type": "size", "value": "pequeño" },
      { "type": "employees", "value": 5 }
    ]
  },
  "user_preferences": {
    "budget": "medium",
    "speed": "fast"
  },
  "max_recommendations": 5
}
```

## Salida

```json
{
  "recommendations": [
    {
      "id": "r1",
      "title": "Presencia Digital Omnicanal",
      "description": "Integra tienda física con presencia online",
      "impact": 0.95,
      "effort": "medium",
      "timeframe": "3-6 meses",
      "score": 92,
      "reasoning": "Esta recomendación tiene un impacto potencial del 95% para retail como el tuyo..."
    },
    {
      "id": "r2",
      "title": "Sistema de Gestión de Inventario",
      "description": "Controla stock en tiempo real",
      "impact": 0.85,
      "effort": "medium",
      "timeframe": "2-4 meses",
      "score": 85,
      "reasoning": "..."
    }
  ],
  "reasoning": {
    "business_type": "retail",
    "confidence": 0.95,
    "methodology": "Scoring based on business type, size, and preferences"
  },
  "metrics": {
    "total_recommendations": 5,
    "average_score": 87.4,
    "coverage": "100%",
    "timestamp": "2026-07-04T05:52:15Z"
  }
}
```

## Tipos de Negocio Soportados

### Retail
- Presencia Digital Omnicanal
- Sistema de Gestión de Inventario
- Programa de Fidelización
- Análisis de Datos de Ventas
- Integración de Pagos Digitales

### Service
- Plataforma de Gestión de Clientes (CRM)
- Sistema de Reservas Online
- Automatización de Seguimiento
- Portal de Servicios Online

### Technology
- Infraestructura en la Nube
- CI/CD Pipeline
- Monitoreo y Observabilidad
- API Rest Modernizada

### Food & Beverage
- App de Delivery Integrada
- Gestión Digital de Menús
- Sistema POS Moderno
- Programa de Lealtad Digital

## Factores de Scoring

1. **Impacto Potencial** (0-100%)
   - Beneficio esperado para el negocio
   - Mejora en eficiencia o ingresos

2. **Esfuerzo** (bajo, medio, alto)
   - Complejidad de implementación
   - Recursos necesarios

3. **Timeframe**
   - Tiempo estimado de implementación
   - Ventana de resultados

4. **Preferencias del Usuario**
   - Presupuesto disponible
   - Velocidad deseada
   - Prioridades específicas

## Uso

```javascript
const RecommendationEngine = require('./index.js');
const engine = new RecommendationEngine();

const recommendations = engine.generate(
  businessAnalysis,
  { budget: 'medium', speed: 'fast' },
  5
);

console.log(recommendations);
```

## Métodos Disponibles

- `generate(analysis, preferences, maxRecs)` - Genera recomendaciones
- `getRecommendationsForType(type)` - Obtiene recomendaciones por tipo
- `calculateScore(rec, analysis, prefs)` - Calcula score de recomendación
- `filterRecommendations(recs, filters)` - Filtra recomendaciones

