# Data Processing Skill

## Descripción
Normalización, validación y procesamiento de datos para garantizar consistencia y calidad en toda la plataforma.

## Funcionalidades

### 1. Validación de Datos
- Validación de tipos
- Verificación de enumeraciones
- Validación de rangos
- Validación de patrones regex

### 2. Normalización
- Conversión de formatos
- Estandarización de valores
- Limpieza de espacios
- Normalización de teléfonos

### 3. Detección de Anomalías
- Identificación de datos inconsistentes
- Alertas sobre valores sospechosos
- Validación de coherencia

### 4. Enriquecimiento
- Añade timestamps
- Extrae información adicional
- Calcula categorías

## Entrada

```json
{
  "raw_data": {
    "business_name": "  Mi Tienda  ",
    "business_type": "retail",
    "location": "MADRID",
    "size": "pequeño",
    "employees": "5",
    "phone_number": "34 123 456 789",
    "email": "CONTACTO@MITIENDA.COM"
  },
  "strict_mode": false
}
```

## Salida

```json
{
  "processed_data": {
    "business_name": "mi tienda",
    "business_type": "retail",
    "location": "madrid",
    "size": "small",
    "employees": 5,
    "phone_number": "+34123456789",
    "email": "contacto@mitienda.com",
    "processed_at": "2026-07-04T05:55:00Z",
    "country_code": "34",
    "email_domain": "mitienda.com",
    "size_category": "small"
  },
  "validation_report": {
    "total_fields": 7,
    "valid_fields": 7,
    "errors": [],
    "warnings": [],
    "strict_mode": false
  },
  "quality_score": 98
}
```

## Reglas de Validación Integradas

### business_name
- Tipo: string
- Longitud mínima: 2 caracteres
- Longitud máxima: 100 caracteres

### business_type
- Tipo: string
- Valores permitidos: retail, service, technology, food_beverage, healthcare, education, finance, real_estate, tourism, manufacturing

### size
- Tipo: string
- Valores permitidos: small, medium, large (con alias)
- Alias soportados: pequeño, mediano, grande

### employees
- Tipo: número
- Rango: 1 - 10,000

### phone_number
- Tipo: string
- Formato: Número internacional (+34123456789)

### email
- Tipo: string
- Formato: RFC 5322 simplificado

## Normalizaciones Automáticas

### Tamaño
- pequeño, pequeño, sm, s → small
- mediano, mediana, md, m → medium
- grande, lg, l → large

### Tipo de Negocio
- tienda, comercio, shop → retail
- consultoría, consulting → service
- software, tech → technology
- comida, restaurante → food_beverage
- salud, hospital → healthcare
- educación, training → education
- finanzas, bank → finance
- inmuebles, property → real_estate
- turismo, hotel → tourism
- fábrica, factory → manufacturing

## Métodos Disponibles

- `process()` - Procesa y normaliza datos
- `validateField()` - Valida campo individual
- `normalizeField()` - Normaliza campo individual
- `detectAnomalies()` - Detecta anomalías
- `enrichData()` - Añade información adicional

## Puntuación de Calidad

- **100**: Todos los campos válidos, sin errores
- **75-99**: Mayoría de campos válidos, errores menores
- **50-74**: Varios campos con problemas
- **<50**: Datos de baja calidad

## Uso

```javascript
const DataProcessor = require('./index.js');
const processor = new DataProcessor();

const result = processor.process(rawData);

if (result.quality_score >= 80) {
  console.log('Datos de buena calidad');
  const enriched = processor.enrichData(result.processed_data);
  console.log(enriched);
}
```

## Modo Estricto

Cuando `strict_mode: true`, los datos inválidos causan error en lugar de advertencia:

```javascript
const result = processor.process(rawData, null, true);
// Lanza error si hay campos inválidos
```
