# 📋 **Guía de Testing - CommerceBot SaaS**

Esta guía explica cómo ejecutar y mantener las pruebas del proyecto.

## 🏗️ **Estructura de Testing**

### **📁 Organización por Módulos**
```
tests/
├── api/                         # Pruebas de endpoints REST
│   ├── auth/                    # Autenticación y autorización
│   ├── users/                   # Gestión de usuarios
│   ├── products/                # CRUD de productos (futuro)
│   └── ai-conversations/        # Chat con IA (futuro)
├── scripts/                     # Scripts automatizados
├── docs/                        # Documentación de testing
├── integration/                 # Pruebas de integración (futuro)
└── performance/                 # Pruebas de rendimiento (futuro)
```

## 🚀 **Métodos de Testing**

### **1. REST Client (Recomendado para desarrollo)**
Ideal para **testing manual** y **exploración de APIs**.

#### **Configuración:**
1. Instalar extensión "**REST Client**" en VS Code/Cursor
2. Abrir cualquier archivo `.http` en `tests/api/`
3. Click en "**Send Request**" sobre cada endpoint

#### **Archivos disponibles:**
- `tests/api/auth/auth-endpoints.http` - Autenticación
- `tests/api/users/users-endpoints.http` - Usuarios
- `tests/api/products/products-crud.http` - Productos (plantilla)
- `tests/api/ai-conversations/ai-chat.http` - IA Chat (plantilla)

#### **Ventajas:**
✅ **Visual e interactivo**  
✅ **Variables reutilizables**  
✅ **Historial automático**  
✅ **Integrado en el editor**  
✅ **Sin configuración adicional**  

---

### **2. Scripts Automatizados (Recomendado para CI/CD)**
Ideal para **testing automático** y **validación continua**.

#### **Ejecutar todas las pruebas:**
```bash
cd tests/scripts
npm install axios  # Solo la primera vez
node run-all-tests.js
```

#### **Análisis de endpoints:**
```bash
cd tests/scripts
node list-endpoints.js
```

#### **Ventajas:**
✅ **Ejecución rápida**  
✅ **Resultados detallados**  
✅ **Perfecto para CI/CD**  
✅ **Validación automática**  

---

### **3. Herramientas Externas**
Para **testing avanzado** y **documentación**.

#### **Postman/Insomnia:**
- Importar collections desde archivos `.http`
- Crear entornos de testing
- Generar documentación automática

#### **cURL (Terminal):**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tenant.com","password":"admin123"}'

# Perfil (con token)
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 **Tipos de Pruebas por Módulo**

### **🔐 Autenticación (`auth/`)**

#### **Casos de éxito:**
- ✅ Login con credenciales válidas
- ✅ Registro de nuevo usuario
- ✅ Estructura correcta de respuesta JWT

#### **Casos de error:**
- ❌ Login con credenciales incorrectas
- ❌ Email con formato inválido
- ❌ Contraseña muy corta
- ❌ TenantId inexistente
- ❌ Email duplicado en registro

#### **Códigos esperados:**
- `200` - Login exitoso
- `201` - Registro exitoso
- `400` - Validación fallida
- `401` - Credenciales inválidas
- `409` - Email duplicado

---

### **👥 Usuarios (`users/`)**

#### **Casos de éxito:**
- ✅ Obtener perfil con token válido
- ✅ Listar usuarios del tenant (ADMIN)
- ✅ Estructura correcta de respuestas

#### **Casos de error:**
- ❌ Acceso sin token JWT
- ❌ Token inválido/malformado
- ❌ Endpoint inexistente
- ❌ Método HTTP incorrecto

#### **Códigos esperados:**
- `200` - Operación exitosa
- `401` - Sin token o token inválido
- `403` - Token válido pero sin permisos
- `404` - Endpoint inexistente
- `405` - Método HTTP incorrecto

---

### **🛒 Productos (Futuro)**

#### **Funcionalidades planificadas:**
- CRUD completo de productos
- Categorías y filtros
- Gestión de inventario
- Búsqueda avanzada

#### **Seguridad:**
- Multiempresa (scope por tenant)
- Role-based access control
- Validaciones de datos

---

### **🤖 IA Conversaciones (Futuro)**

#### **Funcionalidades planificadas:**
- Chat inteligente con IA
- Historial de conversaciones
- Configuración de bots
- Integraciones (WhatsApp, etc.)

## 📊 **Interpretación de Resultados**

### **Códigos de Respuesta HTTP**

| Código | Significado | Cuándo aparece |
|--------|-------------|----------------|
| **2xx** | ✅ **Éxito** | Operación completada exitosamente |
| **200** | OK | GET, PUT, PATCH exitosos |
| **201** | Created | POST exitoso (recurso creado) |
| **400** | ❌ **Bad Request** | Datos inválidos, validación fallida |
| **401** | ❌ **Unauthorized** | Sin token, token inválido |
| **403** | ❌ **Forbidden** | Token válido pero sin permisos |
| **404** | ❌ **Not Found** | Recurso/endpoint inexistente |
| **405** | ❌ **Method Not Allowed** | Método HTTP incorrecto |
| **409** | ❌ **Conflict** | Recurso duplicado (email) |
| **500** | ❌ **Internal Error** | Error del servidor |

### **Indicadores de Salud del Sistema**

#### **🎉 Sistema Saludable (90%+ pruebas exitosas):**
- Autenticación funcionando correctamente
- JWT generándose y validándose
- Endpoints protegidos seguros
- Validaciones operativas

#### **⚠️ Sistema Regular (70-89% pruebas exitosas):**
- Funcionalidad core operativa
- Algunos endpoints con problemas menores
- Revisar logs para errores específicos

#### **💥 Sistema Crítico (<70% pruebas exitosas):**
- Problemas fundamentales de funcionamiento
- Revisar configuración de servidor
- Verificar variables de entorno
- Comprobar conexión a base de datos

## 🔧 **Solución de Problemas Comunes**

### **❌ Servidor no disponible**
```bash
# Verificar que el servidor esté corriendo
cd apps/api
npm run start:dev

# Verificar puerto 3000
netstat -an | grep 3000
```

### **❌ Error de token/autenticación**
1. Ejecutar login primero para obtener token
2. Copiar `accessToken` de la respuesta
3. Reemplazar en variable `@accessToken`
4. Verificar que el token no haya expirado (7 días)

### **❌ Error de base de datos**
```bash
# Verificar conexión a PostgreSQL
cd database
npx prisma db push

# Regenerar Prisma Client
npx prisma generate
```

### **❌ Error de validación**
- Verificar formato de email
- Verificar longitud mínima de contraseña (6 caracteres)
- Verificar que tenantId sea un UUID válido
- Verificar que todos los campos requeridos estén presentes

## 🔄 **Flujo de Testing Recomendado**

### **Durante Desarrollo:**
1. **REST Client** para testing manual e interactivo
2. **Scripts automatizados** para validación rápida
3. **list-endpoints.js** para análisis de cambios

### **Antes de Deploy:**
1. **run-all-tests.js** para suite completa
2. Verificar 90%+ de éxito
3. Documentar cualquier falla conocida

### **En Producción:**
1. **Health checks** automáticos
2. **Monitoring** de endpoints críticos
3. **Alertas** por fallos de autenticación

## 📝 **Mejores Prácticas**

### **✅ Hacer:**
- Ejecutar pruebas antes de cada commit
- Mantener tokens actualizados en archivos `.http`
- Documentar nuevos endpoints en plantillas
- Usar variables para evitar duplicación
- Probar tanto casos de éxito como de error

### **❌ Evitar:**
- Hardcodear valores específicos
- Ignorar pruebas fallidas
- Usar tokens expirados
- Saltarse validaciones de error
- Probar solo el happy path

## 🔮 **Roadmap de Testing**

### **Próximas funcionalidades:**
- 🛒 **Productos**: CRUD completo con validaciones
- 🤖 **IA Chat**: Conversaciones y configuración
- 📊 **Analytics**: Métricas y reportes
- 🔄 **Integraciones**: WhatsApp, Telegram
- 🧪 **E2E Testing**: Cypress/Playwright
- ⚡ **Performance**: Load testing con Artillery

### **Mejoras de infraestructura:**
- CI/CD con GitHub Actions
- Testing environments automáticos
- Cobertura de código con Jest
- Documentación automática con Swagger 