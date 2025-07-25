# 🧪 **Tests del Proyecto CommerceBot SaaS**

Estructura organizada de pruebas para todos los módulos del sistema.

## 📁 **Estructura de Carpetas**

```
tests/
├── README.md                    # Esta documentación
├── scripts/                     # Scripts de análisis y utilidades
│   ├── list-endpoints.js        # Análisis automático de endpoints
│   └── run-all-tests.js         # Ejecutar todas las pruebas
├── api/                         # Pruebas de endpoints REST
│   ├── auth/                    # Módulo de autenticación
│   ├── users/                   # Módulo de usuarios
│   ├── products/                # Módulo de productos (futuro)
│   ├── ai-conversations/        # Módulo de conversaciones IA (futuro)
│   └── common/                  # Pruebas comunes
├── integration/                 # Pruebas de integración
├── performance/                 # Pruebas de rendimiento
└── docs/                        # Documentación de testing
    ├── testing-guide.md         # Guía de testing
    └── api-standards.md         # Estándares de API
```

## 🚀 **Cómo Usar**

### **Para usar REST Client:**
1. Instalar extensión "REST Client" en VS Code/Cursor
2. Abrir cualquier archivo `.http` en la carpeta `api/`
3. Click en "Send Request" sobre cada endpoint

### **Para ejecutar scripts de análisis:**
```bash
cd tests/scripts
node list-endpoints.js           # Listar todos los endpoints
node run-all-tests.js           # Ejecutar todas las pruebas
```

## 📋 **Módulos Actuales**

### ✅ **Auth** - Autenticación JWT
- Login/Registro
- Validaciones
- Protección de rutas

### ✅ **Users** - Gestión de usuarios  
- Perfiles
- Multiempresa
- Autorización por roles

## 🔮 **Módulos Futuros**

### 🛒 **Products** - CRUD de productos
- Crear/editar/eliminar productos
- Categorías y filtros
- Inventario por tenant

### 🤖 **AI Conversations** - Chat con IA
- Conversaciones inteligentes
- Historial por cliente
- Configuración de prompts

### 📊 **Analytics** - Métricas y reportes
- Estadísticas de ventas
- Comportamiento de usuarios
- KPIs por tenant

## 🎯 **Convenciones de Naming**

### **Archivos REST Client:**
```
{modulo}-{tipo}.http
Ejemplos:
- auth-endpoints.http
- auth-validations.http
- products-crud.http
- ai-conversations.http
```

### **Scripts JavaScript:**
```
{modulo}-{accion}.js
Ejemplos:
- auth-test-suite.js
- products-bulk-test.js
- ai-performance-test.js
```

## 📊 **Status de Testing**

| Módulo | REST Tests | Scripts | Integration | Performance |
|--------|------------|---------|-------------|-------------|
| Auth | ✅ | ✅ | ⏳ | ⏳ |
| Users | ✅ | ✅ | ⏳ | ⏳ |
| Products | ⏳ | ⏳ | ⏳ | ⏳ |
| AI Chat | ⏳ | ⏳ | ⏳ | ⏳ |

**Leyenda:** ✅ Completo | ⏳ Pendiente | ❌ Bloqueado

## 🔧 **Configuración**

### **Variables Globales:**
Definidas en cada archivo `.http`:
```http
@baseUrl = http://localhost:3000/api
@tenantId = cmdhkxgb90000ogtg90akfgel
```

### **Tokens de Prueba:**
Se generan dinámicamente en cada sesión de testing.

## 📝 **Contribuir**

1. **Crear nuevos módulos** siguiendo la estructura existente
2. **Documentar endpoints** en archivos `.http`
3. **Agregar scripts** de análisis cuando sea necesario
4. **Actualizar este README** con los cambios 