# Utilities Skill

## Descripción
Colección de funciones auxiliares y de soporte reutilizables en toda la plataforma de skills.

## Módulos

### 1. TextFormatter
Formateo y manipulación de textos.

**Métodos:**
- `capitalize()` - Capitaliza primer carácter
- `toTitleCase()` - Convierte a Título
- `truncate()` - Trunca con sufijo
- `pluralize()` - Pluraliza palabra
- `formatCurrency()` - Formatea moneda
- `formatPercent()` - Formatea porcentaje

**Uso:**
```javascript
const { TextFormatter } = require('./index.js');

TextFormatter.capitalize('hello'); // 'Hello'
TextFormatter.toTitleCase('hello world'); // 'Hello World'
TextFormatter.truncate('Un texto muy largo...', 20); // 'Un texto muy lar...'
TextFormatter.formatCurrency(1234.56, 'EUR'); // '1.234,56 €'
TextFormatter.formatPercent(0.85); // '85.00%'
```

### 2. DateUtils
Utilidades para manejo de fechas.

**Métodos:**
- `now()` - Fecha y hora actual
- `format()` - Formatea fecha
- `daysAgo()` - Días transcurridos
- `addDays()` - Añade días
- `addMonths()` - Añade meses
- `getDayName()` - Nombre del día
- `getMonthName()` - Nombre del mes

**Uso:**
```javascript
const { DateUtils } = require('./index.js');

DateUtils.format(new Date(), 'YYYY-MM-DD'); // '2026-07-04'
DateUtils.format(new Date(), 'YYYY-MM-DD HH:mm:ss'); // '2026-07-04 05:56:00'
DateUtils.daysAgo('2026-07-01'); // 3
DateUtils.getDayName(new Date(), 'es-ES'); // 'Sábado'
```

### 3. Calculator
Cálculos y estadísticas.

**Métodos:**
- `sum()` - Suma de números
- `average()` - Promedio
- `median()` - Mediana
- `max()` - Máximo
- `min()` - Mínimo
- `standardDeviation()` - Desviación estándar
- `percentage()` - Cálculo de porcentaje
- `percentageChange()` - Cambio porcentual
- `compound()` - Interés compuesto

**Uso:**
```javascript
const { Calculator } = require('./index.js');

const numbers = [10, 20, 30, 40, 50];
Calculator.average(numbers); // 30
Calculator.median(numbers); // 30
Calculator.percentage(30, 100); // 30
Calculator.percentageChange(100, 120); // 20
```

### 4. Logger
Logging y debugging.

**Métodos:**
- `debug()` - Log de debug
- `info()` - Log de información
- `warn()` - Log de advertencia
- `error()` - Log de error
- `getLogs()` - Obtiene historial
- `clearLogs()` - Limpia historial

**Uso:**
```javascript
const { Logger } = require('./index.js');

const logger = new Logger('MyModule', 'DEBUG');
logger.info('Iniciando proceso', { step: 1 });
logger.warn('Valor no encontrado', { key: 'config' });
logger.error('Error de conexión', { code: 'ECONNREFUSED' });
const logs = logger.getLogs(10);
```

**Niveles:**
- DEBUG: Información de debugging
- INFO: Información general
- WARN: Advertencias
- ERROR: Errores

### 5. Cache
Cache en memoria con TTL.

**Métodos:**
- `set()` - Guarda en cache
- `get()` - Obtiene del cache
- `has()` - Verifica si existe
- `delete()` - Elimina del cache
- `clear()` - Limpia todo el cache
- `size()` - Tamaño del cache
- `getAll()` - Obtiene todo

**Uso:**
```javascript
const { Cache } = require('./index.js');

const cache = new Cache(5 * 60 * 1000); // 5 minutos TTL

cache.set('user:123', { id: 123, name: 'Juan' });
const user = cache.get('user:123'); // { id: 123, name: 'Juan' }

if (cache.has('user:123')) {
  console.log('En cache');
}

cache.delete('user:123');
```

## Ejemplos de Uso Integrado

```javascript
const { TextFormatter, DateUtils, Calculator, Logger, Cache } = require('./index.js');

const logger = new Logger('Analytics', 'INFO');
const cache = new Cache();

// Calcular estadísticas
const revenue = [100, 150, 200, 250, 300];
const avg = Calculator.average(revenue);
const change = Calculator.percentageChange(100, avg);

logger.info('Ingresos promedio calculados', {
  average: TextFormatter.formatCurrency(avg),
  change: TextFormatter.formatPercent(change / 100)
});

// Cachear resultados
cache.set('analytics', { average: avg, change }, 60000);

logger.info('Resultados cacheados hasta ' + DateUtils.format(
  DateUtils.addDays(new Date(), 1),
  'YYYY-MM-DD HH:mm'
));
```

## Configuración de Logger

```javascript
const logger = new Logger('NombreModulo', 'LEVEL');
```

**Niveles disponibles:** DEBUG, INFO, WARN, ERROR

## TTL del Cache

Tiempo de vida en milisegundos:
- 60000 = 1 minuto
- 300000 = 5 minutos
- 3600000 = 1 hora (por defecto)
- 86400000 = 1 día

