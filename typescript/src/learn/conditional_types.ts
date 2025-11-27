/// File này là để học về Conditional Types trong Typescript
///
/// Conditional Types là việc có thể cấu thành Type từ điều kiện logic

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

// Sử dụng conditional type để lựa chọn kiểu trả về phù hợp.
// Nhờ vậy không cần phải dùng đến ba khai báo overload để đạt được hiệu ứng tương tự
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

// Có thể dùng extends để kiểm tra các quy tắc ràng buộc kết hợp với Conditional Type
// Ví dụ bên dưới chúng ta sẽ kiểm tra nếu Type (T) có field message bên trong nó sẽ lấy kiểu là kiểu của field "message"
// Nếu không sẽ trả về kiểu never

type Email = {
  message: string;
};

type NoMessageType = {
  something: number;
};

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

type MessageOfEmail = MessageOf<Email>;

type MessageOfNoMessageType = MessageOf<NoMessageType>;

type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number[]>; // number

// Inferring Within Conditional Types

// Có thể dùng từ khóa infer để khai báo (giới thiệu) về một type mới
// ví dụ bên dưới dùng infer để giới thiệu về type Return là kiểu trả về của hàm số đầu vào
//
// Giải thích: GetReturnedType<T> nếu T là một hàm số (không quan tâm đến số lượng tham số của nó) thì sẽ trả về kiểu trả về của nó (Return)
type GetReturnedType<T> = T extends (...args: never[]) => infer Return
  ? Return
  : T;

type Str1 = GetReturnedType<() => string>;

type Num1 = GetReturnedType<() => number>;

type SameT = GetReturnedType<{ a: number }>;

// Distributive Conditional Types
//
// Conditional Types cũng có tính phân phối như những type generic khác
//
// ToArrayTypeDis<T> sẽ phân phôi các type nếu T là một union type ví dụ như string | number
// Thì kết quả sẽ là string[] | number[]
//
// Nếu không muốn union bị phân phối mà là gộp (string|number)[] thì dùng [T] để gói tính phân phối lại

type ToArrayTypeDis<T> = T extends any ? T[] : never;

type NumArray = ToArrayTypeDis<number>;

type StringArray = ToArrayTypeDis<string>;

type ShouldBeStringOrNumArray = ToArrayTypeDis<string | number>; // string[] | number[]; <-- type Distributive

type ToArrayTypeNonDis<T> = [T] extends [any] ? T[] : never;

type StringOrNumArray = ToArrayTypeNonDis<string | number>; // (string|number)[]
