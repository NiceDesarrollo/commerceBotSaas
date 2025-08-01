# CommerceBot SaaS 🤖🛒

**Plataforma SaaS multiempresa de chatbots de IA especializados en comercio electrónico**

CommerceBot SaaS permite a diferentes empresas tener sus propios asistentes virtuales inteligentes para interactuar con clientes, gestionar consultas sobre productos y aumentar las ventas mediante conversaciones automatizadas.

## 🚀 Características Principales

### 🏢 **Multiempresa (Multi-tenant)**
- Cada empresa tiene su propio espacio completamente aislado
- Configuración y branding personalizable por empresa
- Datos 100% separados y seguros
- Escalabilidad horizontal automática

### 🤖 **IA Conversacional Avanzada**
- **Chat inteligente** con memoria de contexto
- **Múltiples proveedores:** Google Gemini Pro, OpenAI GPT-4
- **Respuestas contextuales** basadas en inventario real
- **Configuración flexible:** temperatura, estilo, personalidad

### 📦 **Gestión de Productos Integrada**
- CRUD completo de productos por empresa
- Categorización y etiquetas avanzadas
- Control de inventario en tiempo real
- Soporte para imágenes y descripciones ricas

### 🔐 **Seguridad Empresarial**
- Autenticación JWT robusta
- Roles y permisos granulares (ADMIN/USER)
- Aislamiento total por tenant
- Validaciones exhaustivas de datos

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico**
```
Backend:      NestJS + TypeScript
Base de Datos: PostgreSQL + Prisma ORM
Autenticación: JWT (JSON Web Tokens)
IA:           Google Gemini Pro & OpenAI
Validación:   Class Validator + Transformer
Testing:      Jest + REST Client + Scripts automatizados
```

### **Estructura del Proyecto**
```
commerceBotSaas/
├── apps/
│   ├── api/              # 🔥 API Backend NestJS (FUNCIONANDO)
│   └── adminPanel/       # ⏳ Panel Admin React (FUTURO)
├── database/             # 🔥 Prisma ORM + PostgreSQL (FUNCIONANDO)
├── tests/                # 🔥 Suite completa de testing 
```

## 🎯 API Endpoints

### **🔐 Autenticación**
```http
POST /api/auth/login      # Login de usuario
POST /api/auth/register   # Registro de usuario
```

### **👥 Gestión de Usuarios**
```http
GET  /api/users/me        # Perfil del usuario autenticado
GET  /api/users           # Lista usuarios del tenant (ADMIN only)
```

### **🛒 Catálogo de Productos**
```http
GET    /api/products          # Listar productos con filtros
POST   /api/products          # Crear nuevo producto
PUT    /api/products/:id      # Actualizar producto
DELETE /api/products/:id      # Eliminar producto
GET    /api/products/:id      # Obtener producto específico
```

### **🤖 Chat IA Inteligente**
```http
POST /api/ai/chat             # Enviar mensaje al chatbot
GET  /api/ai/conversations    # Historial de conversaciones
GET  /api/ai/bot-config       # Configuración actual del bot
PUT  /api/ai/bot-config       # Actualizar configuración del bot
POST /api/ai/bot-config/test  # Probar configuración con mensaje
```

## ⚙️ Configuración del Bot IA

Cada empresa puede personalizar completamente su asistente virtual:

```json
{
  "botName": "Asistente Virtual CommerceBot",
  "promptStyle": "Amigable, profesional y persuasivo para ventas",
  "greeting": "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?",
  "temperature": 0.8,        // Creatividad de respuestas (0.0 - 1.0)
  "useImages": true,         // Soporte para imágenes en respuestas
  "aiProvider": "gemini"     // Proveedor: "gemini", "openai", "auto"
}
```

## 🚀 Inicio Rápido

### **1. Clonar y Configurar**
```bash
git clone [repo-url]
cd commerceBotSaas

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### **2. Base de Datos**
```bash
cd database
npm install
npx prisma db push      # Crear tablas
npx prisma generate     # Generar cliente Prisma
npx prisma db seed      # Datos de ejemplo (opcional)
```

### **3. API Backend**
```bash
cd apps/api
npm install
npm run start:dev       # Servidor en http://localhost:3000
```

### **4. Verificar Funcionamiento**
```bash
cd tests/scripts
npm install axios       # Solo primera vez
node run-all-tests.js   # Ejecutar suite de pruebas
```

## 🔧 Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/commercebot"

# Autenticación
JWT_SECRET="tu-secreto-jwt-super-seguro"

# IA Providers
GEMINI_API_KEY="tu-api-key-de-google-ai-studio"
OPENAI_API_KEY="tu-api-key-de-openai"  # Opcional

# Servidor
PORT=3000
NODE_ENV=development
```

## 📊 Estado del Proyecto

### **✅ Completamente Funcional**
- ✅ **API Backend** NestJS con TypeScript
- ✅ **Autenticación JWT** multiempresa segura
- ✅ **CRUD Productos** con validaciones robustas
- ✅ **Chat IA** inteligente con Gemini Pro
- ✅ **Configuración personalizable** de bots por empresa
- ✅ **Historial conversaciones** persistente y consultable
- ✅ **Base de datos** PostgreSQL con migraciones Prisma
- ✅ **Testing suite** completo (90%+ cobertura)

### **⏳ En Desarrollo**
- ⏳ **Panel de Administración** React/Next.js
- ⏳ **Webhooks** WhatsApp/Telegram para chat directo
- ⏳ **Analytics avanzados** y dashboard de métricas
- ⏳ **Multi-LLM support** (Claude, Llama, etc.)
- ⏳ **Rate limiting** y optimizaciones de rendimiento

## 🧪 Testing y Desarrollo

### **Testing Manual (Recomendado)**
```bash
# Instalar extensión "REST Client" en VS Code/Cursor
# Abrir archivos .http en tests/api/
# Click "Send Request" para probar endpoints
```

### **Testing Automatizado**
```bash
cd tests/scripts
node run-all-tests.js      # Suite completa
node list-endpoints.js     # Análisis de endpoints
```

### **Archivos de Testing Disponibles**
- `tests/api/auth/auth-endpoints.http` - Autenticación
- `tests/api/users/users-endpoints.http` - Gestión usuarios
- `tests/api/products/products-crud.http` - CRUD productos
- `tests/api/ai-conversations/ai-chat.http` - Chat IA ⭐

## 🎯 Casos de Uso Reales

### **1. E-commerce Small Business**
Tienda online que necesita asistente 24/7 para consultas de productos, recomendaciones y soporte al cliente.

### **2. Retailers Multitienda**
Cadena de tiendas con diferentes ubicaciones, cada una con su catálogo y configuración de chatbot específica.

### **3. Distribuidores B2B**
Empresas que venden a otras empresas y necesitan automatizar consultas técnicas y cotizaciones.

### **4. Marketplace Vendors**
Vendedores que operan en múltiples plataformas y necesitan centralizar la gestión de productos y atención al cliente.

## 📈 Métricas y Rendimiento

- **Respuesta promedio IA:** ~2-3 segundos
- **Soporte concurrente:** 100+ conversaciones simultáneas
- **Uptime objetivo:** 99.9%
- **Escalabilidad:** Horizontal via containers

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).

## 📞 Soporte

Para soporte técnico, crear un issue en GitHub o contactar al equipo de desarrollo.

---

**CommerceBot SaaS** - Llevando el comercio electrónico al siguiente nivel con IA conversacional 🚀
