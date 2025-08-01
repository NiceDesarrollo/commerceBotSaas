# 🚀 Configuración Completa WhatsApp + Twilio

## ✅ **Estado de Implementación**

- [x] ✅ Módulo WhatsApp creado con soporte Twilio y Meta
- [x] ✅ Base de datos migrada con campos Twilio
- [x] ✅ Twilio SDK instalado (v5.8.0)
- [x] ✅ Endpoints de webhook configurados
- [x] ✅ Scripts de testing listos
- [x] ✅ Tenant PC Gamers configurado

## 🎯 **Próximos Pasos para Probar**

### **PASO 1: Obtener Credenciales de Twilio**

1. **Crea cuenta** en [twilio.com](https://www.twilio.com/try-twilio)
2. **Ve a Console** → **Messaging** → **Try it out** → **Send a WhatsApp message**
3. **Copia**:
   - Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Auth Token: `tu_auth_token_aqui`
   - Sandbox Number: `+1 415 523 8886`

### **PASO 2: Iniciar el Servidor**

```bash
# Desde apps/api/
npm run start:dev
```

### **PASO 3: Configurar Tenant PC Gamers**

Ejecuta **todos los requests** en orden desde:
📁 `tests/api/whatsapp/setup-pc-gamers-tenant.http`

**IMPORTANTE**: 
- Actualiza `@authToken` con el JWT que obtienes en el paso 1.2
- Actualiza las credenciales de Twilio en el request 4.1

### **PASO 4: Activar WhatsApp Sandbox**

1. **Desde tu WhatsApp personal**, envía a `+1 415 523 8886`:
   ```
   join [tu-codigo-sandbox]
   ```
   Ejemplo: `join proud-tiger-123`

2. **Recibirás confirmación** de que tu número está conectado al sandbox

### **PASO 5: Configurar Webhook (Opcional para Testing Local)**

Si quieres que los mensajes lleguen automáticamente:

```bash
# Instalar ngrok (si no lo tienes)
npm install -g ngrok

# Exponer tu servidor local
ngrok http 3000
```

En **Twilio Console**:
- **Webhook URL**: `https://abc123.ngrok.io/api/whatsapp/webhook/twilio`
- **HTTP Method**: `POST`

### **PASO 6: ¡Probar el Bot!**

**Envía mensajes desde WhatsApp** al número sandbox:

```
"Hola"
"¿Qué tarjetas gráficas tienen?"
"Necesito una RTX 4090"
"¿Cuánto cuesta armar una PC para Cyberpunk 2077 en 4K?"
"Tengo presupuesto de 5 millones, ¿qué me recomiendan?"
```

## 📋 **Endpoints Disponibles**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/whatsapp/config` | GET | Ver configuración actual |
| `/api/whatsapp/config` | PUT | Configurar Twilio/Meta |
| `/api/whatsapp/test` | POST | Enviar mensaje de prueba |
| `/api/whatsapp/webhook/twilio` | POST | Webhook para Twilio |
| `/api/whatsapp/webhook` | POST | Webhook para Meta |
| `/api/whatsapp/conversations` | GET | Ver historial |
| `/api/whatsapp/providers` | GET | Ver proveedores disponibles |

## 🔧 **Solución de Problemas**

### **Error: "WhatsApp no configurado"**
- Ejecuta el request de configuración de Twilio
- Verifica que `isWhatsappEnabled: true`

### **Error: "Twilio API error"**
- Verifica Account SID y Auth Token
- Asegúrate que tu número esté en el sandbox

### **No recibo mensajes automáticos**
- Configura el webhook en Twilio Console
- Usa ngrok para testing local
- Verifica que el bot esté configurado

### **El bot no responde bien**
- Agrega más productos con el script de setup
- Ajusta el prompt del bot
- Verifica que Gemini API esté configurada

## 🎮 **Productos Gaming Incluidos**

- RTX 4090 ASUS ROG Strix OC ($2,800,000)
- RTX 4080 MSI Gaming X Trio ($2,200,000)
- RTX 4070 Ti Gigabyte Gaming OC ($1,600,000)
- Intel i9-13900KF ($1,200,000)
- Intel i7-13700KF ($850,000)
- Corsair Dominator DDR5 32GB ($950,000)
- G.Skill Trident Z5 DDR5 32GB ($700,000)
- ASUS ROG Maximus Z790 HERO ($1,400,000)
- Samsung 980 PRO 2TB ($480,000)
- Corsair RM1000x 1000W ($650,000)

## 🚀 **Flujo de Conversación Esperado**

```
Cliente: "Hola"
Bot: "¡Hola! Soy Alex, tu experto en PCs gaming de PC Gamers Elite 🎮..."

Cliente: "Quiero una RTX 4090"
Bot: "¡Excelente elección! Tengo la RTX 4090 ASUS ROG Strix OC perfecta para gaming 4K..."

Cliente: "¿Cuánto cuesta?"
Bot: "La RTX 4090 ASUS ROG Strix OC cuesta $2,800,000. Es perfecta para gaming extremo en 4K..."
```

## ⚡ **Testing Rápido**

Para probar **solo el envío** sin webhook:

```bash
# Usar el archivo: tests/api/whatsapp/whatsapp-twilio.http
# Request 4: "Probar configuración de Twilio"
```

## 🔄 **Migración a Meta Business (Futuro)**

Cuando tengas Meta Business Suite listo, solo cambia:

```json
{
  "whatsappPhoneNumberId": "TU_PHONE_NUMBER_ID",
  "whatsappAccessToken": "TU_ACCESS_TOKEN", 
  "whatsappProvider": "cloud_api"  // Cambio aquí
}
```

¡Todo el resto del código funciona igual! 🎉

---

## 📞 **¿Necesitas Ayuda?**

Si algo no funciona:
1. Verifica que el servidor esté corriendo
2. Revisa los logs de la consola
3. Asegúrate que las credenciales de Twilio sean correctas
4. Confirma que tu número esté en el sandbox de Twilio