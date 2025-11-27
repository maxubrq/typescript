// Template Literal Types
//
// Template Literal Types được xây dựng dựa trên String Literal Types, và có tính phân phối

type Hello = "Hello";
type HelloWorld = `${Hello}_World`;

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;

// Sức mạnh thật sự của Template Literal Type nằm ở việc có thể tạo ra chuổi mới dựa trên thông tin của base type.

// Ví dụ trong trường hợp chúng ta muốn tạo ra một hàm (makeWatchObject) hàm nãy sẽ thêm một method 'on' vào object đầu vào
//
// Hàm `on` được thêm vào này cần có 2 đối số:
//
// - eventName: string;
// - callback: Function;
//
// trong đó eventName sẽ là tên của thuộc tính cụ thể của object + Changed ví dụ field là name thì event sẽ là nameChanged.
// và callback cần nhận vào input cùng kiểu với field được thay đổi, ví dụ name là kiểu string thì argument của callback phải thuộc kiểu string;

var baseObject = {
  name: "Max",
  email: "thisisemail@gmail.com",
  age: 10,
};

// Với base object như trên thì hàm on sẽ giống như sau on(eventName: "nameChanged"| "emailChanged"|"ageChanged", callback: (newValue)=>void) => void;

type PropEventSource<Type> = {
  on<Key extends string & keyof Type>( // trính xuất các key trong Type, chỉ lấy các key là string
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void,
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type,
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("ageChanged", (age) => {});
person.on("firstNameChanged", (name) => {});
