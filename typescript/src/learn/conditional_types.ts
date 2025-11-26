/// This file is to learn about conditional types in Typescript.

type IdLabel = {
  id: number;
};

type NameLabel = {
  name: string;
};

// === Uncomment to see the exmaple ===
// function createLabel(id: number): IdLabel;
// function createLabel(name: string): NameLabel;
// function createLabel(idOrName: number | string): IdLabel | NameLabel;
// function createLabel(idOrName: number | string): IdLabel | NameLabel {
//   throw new Error("Method is not implemented!");
// }

// function exmaple1() {
//   const nameLabel = createLabel("This should be a NameLabel");
//   const idLabel = createLabel(1);
//   const check: number = 3;
//   const conditionalLabel = createLabel(check % 2 === 0 ? 1 : 'string');
// }

// Using conditional returned type => don't need to create 3 overload functions
type IdLabelOrNameLabel<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
function createLabel<T extends number | string>(
  labelValue: T,
): IdLabelOrNameLabel<T> {
  throw new Error("Method is not implemented!");
}

function example2() {
  const check: number = 3;
  const idLabel = createLabel(1);
  const nameLabel = createLabel("should be NameLabel");
  const conditionalLabel = createLabel(check % 2 === 0 ? 1 : "string");
}

// Conditional Type Constraints

// We can use conditional to check the constrains.

type Email = {
  message: string;
};

type NoMessageType = {
  something: number;
};

// First we can use the conditional to both check the constrains and infer the constrains type, in this case, the constrains is the T type must have the message field.
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

type MessageOfEmail = MessageOf<Email>;

type MessageOfNoMessageType = MessageOf<NoMessageType>;

type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number[]>; // number

// Inferring Within Conditional Types

// If T is a function, return the Return Type of T, otherwise return T itself
type GetReturnedType<T> = T extends (...args: never[]) => infer Return
  ? Return
  : T;

type Str1 = GetReturnedType<() => string>;

type Num1 = GetReturnedType<() => number>;

type SameT = GetReturnedType<{ a: number }>;

// Distributive Conditional Types

type ToArrayTypeDis<T> = T extends any ? T[] : never;

type NumArray = ToArrayTypeDis<number>;

type StringArray = ToArrayTypeDis<string>;

type ShouldBeStringOrNumArray = ToArrayTypeDis<string | number>; // string[] | number[]; <-- type Distributive

type ToArrayTypeNonDis<T> = [T] extends [any] ? T[] : never;

type StringOrNumArray = ToArrayTypeNonDis<string | number>; // (string|number)[]
