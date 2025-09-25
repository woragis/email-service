# Stores Directory

This directory contains Zustand stores for global state management.

## Structure

```
stores/
├── auth.ts          # Authentication state store
├── index.ts         # Store exports
└── [feature].ts     # Feature-specific stores
```

## Store Patterns

### 1. Authentication Store (`auth.ts`)
Global authentication state management:
- User data
- Authentication status
- Login/logout actions
- Token management

### 2. Feature Store Pattern
```typescript
// stores/[feature].ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface YourFeatureState {
  data: YourDataType[];
  loading: boolean;
  error: string | null;
}

interface YourFeatureActions {
  setData: (data: YourDataType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchData: () => Promise<void>;
  addItem: (item: YourDataType) => void;
  updateItem: (id: string, updates: Partial<YourDataType>) => void;
  deleteItem: (id: string) => void;
}

export const useYourFeatureStore = create<YourFeatureState & YourFeatureActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        data: [],
        loading: false,
        error: null,

        // Actions
        setData: (data) => set({ data }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        fetchData: async () => {
          set({ loading: true, error: null });
          try {
            const data = await yourApi.getAll();
            set({ data, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        addItem: (item) => set((state) => ({
          data: [...state.data, item]
        })),

        updateItem: (id, updates) => set((state) => ({
          data: state.data.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        })),

        deleteItem: (id) => set((state) => ({
          data: state.data.filter(item => item.id !== id)
        })),
      }),
      {
        name: 'your-feature-store', // localStorage key
        partialize: (state) => ({ data: state.data }), // Only persist specific fields
      }
    ),
    {
      name: 'YourFeatureStore', // DevTools name
    }
  )
);
```

## Store Best Practices

### 1. State Structure
- Keep state flat and normalized when possible
- Use meaningful property names
- Group related state together

### 2. Actions
- Make actions pure and predictable
- Use descriptive action names
- Handle async operations properly

### 3. Middleware Usage
- Use `devtools` for debugging in development
- Use `persist` for state that should survive page refreshes
- Be selective about what gets persisted

### 4. Type Safety
```typescript
// Define clear interfaces
interface StoreState {
  // State properties
}

interface StoreActions {
  // Action methods
}

// Combine them
type Store = StoreState & StoreActions;
```

## Export Pattern

```typescript
// stores/index.ts
export { useAuthStore } from './auth';
export { useYourFeatureStore } from './yourFeature';
```

## Usage Examples

### Basic Usage
```typescript
import { useYourFeatureStore } from '@/stores';

function MyComponent() {
  const { data, loading, fetchData } = useYourFeatureStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSpinner />;

  return <DataList data={data} />;
}
```

### Selective State Access
```typescript
// Only subscribe to specific state changes
function DataList() {
  const data = useYourFeatureStore((state) => state.data);
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
}

function LoadingIndicator() {
  const loading = useYourFeatureStore((state) => state.loading);
  return loading ? <Spinner /> : null;
}
```

### Actions Only
```typescript
// Subscribe only to actions (no re-renders on state changes)
function ActionButtons() {
  const { addItem, updateItem, deleteItem } = useYourFeatureStore(
    (state) => ({
      addItem: state.addItem,
      updateItem: state.updateItem,
      deleteItem: state.deleteItem,
    })
  );

  return (
    <div>
      <button onClick={() => addItem(newItem)}>Add</button>
      <button onClick={() => updateItem(id, updates)}>Update</button>
      <button onClick={() => deleteItem(id)}>Delete</button>
    </div>
  );
}
```

## When to Use Stores

Use Zustand stores for:
- ✅ Global application state
- ✅ State shared across multiple components
- ✅ Complex state with multiple actions
- ✅ State that needs to persist across page navigation

Don't use stores for:
- ❌ Local component state (use useState)
- ❌ Server state (use React Query)
- ❌ Simple props drilling (use composition)
- ❌ Form state (use form libraries)

## Integration with React Query

```typescript
// Combine Zustand with React Query
export const useYourFeatureStore = create((set, get) => ({
  // ... state and actions

  fetchData: async () => {
    set({ loading: true });
    try {
      // Use React Query for server state
      const queryClient = useQueryClient();
      const data = await queryClient.fetchQuery({
        queryKey: ['yourData'],
        queryFn: yourApi.getAll,
      });
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```
