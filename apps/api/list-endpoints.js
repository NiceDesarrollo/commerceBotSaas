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
    
    // Verificar si es público
    const isPublic = content.includes('@Public()');
    
    return { routes, isPublic: content.includes('@Public()') };
    
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return { routes: [], isPublic: false };
  }
}

console.log('🔍 ANALIZANDO ENDPOINTS DE LA API\n');

// Buscar todos los controladores
const controllersDir = path.join(__dirname, 'src');

function findControllers(dir) {
  const controllers = [];
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (file.endsWith('.controller.ts')) {
        controllers.push({
          path: filePath,
          name: file.replace('.ts', '')
        });
      }
    }
  }
  
  scanDir(dir);
  return controllers;
}

const controllers = findControllers(controllersDir);

console.log('📁 CONTROLADORES ENCONTRADOS:');
controllers.forEach(ctrl => console.log(`- ${ctrl.name}`));
console.log('');

const publicEndpoints = [];
const protectedEndpoints = [];

controllers.forEach(controller => {
  console.log(`🔍 Analizando: ${controller.name}`);
  const analysis = extractRoutes(controller.path, controller.name);
  
  analysis.routes.forEach(route => {
    // Verificar si el endpoint específico es público
    const content = fs.readFileSync(controller.path, 'utf8');
    const routeRegex = new RegExp(`@Public\\(\\)[\\s\\S]*?@${route.method.charAt(0) + route.method.slice(1).toLowerCase()}`, 'i');
    const isPublicRoute = routeRegex.test(content);
    
    if (isPublicRoute) {
      publicEndpoints.push(route);
    } else {
      protectedEndpoints.push(route);
    }
    
    console.log(`  ${route.method} ${route.path} ${isPublicRoute ? '🔓' : '🔒'}`);
  });
  console.log('');
});

console.log('📋 RESUMEN DE ENDPOINTS:\n');

console.log('🔓 PÚBLICOS (No requieren autenticación):');
publicEndpoints.forEach(route => {
  console.log(`  ${route.method.padEnd(6)} ${route.path}`);
});

console.log('\n🔒 PROTEGIDOS (Requieren JWT):');
protectedEndpoints.forEach(route => {
  console.log(`  ${route.method.padEnd(6)} ${route.path}`);
});

console.log(`\n📊 TOTALES:`);
console.log(`- Públicos: ${publicEndpoints.length}`);
console.log(`- Protegidos: ${protectedEndpoints.length}`);
console.log(`- Total: ${publicEndpoints.length + protectedEndpoints.length}`); 