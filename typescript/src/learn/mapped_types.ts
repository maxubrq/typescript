// Mapped Type
//
// Dùng để tạo một type mới (dạng map) thường đi chung với <keyof T>

type Features = {
  toggleTheme: (theme: string) => string;
  selectLocale: (locale: string) => string;
};

// Để có thể tạo một configuration type cho cách tính năng này thường bạn sẽ phải làm như sau

type FeatureFlags1 = {
  toogleTheme: boolean;
  selectLocale: boolean;
};

// Việc này lặp lại hành động và tạo ra một khoảng hở đồng bộ giữa các tính năng và feature flag tương ứng
// Ví dụ bạn thêm tính năng vào Features nhưng lại quên update FeatureFlag cho nó.
//
// Để giảm lặp lại và đồng bộ chúng ta có thể tạo một Mapped Feature Flag

// Với mọi property trong type feature đầu vào, sẽ có một property với kiểu boolean tương ứng
type MappedToBoolean<Features> = {
  [Property in keyof Features]: boolean;
};

// Ở đây chúng ta sẽ có Feature Flags đồng bộ với bộ Feature tương ứng
type MappedFeatureFlags = MappedToBoolean<Features>;

// Mapping Modifiers

// Chúng ta cũng có thể dùng Mapped Type để biến đổi khả năng truy cập của các field
// có thể sử dụng `readonly`, `?`, `+` và '-' để thêm bớt các modifier.

// Ví dụ có thể biến các field readonly trong Type nguyên thủy thàn mutable thông qua

type CreateMutableType<T> = {
  -readonly [Property in keyof T]: T[Property];
};

type LockedReadonlySomeFields = {
  readonly a: string;
  readonly b: string;
  c: string;
};

// Bây giờ chúng ta có thể có cả 3 field đều có thể mutable
type MutableFromReadonly = CreateMutableType<LockedReadonlySomeFields>;

// Và cũng có thể làm ngược lại
type CreateViewType<T> = {
  +readonly [Property in keyof T]: T[Property];
};

type MutableAllFields = {
  a: string;
  b: string;
  c: string;
};

type ViewOnlyAllFields = CreateViewType<LockedReadonlySomeFields>;
type ViewOnlyAllFields1 = CreateViewType<MutableAllFields>;

// Cũng có thể dùng `-` và `+` như sau
//
// Ví dụ loại thay optional fields thành require fields

type OptionalInSomeFields = {
  a: string;
  b?: string;
  c: number;
  d?: number;
};

type ToRequire<T> = {
  [Property in keyof T]-?: T[Property];
};

type AllFieldsRequiredType = ToRequire<OptionalInSomeFields>;

type ToOptionals<T> = {
  [Property in keyof T]+?: T[Property];
};

type AllFieldsOptionalType = ToOptionals<OptionalInSomeFields>;

// Key Remapping via `as`

// Quay lại với ví dụ về FeatureFlags, hiện tại dùng đúng mapping và sync tuy nhiên tên của các feature flags chưa giống trong thực tế
// Ví dụ toggleTheme feature sẽ có feature flag là toggleThemeEnabled, chúng ta có thể map lại key name bằng từ khóa `as`

type GetFeatureFlagsOf<Feature> = {
  [F in keyof Feature as `${string & F}Enabled`]: boolean;
};

type FeatureFlags = GetFeatureFlagsOf<Features>;

// Chúng ta cũng có thể filter field bằng các kiểu type điều kiện có trả về never

type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

// Chúng ta có thể map sử dụng union của bất kỳ type nào chứ không chỉ là primary type

type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;

// Chúng ta có thể sử dụng Mapped type phối hợp với các tính năng type khác, ví dụ như Conditional type

type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
