# Zustand

Es una herramienta que nos permite manejar estados en nuestras aplicaciones frontend, y está basada en Redux.

Para empezar tendremos que instalar Zustand:

```bash
npm i zustand
```

# Stores

Para ya crear nuestros Stores para guardar la información podemos hacer algo como lo siguiente:

```typescript
import { create } from 'zustand';

interface BearState {
    blackBears: number;
    polarBears: number;
    pandaBears: number;

    increaseBlackBears: (by: number) => void;
}

export const useBearStore = create<BearState>()((set)  => ({
    blackBears: 10,
    polarBears: 5,
    pandaBears: 1,
    
    increaseBlackBears: (by: number) => set((state)  => ({ blackBears: state.blackBears + by })),
}));
```

Y esto ya estará disponible para su uso. Sin embargo, para consumirlo tendremos que hacer lo siguiente:

```jsx
import { useBearStore } from '../../stores';
import { WhiteCard } from '../../components';

export const BearPage = () => {
    return (
        <>
            <h1>Contador de Osos</h1>

            <p>Manejo de estado simple de Zustand</p>

            <hr  />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <BlackBears />
            </div>
        </>
    );
};

export const BlackBears = () => {
    const blackBears = useBearStore((state) =>  state.blackBears);

    const increaseBlackBears = useBearStore((state)  => state.increaseBlackBears);

    return (
        <WhiteCard centered>
            <h2>Osos Negros</h2>

            <div  className="flex flex-col md:flex-row">
                <button onClick={ () => increaseBlackBears(1) }>+1</button>

                <span className="text-3xl mx-2 lg:mx-10">{ blackBears }</span>

                <button onClick={ () => increaseBlackBears(-1) }>-1</button>
            </div>
        </WhiteCard>
    );
};
```

Importante notar que estamos extrayendo los datos en diferentes líneas de código y no estamos haciendo destructuring, esto es porque esto puede generar que otros componentes se rendericen nuevamente de forma innecesaria, por esto es mejor sacar los datos por aparte.

Cuando en nuestro estado estamos usando objetos y se está detectando un re-render incluso aunque el objeto no ha cambiado, podemos hacer uso del `useShallow`:

```typescript
const bears = useBearStore(useShallow((state) => state.bears));
```


## Propiedades computadas

Cuando necesitamos hacer cálculos con datos de nuestro store, y no queremos hacerlos directamente en nuestros componentes (lo cual es lo ideal, no cargar con esta responsabilidad en nuestros componentes), podemos hacer uso de estas propiedades computadas:

```typescript
import { create } from 'zustand';

interface BearState {
    blackBears: number;
    polarBears: number;
    pandaBears: number;
    computed: {
        totalBears: number;
    };

    increaseBlackBears: (by: number) => void;
}

export const useBearStore = create<BearState>()((set, get)  => ({
    blackBears: 10,
    polarBears: 5,
    pandaBears: 1,
    computed: {
        get  totalBears() {
            return  get().blackBears  +  get().polarBears  +  get().pandaBears;
        },
    },
    
    increaseBlackBears: (by: number) => set((state)  => ({ blackBears: state.blackBears + by })),
}));
```

Importante notar que en la creación de nuestro Store, estamos usando tanto el `set` como el `get`, en el ejemplo anterior sólo usamos el primero., también si estamos usando Middlewares como el persist tendremos que sólo usar la función dentro de nuestra función de la siguiente forma:

```typescript
interface BearState {
    totalBears: () => number;
}

// En nuestro store dentro del persist
totalBears: ()  => {
    return get().blackBears + get().polarBears + get().pandaBears + get().bears.length;
},
```


# Middlewares

Los Middlewares son funciones que se ejecutan antes de crearse nuestros stores, y esto es muy útil dependiendo de lo necesitemos hacer.


## Persist

Nos permite guardar los datos de nuestro Store de forma persistente en LocalStorage, y esto hace que incluso recargando la aplicación los datos se mantienen. Para hacer uso de esto se debe usar el Middleware `persist` y tendremos que colocar como parámetros todo lo que se guardará en nuestro Store y adicional el nombre que queramos colocar a nuestro Store para guardarlo en el LocalStorage, en este caso el nombre es *person-storage*.

```typescript
import { create, type  StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}

const storeApi: StateCreator<PersonState & Actions> = (set) => ({
    firstName: '',
    lastName: '',

    setFirstName: (value: string) => set({ firstName: value }),
    setLastName: (value: string) => set({ lastName: value }),
});

export const usePersonStore = create<PersonState & Actions>()(
    persist(
        storeApi,
        {
            name: 'person-storage',
        }
    )
);
```

Si queremos usar un Storage distinto al LocalStorage (por ejemplo SessionStorage) podemos hacer lo siguiente:

```typescript
// session.storage.ts
import { createJSONStorage, StateStorage } from "zustand/middleware";

export const storageApi: StateStorage = {
    getItem: function (name: string): string | null | Promise<string | null> {
        const data = sessionStorage.getItem(name);

        return data;
    },
    setItem: function (name: string, value: string): void {
        sessionStorage.setItem(name, value);
    },
    removeItem: function (name: string): unknown | Promise<unknown> {
        throw new Error('Function not implemented.');
    }
};

export const customSessionStorage = createJSONStorage(() => storageApi);

// Nuestro Store
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { customSessionStorage } from '../storages/session.storage';

interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}

const storeApi: StateCreator<PersonState & Actions> = (set) => ({
    firstName: '',
    lastName: '',

    setFirstName: (value: string) => set({ firstName: value }),
    setLastName: (value: string) => set({ lastName: value }),
});

export const usePersonStore = create<PersonState & Actions>()(
    persist(
        storeApi,
        {
            name: 'person-storage',
            storage: customSessionStorage,
        }
    )
);
```


## Devtools

Si queremos que nuestro Store aparezca en las herramientas de Redux, el middleware Devtools es una excelente opción:

```typescript
import { create, type  StateCreator } from  'zustand';
import { devtools, persist } from 'zustand/middleware';

import { customSessionStorage } from '../storages/session.storage';

interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}

const storeApi: StateCreator<PersonState & Actions, [['zustand/devtools', never], ['zustand/persist', unknown]]> = (set) => ({
    firstName: '',
    lastName: '',

    setFirstName: (value: string) => set((state) => ({ firstName: value }), false, 'setFirstName'),
    setLastName: (value: string) => set((state) => ({ lastName: value }), false, 'setLastName'),
});

export const usePersonStore = create<PersonState & Actions>()(
    devtools(
        persist(
            storeApi,
            {
                name: 'person-storage',
                storage: customSessionStorage,
            }
        )
    )
);
```


## immer - Produce

Este viene en un paquete externo y nos permite ir manipulando el state sin necesidad de ir haciendo el operador spread:

```bash
npm i immer
```

Y luego para agregar nuestro nuevo elemento sin eliminar los anteriores:

```typescript
import { produce } from  'immer';

set(produce((state: TaskState) => {
    state.tasks[newTask.id] = newTask;
}));
```


## immer - Middleware

Para evitar instalar paquetes extra, podemos hacer uso del middleware que nos da Zustand para no tener que instalar immer.

```typescript
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useTaskStore = create<TaskState>()(
    devtools(
        immer(storeApi),
    )
);

// Nuestro set del store
set((state) => {
    state.tasks[newTask.id] = newTask;
});

// Y no podemos olvidar que en la creación de nuestro store necesitamos agregar nuestro type ['zustand/immer', never]
```


# Slices

Nos permiten dividir nuestros stores en pequeñas partes (slices) para hacerlo más fácil de mantener, y luego de puede juntar todo en nuestro store para aplicar los middlewares que necesitemos.


```typescript
// Nuestro slice
import { StateCreator } from 'zustand';

export interface PersonSlice {
    firstName: string;
    lastName: string;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
}

export const createPersonSlice: StateCreator<PersonSlice> = (set) => ({
    firstName: '',
    lastName: '',
    setFirstName: (firstName: string) =>  set({ firstName }),
    setLastName: (lastName: string) =>  set({ lastName }),
});

// Nuestro Bound Store
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createPersonSlice, PersonSlice } from './person.slice';

type ShareState = PersonSlice;

export const useWeddingBoundStore  =  create<ShareState>()(
    devtools(
        (...a) => ({
            ...createPersonSlice(...a),
        })
    )
);
```
