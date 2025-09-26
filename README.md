# useFetch Hook

Un hook de React simple y eficiente para realizar peticiones HTTP. Incluye manejo automático de estados de carga, cancelación de peticiones y soporte para todos los métodos HTTP.

## ¿Qué hace?

Este hook personalizado simplifica las peticiones HTTP en componentes de React proporcionando:

- **Manejo automático de loading** - Controla el estado de carga automáticamente
- **Cancelación inteligente** - Cancela peticiones cuando el componente se desmonta
- **Soporte completo HTTP** - GET, POST, PUT, DELETE, PATCH
- **Compatible con FormData** - Maneja automáticamente FormData y JSON
- **Tipado TypeScript** - Completamente tipado para mayor seguridad
- **Manejo de errores** - Captura y estructura errores de forma consistente

## Uso básico

```tsx
import { useFetch } from "./useFetch";

function UserProfile() {
  const { request, isLoading } = useFetch();

  const fetchUser = async () => {
    const result = await request<User>("/api/users/123");

    if (result.data) {
      console.log("User:", result.data);
    } else {
      console.error("Error:", result.error);
    }
  };

  return (
    <div>
      <button onClick={fetchUser} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get User"}
      </button>
    </div>
  );
}
```

## Ejemplos de uso

### Petición GET

```tsx
const { request, isLoading } = useFetch();

const fetchUsers = async () => {
  const { data, error, status } = await request<User[]>("/api/users");

  if (data) setUsers(data);
};
```

### Petición POST con datos JSON

```tsx
const createUser = async (userData: CreateUserData) => {
  const { data, error } = await request<User>("/api/users", {
    method: "post",
    body: userData,
    headers: { Authorization: "Bearer token123" },
  });

  if (data) {
    console.log("User created:", data);
  }
};
```

### Subida de archivos con FormData

```tsx
const uploadAvatar = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data, error } = await request<UploadResponse>(`/api/users/${userId}/avatar`, {
    method: "post",
    body: formData,
  });

  if (data) {
    console.log("Avatar uploaded:", data.url);
  }
};
```

### Actualizar con PUT

```tsx
const updateUser = async (userId: string, userData: UpdateUserData) => {
  const { data, error, status } = await request<User>(`/api/users/${userId}`, {
    method: "put",
    body: userData,
  });

  if (status === 200 && data) {
    setUser(data);
  }
};
```

### Eliminar con DELETE

```tsx
const deleteUser = async (userId: string) => {
  const { error, status } = await request(`/api/users/${userId}`, { method: "delete" });

  if (status === 204) {
    console.log("User deleted successfully");
    fetchUsers(); // Refresh list
  }
};
```

## Referencia de la API

### useFetch()

Retorna un objeto con:

- `request<T>()` - Función para realizar peticiones HTTP
- `isLoading` - Boolean que indica si hay una petición en curso

### request<T>(endpoint, options?)

**Parámetros:**

- `endpoint`: `string` - URL del endpoint
- `options?`: `RequestInit` - Opciones de la petición (acepta todas las opciones de fetch nativo)
  - `method?`: `string` - Método HTTP (por defecto "GET")
  - `body?`: `any` - Datos a enviar
  - `headers?`: `Record<string, string>` - Headers adicionales
  - `cache?`, `credentials?`, `mode?`, `redirect?`, `referrer?`, etc.

**Retorna:**

```tsx
Promise<{
  data: T | null;
  error: any;
  status: number;
}>;
```

## Características especiales

**Cancelación automática**: Las peticiones se cancelan automáticamente cuando el componente se desmonta, evitando memory leaks.

**Detección automática de Content-Type**:

- Objetos JavaScript se serializan a JSON automáticamente
- FormData se envía directamente sin modificar headers
- Otros tipos se envían tal como están

**Estado de carga global**: El estado `isLoading` se mantiene actualizado durante todas las peticiones del hook.
