# WhatsApp Integration Skill

## Descripción
Integración completa con WhatsApp Business API para envío de recomendaciones formateadas y gestión de conversaciones.

## Funcionalidades

### 1. Formateo de Mensajes
- Formato optimizado para WhatsApp
- Emojis para mejor legibilidad
- Plantillas personalizables (resumen, detallado, interactivo)

### 2. Envío de Recomendaciones
- Envío masivo controlado
- Gestión de límites de tasa
- Reintentos automáticos

### 3. Gestión de Conversaciones
- Registro de historial
- Seguimiento de entregas
- Validación de números

### 4. Control de Límites
- Máximo 60 mensajes/minuto
- Máximo 1000 mensajes/día
- Reintentos configurables

## Entrada

```json
{
  "phone_number": "+34123456789",
  "recommendations": [
    {
      "title": "Presencia Digital Omnicanal",
      "description": "Integra tienda física con presencia online",
      "impact": 0.95,
      "effort": "medium",
      "timeframe": "3-6 meses"
    },
    {
      "title": "Sistema de Gestión de Inventario",
      "description": "Controla stock en tiempo real",
      "impact": 0.85,
      "effort": "medium",
      "timeframe": "2-4 meses"
    }
  ],
  "message_type": "summary",
  "business_name": "Mi Tienda"
}
```

## Salida

```json
{
  "success": true,
  "message_id": "msg_1719052425000_a1b2c3d4e",
  "messages_sent": 4,
  "delivery_status": {
    "status": "sent",
    "message_count": 4,
    "delivery_time": "2026-07-04T05:54:00Z",
    "confirmed": false,
    "confirmable_at": "2026-07-04T05:54:30Z"
  },
  "phone_number": "+XX...6789",
  "timestamp": "2026-07-04T05:54:00Z"
}
```

## Tipos de Mensajes

### Summary (Resumen)
Formato conciso con puntos clave de cada recomendación.

```
🚀 *Recomendaciones para tu negocio*

Para *Mi Tienda*:

*1. Presencia Digital Omnicanal*
Integra tienda física con presencia online
⏱️ Plazo: 3-6 meses
💪 Impacto: 95%
🔧 Esfuerzo: 🟡 Medio
```

### Detailed (Detallado)
Versión expandida con análisis completo.

```
📊 *Recomendaciones Detalladas*

Para *Mi Tienda*:

*1. Presencia Digital Omnicanal*
Integra tienda física con presencia online
⏱️ Plazo: 3-6 meses
💪 Impacto: 95%
🔧 Esfuerzo: 🟡 Medio

📝 Descripción extendida...
```

### Interactive (Interactivo)
Mensaje con botones interactivos para seleccionar.

```
Selecciona una recomendación para más detalles:

[Presencia Digital]
[Gestión de Inventario]
[Fidelización de Clientes]
```

## Formatos de Entrada de Teléfono

- ✅ `+34123456789` (Formato internacional)
- ✅ `+1234567890` (USA)
- ✅ `+5511987654321` (Brasil)
- ❌ `123456789` (Sin código país)
- ❌ `0123456789` (Formato local)

## Límites de Tasa

| Límite | Valor |
|--------|-------|
| Mensajes por minuto | 60 |
| Mensajes por día | 1000 |
| Reintentos | 3 |
| Timeout de entrega | 30 segundos |

## Métodos Disponibles

- `sendRecommendations()` - Envía recomendaciones
- `formatMessages()` - Formatea mensajes
- `validatePhoneNumber()` - Valida número
- `checkRateLimit()` - Verifica límites
- `createInteractiveMessage()` - Crea mensaje interactivo
- `getMessageHistory()` - Obtiene historial
- `getStatistics()` - Estadísticas de envíos

## Configuración Requerida

```javascript
const WhatsAppIntegration = require('./index.js');

const whatsapp = new WhatsAppIntegration({
  apiKey: process.env.WHATSAPP_API_KEY,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  webhookUrl: process.env.WEBHOOK_URL
});
```

## Variables de Entorno

```bash
WHATSAPP_API_KEY=your_api_key_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WEBHOOK_URL=https://your-domain.com/webhook
```

## Manejo de Errores

```javascript
try {
  const result = await whatsapp.sendRecommendations(
    '+34123456789',
    recommendations
  );
  console.log('Mensaje enviado:', result.message_id);
} catch (error) {
  console.error('Error al enviar:', error.message);
}
```

## Privacidad

- Los números de teléfono se enmascaran en registros
- Cumplimiento con GDPR y regulaciones locales
- Encriptación end-to-end
- No se almacenan mensajes sensibles

