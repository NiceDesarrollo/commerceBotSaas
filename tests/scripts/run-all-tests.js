const axios = require('axios');
const path = require('path');

// Configuración base
const config = {
  baseUrl: 'http://localhost:3000/api',
  tenantId: 'cmdhkxgb90000ogtg90akfgel',
  adminCredentials: {
    email: 'admin@tenant.com',
    password: 'admin123'
  },
  testCredentials: {
    email: 'test@ejemplo.com',
    password: 'password123'
  }
};

// Utilidades
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) { log(`✅ ${message}`, colors.green); }
function error(message) { log(`❌ ${message}`, colors.red); }
function warning(message) { log(`⚠️  ${message}`, colors.yellow); }
function info(message) { log(`ℹ️  ${message}`, colors.blue); }
function title(message) { log(`\n${colors.bold}🎯 ${message}${colors.reset}`, colors.cyan); }

// Cliente HTTP con timeout
const http = axios.create({
  timeout: 10000,
  validateStatus: () => true // No lanzar error en códigos 4xx/5xx
});

let accessToken = '';

// Función para hacer requests
async function makeRequest(method, endpoint, data = null, expectedStatus = null, headers = {}) {
  try {
    const url = `${config.baseUrl}${endpoint}`;
    const requestConfig = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      requestConfig.data = data;
    }

    const response = await http(requestConfig);
    
    const statusCheck = expectedStatus ? 
      response.status === expectedStatus : 
      response.status >= 200 && response.status < 300;
    
    if (statusCheck) {
      success(`${method} ${endpoint} → ${response.status}`);
      return { success: true, data: response.data, status: response.status };
    } else {
      error(`${method} ${endpoint} → ${response.status} (esperado: ${expectedStatus || '2xx'})`);
      return { success: false, data: response.data, status: response.status };
    }
  } catch (err) {
    error(`${method} ${endpoint} → ERROR: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Verificar servidor
async function checkServer() {
  title('Verificando Servidor');
  
  try {
    const response = await http.get(`${config.baseUrl.replace('/api', '')}/api`);
    if (response.status === 404) {
      success('Servidor NestJS ejecutándose');
      return true;
    }
  } catch (error) {
    // Intentar endpoint específico
    try {
      await http.post(`${config.baseUrl}/auth/login`, {});
      success('Servidor NestJS ejecutándose');
      return true;
    } catch (e) {
      error('Servidor no disponible en http://localhost:3000');
      warning('Ejecuta: cd apps/api && npm run start:dev');
      return false;
    }
  }
  
  return true;
}

// Módulo de Autenticación
async function testAuthModule() {
  title('Probando Módulo de Autenticación');
  
  const tests = [
    {
      name: 'Login con credenciales válidas',
      request: () => makeRequest('POST', '/auth/login', config.adminCredentials, 200),
      onSuccess: (result) => {
        if (result.data?.accessToken) {
          accessToken = result.data.accessToken;
          success('Token JWT obtenido');
        }
      }
    },
    {
      name: 'Login con credenciales inválidas',
      request: () => makeRequest('POST', '/auth/login', {
        email: config.adminCredentials.email,
        password: 'password-incorrecto'
      }, 401)
    },
    {
      name: 'Login con email inválido',
      request: () => makeRequest('POST', '/auth/login', {
        email: 'email-invalido',
        password: config.adminCredentials.password
      }, 400)
    },
    {
      name: 'Registro con datos válidos',
      request: () => makeRequest('POST', '/auth/register', {
        email: config.testCredentials.email,
        password: config.testCredentials.password,
        tenantId: config.tenantId
      }, 201)
    },
    {
      name: 'Registro con email duplicado',
      request: () => makeRequest('POST', '/auth/register', config.adminCredentials, 409)
    }
  ];

  return await runTests(tests, 'Auth');
}

// Módulo de Usuarios
async function testUsersModule() {
  title('Probando Módulo de Usuarios');
  
  if (!accessToken) {
    error('No hay token disponible. Saltando pruebas de usuarios.');
    return { passed: 0, failed: 1, total: 1 };
  }

  const authHeaders = { Authorization: `Bearer ${accessToken}` };
  
  const tests = [
    {
      name: 'Obtener perfil de usuario (/me)',
      request: () => makeRequest('GET', '/users/me', null, 200, authHeaders)
    },
    {
      name: 'Listar usuarios del tenant (solo ADMIN)',
      request: () => makeRequest('GET', '/users/tenant-users', null, 200, authHeaders)
    },
    {
      name: 'Acceso sin token',
      request: () => makeRequest('GET', '/users/me', null, 401)
    },
    {
      name: 'Token inválido',
      request: () => makeRequest('GET', '/users/me', null, 401, { 
        Authorization: 'Bearer token-invalido' 
      })
    }
  ];

  return await runTests(tests, 'Users');
}

// Pruebas generales del sistema
async function testSystemEndpoints() {
  title('Probando Endpoints del Sistema');
  
  const tests = [
    {
      name: 'Endpoint inexistente',
      request: () => makeRequest('GET', '/endpoint-inexistente', null, 404)
    },
    {
      name: 'Método HTTP incorrecto',
      request: () => makeRequest('GET', '/auth/login', null, 405)
    }
  ];

  return await runTests(tests, 'System');
}

// Ejecutar grupo de pruebas
async function runTests(tests, moduleName) {
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      info(`Ejecutando: ${test.name}`);
      const result = await test.request();
      
      if (result.success) {
        passed++;
        if (test.onSuccess) {
          test.onSuccess(result);
        }
      } else {
        failed++;
      }
    } catch (error) {
      error(`Error en prueba: ${test.name} - ${error.message}`);
      failed++;
    }
  }
  
  const total = passed + failed;
  log(`\n📊 ${moduleName}: ${passed}/${total} pruebas exitosas`);
  
  return { passed, failed, total };
}

// Función principal
async function runAllTests() {
  console.clear();
  title('🧪 EJECUTANDO SUITE DE PRUEBAS COMPLETA');
  
  // Verificar servidor
  const serverOk = await checkServer();
  if (!serverOk) {
    return;
  }

  // Ejecutar todas las pruebas
  const results = [];
  
  results.push(await testAuthModule());
  results.push(await testUsersModule());
  results.push(await testSystemEndpoints());
  
  // Resumen final
  title('📈 RESUMEN FINAL');
  
  const totals = results.reduce((acc, result) => ({
    passed: acc.passed + result.passed,
    failed: acc.failed + result.failed,
    total: acc.total + result.total
  }), { passed: 0, failed: 0, total: 0 });
  
  log(`\n🎯 Resultados Generales:`);
  log(`   ✅ Exitosas: ${totals.passed}`);
  log(`   ❌ Fallidas: ${totals.failed}`);
  log(`   📊 Total: ${totals.total}`);
  
  const successRate = Math.round((totals.passed / totals.total) * 100);
  
  if (successRate >= 90) {
    success(`\n🎉 Excelente! ${successRate}% de pruebas exitosas`);
  } else if (successRate >= 70) {
    warning(`\n⚠️  Aceptable. ${successRate}% de pruebas exitosas`);
  } else {
    error(`\n💥 Crítico. Solo ${successRate}% de pruebas exitosas`);
  }

  // Información adicional
  log(`\n📝 Para pruebas más detalladas:`);
  log(`   • REST Client: tests/api/auth/auth-endpoints.http`);
  log(`   • REST Client: tests/api/users/users-endpoints.http`);
  log(`   • Análisis: node tests/scripts/list-endpoints.js`);
  
  // Módulos futuros
  log(`\n🔮 Módulos Futuros (plantillas disponibles):`);
  log(`   • Productos: tests/api/products/products-crud.http`);
  log(`   • IA Chat: tests/api/ai-conversations/ai-chat.http`);
}

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  error(`Error no manejado: ${error.message}`);
  process.exit(1);
});

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, config }; 