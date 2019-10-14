## Store definition

You will need to define your store and drivers Type in order to use them in listerners and storeToProps functions, and thus have autocompletion.

```
import { createStore, types, Types, StoreBase } from "k-ramel";
import http, { HTTPDriver } from "@k-ramel/driver-http";

// this is our Todo type
export type Todo = {
  id: number;
  title: string;
};

// here we define the final Type of our store (once created)
// it extends StoreBase which includes the dispatch function
// this type will be used in other functions like storeToProps
export interface Store extends StoreBase {
  todos: Types.KeyValue<Todo, number>;
  loaders: {
    todos: Types.Bool;
  };
}

// here we define the final Type of our drivers
export type Drivers = {
  http: HTTPDriver;
};

// store definition
export const store = createStore<Store>(
  {
    todos: types.keyValue(),
    loaders: {
      todos: types.bool({ defaultData: true })
    }
  },
  {
    drivers: {
      http: http()
    }
  }
);
```

## storeToProps

```
// base props for our component
interface IOwnProps {
  title: string;
}

// storeToProps definition
// Store type is the one that we manually defined above
// as third argument, we could add drivers: Drivers
// (Drivers type would be the one defined above as well)
const storeToProps = (store: Store, { title }: IOwnProps) => ({
  todos: store.todos.getAsArray(),
  title: `${title} (${store.todos.getLength()})`,
  loading: store.loaders.todos.get()
});

// Final type definition
interface IProps extends IOwnProps, ReturnType<typeof storeToProps> {}

const Component = ({ title, todos, loading}: IProps) => (
  <div>
    <h2>{title}</h2>
    <TodoForm />
    {loading && "Loading"}
    {!loading && (
      <ul>
        {todos.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    )}
  </div>
)

export const Todos = listen(listeners, "Todos")(
  inject(storeToProps)(Component)
);
```

## Reactions

Action types must extends BaseAction (which includes only a type attribute as string).

Reaction functions must be of type ReactionType.

For reactions that don't use arguments, you don't have to specify action, store nor drivers types :

```
export const sayHi: ReactionType = () => {
  console.log("Hi! ");
};
```

Here are some examples using `@k-ramel/driver-http`

```
export const getTodos: ReactionType<BaseAction, Store, Drivers> = (
  action,
  store,
  { http }
) => {
  http("GET_TODOS").get("/api/todos");
};

export const setTodos: ReactionType<HTTPBaseAction<Todo[]>, Store> = (
  { payload },
  store
) => {
  store.todos.set(payload);
  store.loaders.todos.set(false);
};

interface AddTodoAction extends BaseAction {
  title: string;
}
export const addTodo: ReactionType<AddTodoAction, Store, Drivers> = (
  { title },
  store,
  { http }
) => {
  http("ADD_TODO").post("/api/todo", { title });
};

export const setNewTodo: ReactionType<HTTPBaseAction<Todo>, Store> = (
  { payload },
  store
) => {
  store.todos.add(payload);
};
```
