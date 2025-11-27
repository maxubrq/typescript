// Generic & Generic Composition
//
// Generic Composition đem lại
// - type phức tạp hơn
// - vừa strict vừa flexible
// - suy luận tốt hơn, ít any hơn

// Compose Generic Types

// 1. Bọc Generic

type ApiResponseOf<T> = {
  data?: T;
  error?: Error;
};

type User = {
  username: string;
  email: string;
};

type UserApiResonse = ApiResponseOf<User>;

// 2. Nested Generic

type PaginatedResponseOf<T> = {
  data: T[];
  totalPage: number;
  current: number;
  prev: number;
  next: number;
};

type PaginatedUsersApiResponse = ApiResponseOf<PaginatedResponseOf<User>>;

// Compose Generic Functions

// 1. HOF generics

function withLoggin<T, R>(fn: (...args: T[]) => R) {
  return (...args: T[]): R => {
    console.log(`args: ${arguments}`);
    return fn(...args);
  };
}

function add(a: number, b: number) {
  return a + b;
}

const addWithLogging = withLoggin(add);
addWithLogging(1, 2);

// 2. Chaining generics

function map<T, U>(arr: T[], fn: (x: T) => U): U[] {
  return arr.map(fn);
}

function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C {
  return (a) => bc(ab(a));
}

// Generic Composition với Utility Types

// 1. Merge 2 generic types

type Merge<T, U> = T & U;

type WithID<T> = T & { id: string };

type User1 = { name: string };

type UserWithID = WithID<User1>;

// 2. Conditional + generic composition
type Response<T> = T extends Error
  ? { status: "error"; error: T }
  : { status: "success"; data: T };
