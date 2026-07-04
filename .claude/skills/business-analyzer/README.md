# Business Analyzer Skill

## Descripción
Analiza y clasifica características de negocios para identificar oportunidades y generar recomendaciones precisas.

## Funcionalidades

### 1. Clasificación de Negocios
- Identifica automáticamente el tipo de negocio
- Soporta 10 categorías principales
- Calcula nivel de confianza

### 2. Análisis de Características
- Extrae información relevante del negocio
- Categoriza por tipo de característica
- Normaliza datos

### 3. Identificación de Oportunidades
- Sugiere mejoras específicas por tipo de negocio
- Prioriza según industria
- Recomendaciones accionables

## Entrada

```json
{
  "business_name": "Mi Tienda",
  "business_type": "retail",
  "location": "Madrid",
  "size": "pequeño",
  "employees": 5,
  "description": "Tienda de ropa deportiva"
}
```

## Salida

```json
{
  "classification": {
    "primary_type": "retail",
    "specified_type": "retail",
    "confidence": 0.95
  },
  "characteristics": [
    { "type": "location", "value": "Madrid" },
    { "type": "size", "value": "pequeño" },
    { "type": "employees", "value": 5 }
  ],
  "opportunities": [
    "Digital presence",
    "E-commerce integration",
    "Customer loyalty program"
  ],
  "timestamp": "2026-07-04T05:51:00Z",
  "confidence": 0.8
}
```

## Categorías de Negocios

- **retail**: Tiendas y comercio
- **service**: Servicios y consultoría
- **technology**: Tecnología y software
- **food_beverage**: Alimentos y bebidas
- **healthcare**: Salud y medicina
- **education**: Educación y formación
- **finance**: Finanzas e inversión
- **real_estate**: Inmuebles y propiedades
- **tourism**: Turismo y hospedaje
- **manufacturing**: Manufactura e industria

## Uso

```javascript
const BusinessAnalyzer = require('./index.js');
const analyzer = new BusinessAnalyzer();

const result = analyzer.analyze({
  business_name: 'Mi Negocio',
  business_type: 'retail',
  location: 'Madrid'
});

console.log(result);
```
