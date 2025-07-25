const fs = require('fs');
const path = require('path');

// Función para extraer rutas de un controlador
function extractRoutes(filePath, controllerName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = [];
    
    // Extraer el prefijo del controlador
    const controllerMatch = content.match(/@Controller\(['"]([^'"]*)['"]\)/);
    const controllerPrefix = controllerMatch ? controllerMatch[1] : '';
    
    // Buscar decoradores de rutas
    const routeMatches = content.matchAll(/@(Get|Post|Put|Delete|Patch)\(['"]?([^'")\s]*)?['"]?\)/g);
    
    for (const match of routeMatches) {
      const method = match[1].toUpperCase();
      const endpoint = match[2] || '';
      const fullPath = `/api/${controllerPrefix}${endpoint ? '/' + endpoint : ''}`.replace(/\/+/g, '/');
      
      routes.push({
        method,
        path: fullPath,
        controller: controllerName
      });
    }
    
    return { routes };
    
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return { routes: [] };
  }
}

console.log('🔍 ANALIZANDO ENDPOINTS DE LA API\n');

// Buscar todos los controladores desde la raíz del proyecto
const controllersDir = path.join(__dirname, '../../apps/api/src');

function findControllers(dir) {
  const controllers = [];
  
  function scanDir(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      
      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          scanDir(filePath);
        } else if (file.endsWith('.controller.ts')) {
          controllers.push({
            path: filePath,
            name: file.replace('.ts', ''),
            module: path.basename(path.dirname(filePath))
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error.message);
    }
  }
  
  scanDir(dir);
  return controllers;
}

const controllers = findControllers(controllersDir);

console.log('📁 CONTROLADORES ENCONTRADOS:');
controllers.forEach(ctrl => console.log(`- ${ctrl.name} (módulo: ${ctrl.module})`));
console.log('');

const publicEndpoints = [];
const protectedEndpoints = [];
const endpointsByModule = {};

controllers.forEach(controller => {
  console.log(`🔍 Analizando: ${controller.name}`);
  const analysis = extractRoutes(controller.path, controller.name);
  
  if (!endpointsByModule[controller.module]) {
    endpointsByModule[controller.module] = [];
  }
  
  analysis.routes.forEach(route => {
    // Verificar si el endpoint específico es público
    const content = fs.readFileSync(controller.path, 'utf8');
    const routeRegex = new RegExp(`@Public\\(\\)[\\s\\S]*?@${route.method.charAt(0) + route.method.slice(1).toLowerCase()}`, 'i');
    const isPublicRoute = routeRegex.test(content);
    
    const endpointInfo = { ...route, module: controller.module, isPublic: isPublicRoute };
    
    if (isPublicRoute) {
      publicEndpoints.push(endpointInfo);
    } else {
      protectedEndpoints.push(endpointInfo);
    }
    
    endpointsByModule[controller.module].push(endpointInfo);
    
    console.log(`  ${route.method} ${route.path} ${isPublicRoute ? '🔓' : '🔒'}`);
  });
  console.log('');
});

console.log('📋 RESUMEN POR MÓDULOS:\n');

Object.keys(endpointsByModule).forEach(module => {
  const moduleEndpoints = endpointsByModule[module];
  const publicCount = moduleEndpoints.filter(e => e.isPublic).length;
  const protectedCount = moduleEndpoints.filter(e => !e.isPublic).length;
  
  console.log(`🔹 ${module.toUpperCase()}:`);
  console.log(`   Total: ${moduleEndpoints.length} | Públicos: ${publicCount} | Protegidos: ${protectedCount}`);
  
  moduleEndpoints.forEach(endpoint => {
    console.log(`   ${endpoint.method.padEnd(6)} ${endpoint.path} ${endpoint.isPublic ? '🔓' : '🔒'}`);
  });
  console.log('');
});

console.log('📊 RESUMEN GENERAL:\n');

console.log('🔓 PÚBLICOS (No requieren autenticación):');
publicEndpoints.forEach(route => {
  console.log(`  ${route.method.padEnd(6)} ${route.path} (${route.module})`);
});

console.log('\n🔒 PROTEGIDOS (Requieren JWT):');
protectedEndpoints.forEach(route => {
  console.log(`  ${route.method.padEnd(6)} ${route.path} (${route.module})`);
});

console.log(`\n📈 ESTADÍSTICAS:`);
console.log(`- Módulos: ${Object.keys(endpointsByModule).length}`);
console.log(`- Públicos: ${publicEndpoints.length}`);
console.log(`- Protegidos: ${protectedEndpoints.length}`);
console.log(`- Total: ${publicEndpoints.length + protectedEndpoints.length}`);

// Generar archivo de resumen
const summary = {
  modules: Object.keys(endpointsByModule).length,
  public: publicEndpoints.length,
  protected: protectedEndpoints.length,
  total: publicEndpoints.length + protectedEndpoints.length,
  endpoints: {
    public: publicEndpoints,
    protected: protectedEndpoints
  },
  byModule: endpointsByModule
};

const summaryPath = path.join(__dirname, '../docs/endpoints-summary.json');
fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

console.log(`\n💾 Resumen guardado en: tests/docs/endpoints-summary.json`); 