flowchart TD
    A[🏢 Empresario descubre CommerceBot SaaS] --> B{🎯 ¿Qué quiere hacer?}
    
    B -->|Registrar nueva empresa| C[📝 Crear cuenta empresarial]
    B -->|Ya tiene empresa| M[🔐 Login empleado existente]
    B -->|Solo probar| Z[🧪 Demo/Trial]
    
    C --> D[🏢 FORMULARIO REGISTRO EMPRESA<br/>- Nombre empresa<br/>- Email admin<br/>- Password<br/>- Dominio único<br/>- Plan básico/pro<br/>ACTUALMENTE NO EXISTE]
    
    D --> E{✅ Validación datos}
    E -->|❌ Error| F[❌ Email duplicado<br/>Slug ocupado<br/>Datos inválidos]
    F --> D
    
    E -->|✅ OK| G[🎉 CREAR TENANT + ADMIN<br/>1. Crear empresa en DB<br/>2. Crear usuario ADMIN<br/>3. Configurar bot por defecto<br/>4. Enviar email bienvenida]
    
    G --> H[📧 Email confirmación enviado<br/>Con link activación]
    H --> I[✅ Activar cuenta vía email]
    I --> J[🎉 EMPRESA ACTIVA<br/>Admin puede hacer login]
    
    J --> K[👤 Admin hace LOGIN]
    K --> L[🏠 Dashboard Admin<br/>- Configurar bot<br/>- Invitar empleados<br/>- Agregar productos<br/>- Integrar WhatsApp]
    
    L --> N[👥 INVITAR EMPLEADOS<br/>Email con link registro<br/>Link incluye tenantId]
    
    N --> O[👤 Empleado recibe email]
    O --> P[📝 Empleado se registra<br/>- Email<br/>- Password<br/>- TenantId automático<br/>- Rol USER por defecto]
    
    P --> Q[👤 Empleado hace LOGIN]
    Q --> R[🏠 Dashboard Empleado<br/>- Ver productos<br/>- Monitorear chats<br/>- Ver estadísticas]
    
    M --> K
    L --> S[🤖 CHATBOT CONFIGURADO]
    S --> T[📱 Cliente en WhatsApp<br/>Web chat<br/>Messenger]
    
    T --> U[💬 Cliente escribe mensaje]
    U --> V[🤖 Bot responde con productos del tenant<br/>Usando configuración personalizada]
    V --> W{👤 Cliente necesita humano?}
    
    W -->|❌ Bot resuelve| X[🎉 Venta automática]
    W -->|✅ Escalado| Y[📞 Transfer a empleado]
    
    X --> AA[📊 Métricas guardadas por tenant]
    Y --> AA
    AA --> BB[📈 Dashboard reportes empresa]
    
    Z --> CC[🧪 Demo con tenant temporal<br/>15 días gratis<br/>Datos de ejemplo]
    CC --> DD{¿Convierte?}
    DD -->|✅| C
    DD -->|❌| EE[🗑️ Auto-cleanup datos demo]